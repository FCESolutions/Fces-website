<template>
  <div class="category-sidebar">
    <div class="sidebar-header">
      <h3>Categories</h3>
    </div>
    
    <nav class="category-nav">
      <!-- Categories Level -->
      <div 
        v-for="category in categories" 
        :key="category._id"
        class="nav-item"
        :class="{ 'active': activeCategory === category._id }"
      >
        <a @click="selectCategory(category)">{{ category.category_name }}</a>
        
        <!-- Subcategories Level -->
        <div 
          v-if="activeCategory === category._id && category.subcategories"
          class="sub-level"
        >
          <div 
            v-for="sub in category.subcategories" 
            :key="sub._id"
            class="nav-item"
            :class="{ 'active': activeSubcategory === sub._id }"
          >
            <a @click="selectSubcategory(sub)">{{ sub.subcategory_name }}</a>
            
            <!-- Subsubcategories Level -->
            <div 
              v-if="activeSubcategory === sub._id && sub.subsubcategories"
              class="sub-level"
            >
              <div 
                v-for="subsub in sub.subsubcategories" 
                :key="subsub._id"
                class="nav-item"
                :class="{ 'active': activeSubsubcategory === subsub._id }"
              >
                <a @click="selectSubsubcategory(subsub)">{{ subsub.subsubcategory_name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const activeCategory = ref(null)
const activeSubcategory = ref(null)
const activeSubsubcategory = ref(null)

const selectCategory = (category) => {
  activeCategory.value = category._id
  activeSubcategory.value = null
  activeSubsubcategory.value = null
  router.push(`/categories/${category._id}`)
}

const selectSubcategory = (subcategory) => {
  activeSubcategory.value = subcategory._id
  activeSubsubcategory.value = null
  router.push(`/categories/${activeCategory.value}/${subcategory._id}`)
}

const selectSubsubcategory = (subsubcategory) => {
  activeSubsubcategory.value = subsubcategory._id
  router.push(`/categories/${activeCategory.value}/${activeSubcategory.value}/${subsubcategory._id}`)
}
</script>

<style scoped>
.category-sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  padding: 20px;
  overflow-y: auto;
}

.sidebar-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
  margin-bottom: 15px;
}

.category-nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-item a {
  display: block;
  padding: 8px 12px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item a:hover {
  background: #e9ecef;
}

.nav-item.active > a {
  background: #4299e1;
  color: white;
}

.sub-level {
  margin-left: 15px;
  margin-top: 5px;
  border-left: 2px solid #ddd;
  padding-left: 10px;
}
</style>