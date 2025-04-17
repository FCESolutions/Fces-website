<template>
  <div class="products-view">
    <CategorySidebar :categories="categories" />
    
    <div class="products-container">
      <div class="products-header">
        <h2>{{ currentCategoryName }}</h2>
        <p v-if="currentSubcategoryName">› {{ currentSubcategoryName }}</p>
        <p v-if="currentSubsubcategoryName">› {{ currentSubsubcategoryName }}</p>
      </div>
      
      <div v-if="loading" class="loading">Loading products...</div>
      
      <div v-else class="products-grid">
        <ProductCard 
          v-for="product in products" 
          :key="product._id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api'
import CategorySidebar from '@/components/layout/ProductsSidebar.vue'
import ProductCard from '@/components/layout/ProductCard.vue'

const route = useRoute()
const categories = ref([])
const products = ref([])
const loading = ref(false)

// Current selection names
const currentCategoryName = computed(() => {
  if (!route.params.categoryId) return 'All Products'
  const category = categories.value.find(c => c._id === route.params.categoryId)
  return category?.category_name || ''
})

const currentSubcategoryName = computed(() => {
  if (!route.params.subcategoryId) return ''
  const category = categories.value.find(c => c._id === route.params.categoryId)
  if (!category) return ''
  const subcategory = category.subcategories?.find(s => s._id === route.params.subcategoryId)
  return subcategory?.subcategory_name || ''
})

const currentSubsubcategoryName = computed(() => {
  if (!route.params.subsubcategoryId) return ''
  const category = categories.value.find(c => c._id === route.params.categoryId)
  if (!category) return ''
  const subcategory = category.subcategories?.find(s => s._id === route.params.subcategoryId)
  if (!subcategory) return ''
  const subsubcategory = subcategory.subsubcategories?.find(ss => ss._id === route.params.subsubcategoryId)
  return subsubcategory?.subsubcategory_name || ''
})

// Fetch data
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await api.get('/categories?includeSubcategories=true')
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  try {
    loading.value = true
    let url = '/products'
    
    if (route.params.subsubcategoryId) {
      url = `/products/subsubcategory/${route.params.subsubcategoryId}`
    } else if (route.params.subcategoryId) {
      url = `/products/subcategory/${route.params.subcategoryId}`
    } else if (route.params.categoryId) {
      url = `/products/category/${route.params.categoryId}`
    }
    
    const response = await api.get(url)
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

// Initial load
onMounted(() => {
  fetchCategories()
  fetchProducts()
})

// Watch for route changes
watch(() => route.params, () => {
  fetchProducts()
}, { deep: true })
</script>

<style scoped>
.products-view {
  display: flex;
  min-height: 100vh;
}

.products-container {
  flex: 1;
  margin-left: 250px; /* Same as sidebar width */
  padding: 20px;
}

.products-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.products-header h2 {
  margin: 0;
  color: #2d3748;
}

.products-header p {
  margin: 5px 0 0 0;
  color: #4a5568;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #718096;
}
</style>