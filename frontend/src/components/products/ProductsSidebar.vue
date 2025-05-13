<template>
  <div 
    class="category-sidebar-wrapper" 
    @mouseenter="showSidebar = true" 
    @mouseleave="showSidebar = false"
    @touchstart="handleTouchStart"
  >
    <div class="sidebar-toggle-icon" @click="toggleSidebar">
      <Icon :icon="showSidebar ? 'iconoir:xmark' : 'iconoir:menu'" class="menu-icon" />
    </div>

    <div class="category-sidebar" :class="{ 'mobile-visible': isMobileVisible }" v-show="showSidebar || isMobileVisible">
      <nav class="category-nav">
        <div 
          v-for="category in categories" 
          :key="category._id"
          class="nav-item"
          :class="{ 
            'active': $route.params.categoryId === category._id, 
            'has-active-child': hasActiveChild(category)
          }"
        >
          <router-link 
            :to="{ name: 'ProductsByCategory', params: { categoryId: category._id } }"
            class="nav-link"
            custom 
            v-slot="{ navigate }" 
          >
            <div @click="(e) => {
              navigate(e); 
              handleCategoryClick(category); 
            }">
              <span>{{ category.category_name }}</span>
              <span 
                v-if="category.subcategories?.length" 
                class="arrow" 
                @click.stop="toggleCategory(category._id)"
              >
                <Icon :icon="getCategoryIcon(category._id)" class="arrow-icon"/>
              </span>
            </div>
          </router-link>

          <div 
            v-if="shouldExpandCategory(category)"
            class="sub-level"
          >
            <div 
              v-for="sub in category.subcategories" 
              :key="sub._id"
              class="nav-item"
              :class="{ 
                'active':  $route.params.subcategoryId === sub._id,
                'has-active-child': hasActiveSubchild(sub)
              }"
            >
              <router-link
                :to="{
                  name: 'ProductsBySubcategory',
                  params: {
                    categoryId: category._id,
                    subcategoryId: sub._id
                  }
                }"
                class="nav-link"
                  custom  
                  v-slot="{ navigate }"  
              >
                  <div @click="(e) => {
                    navigate(e);
                    handleSubcategoryClick(sub);
                  }">
                  <span>{{ sub.subcategory_name }}</span>
                  <span 
                    v-if="sub.subsubcategories?.length" 
                    class="arrow" 
                    @click.stop="toggleSubcategory(sub._id)"
                  >
                    <Icon :icon="getSubcategoryIcon(sub._id)" class="arrow-icon"/>
                  </span>
                </div>
              </router-link>

              <div 
                v-if="shouldExpandSubcategory(sub)"
                class="sub-level"
              >
                <router-link
                  v-for="subsub in sub.subsubcategories" 
                  :key="subsub._id"
                  :to="{
                    name: 'ProductsBySubsubcategory',
                    params: {
                      categoryId: category._id,
                      subcategoryId: sub._id,
                      subsubcategoryId: subsub._id
                    }
                  }"
                  custom
                  v-slot="{ navigate, isActive, isExactActive }"
                >
                  <div
                    @click="(e) => {
                      navigate(e);
                      productStore.setActiveSubsubcategory(subsub._id);
                    }"
                    :class="[
                      'nav-item',
                      'nav-link',
                      { 
                        'active': isActive,
                        'router-link-active': isActive,
                        'router-link-exact-active': isExactActive 
                      }
                    ]"
                  >
                    {{ subsub.subsubcategory_name }}
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useProductStore } from '@/stores/productStore'

  const props = defineProps({
    categories: {
      type: Array,
      required: true
    }
  })

  const router = useRouter()
  const route = useRoute()

  // Get the category store instance
  const productStore = useProductStore()

  // Accessing active states from the store
  const activeCategory = computed(() => productStore.activeCategory)
  const activeSubcategory = computed(() => productStore.activeSubcategory)
  const activeSubsubcategory = computed(() => productStore.activeSubsubcategory)

  const showSidebar = ref(false)

  const expandedCategories = ref(new Set())
  const expandedSubcategories = ref(new Set())

  // New computed properties and methods
  const hasActiveChild = (category) => {
    return category.subcategories?.some(
      sub => sub._id === activeSubcategory.value || 
            sub.subsubcategories?.some(ss => ss._id === activeSubsubcategory.value)
    )
  }

  const hasActiveSubchild = (subcategory) => {
    return subcategory.subsubcategories?.some(ss => ss._id === activeSubsubcategory.value)
  }

  const shouldExpandCategory = (category) => {
    return expandedCategories.value.has(category._id) || 
          activeCategory.value === category._id ||
          hasActiveChild(category)
  }

  const shouldExpandSubcategory = (subcategory) => {
    return expandedSubcategories.value.has(subcategory._id) || 
          activeSubcategory.value === subcategory._id ||
          hasActiveSubchild(subcategory)
  }

  const getCategoryIcon = (categoryId) => {
    return shouldExpandCategory({ _id: categoryId }) ? 
      'lucide:chevron-down' : 'lucide:chevron-right'
  }

  const getSubcategoryIcon = (subcategoryId) => {
    return shouldExpandSubcategory({ _id: subcategoryId }) ? 
      'lucide:chevron-down' : 'lucide:chevron-right'
  }

  const handleCategoryClick = (category) => {
    productStore.setActiveCategory(category)
    if (!category.subcategories?.length) {
      expandedCategories.value.delete(category._id)
    }
  }

  const handleSubcategoryClick = (subcategory) => {
    productStore.setActiveSubcategory(subcategory)
    if (!subcategory.subsubcategories?.length) {
      expandedSubcategories.value.delete(subcategory._id)
    }
  }

  const toggleCategory = (categoryId) => {
    const set = new Set(expandedCategories.value)
    if (set.has(categoryId)) {
      set.delete(categoryId)
    } else {
      set.add(categoryId)
    }
    expandedCategories.value = set
  }

  const toggleSubcategory = (subId) => {
    const set = new Set(expandedSubcategories.value)
    if (set.has(subId)) {
      set.delete(subId)
    } else {
      set.add(subId)
    }
    expandedSubcategories.value = set
  }

  // Add mobile detection
  const isMobile = ref(false)
  const isMobileVisible = ref(false)
  const touchStartX = ref(0)

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
  }

  const handleTouchStart = (e) => {
    if (!isMobile.value) return
    touchStartX.value = e.touches[0].clientX
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX
    if (touchX - touchStartX.value > 50) {
      isMobileVisible.value = true
    }
  }

  const handleTouchEnd = () => {
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  }

  const toggleSidebar = () => {
    if (isMobile.value) {
      isMobileVisible.value = !isMobileVisible.value
    }
  }

  const resetActiveStates = () => {
  productStore.resetActiveStates()
  expandedCategories.value.clear()
  expandedSubcategories.value.clear()
  }

  watch(
    () => route.fullPath,
    () => {
      const newSet = new Set();
      
      if (route.params.subcategoryId) {
        // Keep parent category expanded
        newSet.add(route.params.categoryId);
        expandedCategories.value = newSet;
      } else {
        expandedCategories.value.clear();
      }
      
      // Similar logic for subsubcategories
      const newSubSet = new Set();
      if (route.params.subsubcategoryId) {
        newSubSet.add(route.params.subcategoryId);
        expandedSubcategories.value = newSubSet;
      } else {
        expandedSubcategories.value.clear();
      }
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    window.removeEventListener('resize', checkMobile)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  })

  onMounted(() => {
    if (!route.params.categoryId) {
      resetActiveStates()
    } else if (route.params.categoryId && !route.params.subcategoryId) {
      productStore.resetActiveSubcategory()
      expandedSubcategories.value.clear()
    } else if (route.params.subcategoryId && !route.params.subsubcategoryId) {
      productStore.resetActiveSubsubcategory()
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
  })
</script>

<style scoped>
.category-sidebar-wrapper {
  position: fixed;
  top: 119px;
  left: 0;
  width: 260px;
  height: calc(100vh - 119px);
  z-index: 1000;
  pointer-events: none;
}

.sidebar-toggle-icon {
  position: fixed;
  left: 10px;
  background-color: #ffffff;
  padding-bottom: 11px;
  padding-right: 6px;
  font-size: 1.8rem;
  cursor: pointer;
  z-index: 1001;
  pointer-events: auto;
}

.category-sidebar {
  width: 250px;
  max-height: calc(100vh - 170px);
  position: absolute;
  top: 0;
  left: 0;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 10px 16px 16px 16px;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: transform 0.3s ease, opacity 0.2s ease;
  pointer-events: auto;
}

.sidebar-toggle-icon,
.category-sidebar {
  pointer-events: auto;
}

.category-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item a {
  display: block;
  padding: 8px 14px;
  color: #2d3748;
  text-decoration: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-item a:hover {
  background: #edf2f7;
  color: #2b6cb0;
}

.nav-item.active > a {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
  border-left: 3px solid #3182ce;
}

.nav-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  color: #2d3748;
}

.nav-link:hover {
  background: #edf2f7;
  color: #2b6cb0;
}

.nav-link > div[class*="active"] {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
  border-left: 3px solid #3182ce;
}

.router-link {
  display: contents; /* Makes link inherit parent styles */
}

.nav-link > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.nav-item.active > .nav-link {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
  border-left: 3px solid #3182ce;
}

.arrow {
  font-size: 0.85rem; /* Slightly smaller than text */
  color: inherit; /* Match text color */
  margin-left: 6px;
  display: inline-flex;
  align-items: center;
  transition: transform 0.2s ease;
  user-select: none;
}

.sub-level {
  margin-left: 12px;
  margin-top: 6px;
  border-left: 2px solid #e2e8f0;
  padding-left: 12px;
}

.sub-level .nav-item a {
  font-size: 0.9rem; /* Slightly smaller */
  color: #4a5568;    /* A bit softer than #2d3748 */
  padding: 6px 14px; /* Slightly reduced vertical padding */
}

.sub-level .nav-item a:hover {
  background: #f7fafc; /* A gentler hover for nested levels */
  color: #2b6cb0;
}

.sub-level .nav-item.active > a {
  background: #e6f6ff;
  color: #3182ce;
  font-weight: 500;
  border-left: 3px solid #3182ce;
}

.sub-level .sub-level .nav-item a {
  font-size: 0.85rem;
  color: #5a6779;
}

/* Remove default scrollbar */
.category-sidebar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
.category-sidebar {
  scrollbar-width: none;
}

.nav-item.has-active-child > .nav-link {
  font-weight: 500;
  color: #3182ce;
  background: #e6f6ff;
  border-left: 3px solid #3182ce;
}

.nav-item.has-active-child > .sub-level {
  display: block;
}

/* Make router-links look like regular links */
.router-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.arrow {
  margin-left: 12px;
  padding: 0 4px;
  min-width: 20px; /* Ensure consistent spacing */
  text-align: center;
}

/* Add these styles to your existing CSS */
.sub-level .sub-level .nav-item.active,
.sub-level .sub-level .nav-item.router-link-active,
.sub-level .sub-level .nav-item.router-link-exact-active {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 500;
  border-left: 3px solid #3182ce;
}

/* Make sure this exists for proper hover states */
.sub-level .sub-level .nav-link:hover {
  background: #edf2f7;
  color: #2b6cb0;
}

/* Mobile styles */
@media (max-width: 768px) {
  .category-sidebar-wrapper {
    width: 100%;
    height: auto;
  }

  .sidebar-toggle-icon {
    display: block;
    position: fixed;
    top: 85px;
    left: 10px;
    z-index: 1200;
  }

  .category-sidebar {
    position: fixed;
    top: 119px;
    left: -250px;
    height: calc(100vh - 119px);
    transform: translateX(0);
    transition: transform 0.3s ease;
    overflow-y: auto; /* Ensure scrolling works */
    padding-bottom: 20px; /* Add some padding at bottom */
  }

  .category-sidebar.mobile-visible {
    transform: translateX(250px);
    box-shadow: 4px 0 15px rgba(0,0,0,0.1);
  }

  .category-sidebar::-webkit-scrollbar {
    width: 4px; 
  }

  .category-sidebar::-webkit-scrollbar-track {
    background: transparent;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .category-sidebar::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2); /* Lighter thumb */
    border-radius: 2px;
  }

  .category-sidebar::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,0.3);
  }
}

</style>
