<template>
  <div class="global-search">
    <div class="search-bar">
      <Icon icon="mdi:magnify" class="search-icon" />
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search products or categories..."
        class="search-input"
        @keyup.esc="clearSearch"
        @focus="handleFocus"
        @blur="handleBlur"
        @mousedown="handleMouseDown"
      />
    </div>

    <div 
      v-if="(searchTerm.trim() && isFocused) || filteredResults.length > 0" 
      class="search-results-dropdown"
      @mousedown.prevent
    >
      <div v-if="filteredResults.length" class="results-grid">
        <template v-for="item in filteredResults" :key="item.data._id">
          <div class="search-result-item" @click="handleItemClick(item)">
            <div v-if="item.type === 'category'">
              <h4 v-html="highlightMatch(item.data.category_name)"></h4>
              <p>Category</p>
            </div>
            <div v-else-if="item.type === 'subcategory'">
              <h4 v-html="highlightMatch(item.data.subcategory_name)"></h4>
              <p>Subcategory</p>
            </div>
            <div v-else-if="item.type === 'subsubcategory'">
              <h4 v-html="highlightMatch(item.data.subsubcategory_name)"></h4>
              <p>Sub-subcategory</p>
            </div>
            <div v-else-if="item.type === 'product'">
              <h4 v-html="highlightMatch(item.data.product_name)"></h4>
              <p>Product</p>
            </div>
          </div>
        </template>
      </div>
      <div v-else class="no-results">
        No results found for "{{ searchTerm }}"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash'
import { Icon } from '@iconify/vue'

const props = defineProps({
  allCategories: { type: Array, default: () => [] },
  allSubcategories: { type: Array, default: () => [] },
  allSubsubcategories: { type: Array, default: () => [] },
  allProducts: { type: Array, default: () => [] }
})

const emit = defineEmits(['navigate-state', 'search-state'])

const searchTerm = ref('')
const isFocused = ref(false)
const clickedItem = ref(false);

const filteredResults = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) return []

  const match = (name) => name?.toLowerCase().includes(keyword)

  return [
    ...(props.allCategories || [])
      .filter(cat => match(cat.category_name))
      .map(cat => ({ type: 'category', data: cat })),

    ...(props.allSubcategories || [])
      .filter(subcat => match(subcat.subcategory_name))
      .map(subcat => ({ type: 'subcategory', data: subcat })),

    ...(props.allSubsubcategories || [])
      .filter(sscat => match(sscat.subsubcategory_name))
      .map(sscat => ({ type: 'subsubcategory', data: sscat })),

    ...(props.allProducts || [])
      .filter(prod => match(prod.product_name))
      .map(prod => ({ type: 'product', data: prod }))
  ].slice(0, 10) // Limit to 10 results for performance
})

const handleItemClick = (item) => {
  clickedItem.value = true;
  emit('navigate-state', { type: item.type, data: item.data })
  searchTerm.value = ''
  isFocused.value = false
}

const clearSearch = () => {
  searchTerm.value = ''
  isFocused.value = false
}

const handleBlur = () => {
  // Only hide if not clicking on a result item
  if (!clickedItem.value) {
    setTimeout(() => {
      isFocused.value = false;
    }, 200);
  }
  clickedItem.value = false;
};

const handleFocus = () => {
  isFocused.value = true;
  clickedItem.value = false;
};

const handleMouseDown = () => {
  // Prevent blur from triggering when clicking the input
  clickedItem.value = true;
};

const highlightMatch = (text) => {
  const keyword = searchTerm.value.trim()
  if (!keyword) return text
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return String(text).replace(regex, '<span class="highlight">$1</span>')
}

watch(searchTerm, debounce(() => {
  emit('search-state', {
    isSearching: !!searchTerm.value.trim(),
    results: filteredResults.value
  })
}, 300))
</script>

<style scoped>
.global-search {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.search-bar {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  border: 2px solid #2F8F9D;
  border-radius: 9999px;
  padding: 10px 18px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.25s ease;
}

.search-bar:hover {
  border-color: #276c73;
  background: rgba(255, 255, 255, 0.95);
}

.search-icon {
  font-size: 1.4rem;
  color: #2F8F9D;
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1rem;
  color: #333;
  min-width: 0; /* Prevent overflow */
}

.search-input::placeholder {
  color: #666;
}

.search-results-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background: white;
  width: 100%;
  margin-top: 8px;
  border: 1px solid #ddd;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  max-height: min(350px, 70vh);
  overflow-y: auto;
}

.results-grid {
  display: flex;
  flex-direction: column;
}

.search-result-item {
  padding: 14px 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f2f9fa;
}

.search-result-item h4 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
}

.search-result-item p {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #555;
}

.no-results {
  padding: 14px;
  text-align: center;
  color: #666;
  font-style: italic;
  font-size: 0.9rem;
}

:deep(.highlight) {
  background-color: #fffa91;
  padding: 0 2px;
  border-radius: 4px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .global-search {
    width: 100%;
    padding: 0 15px;
  }

  .search-bar {
    padding: 8px 15px;
  }

  .search-icon {
    font-size: 1.2rem;
    margin-right: 8px;
  }

  .search-input {
    font-size: 0.95rem;
  }

  .search-results-dropdown {
    position: fixed;
    left: 15px;
    right: 15px;
    width: auto;
    max-height: min(400px, 60vh);
    border-radius: 12px;
  }

  .search-result-item {
    padding: 12px 15px;
  }
}

@media (max-width: 480px) {
  .search-bar {
    padding: 6px 12px;
  }

  .search-icon {
    font-size: 1.1rem;
  }

  .search-input {
    font-size: 0.9rem;
  }

  .search-result-item h4 {
    font-size: 0.9rem;
  }

  .search-result-item p {
    font-size: 0.75rem;
  }
}
</style>