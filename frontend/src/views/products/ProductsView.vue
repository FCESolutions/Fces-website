<template>
  <div class="products-view">
    <div class="layout-container">
      <CategorySidebar :categories="sideBar" />
      
      <div class="productsView-container">
        <!-- Header (always visible) -->
        <div class="productsView-header">
          <!-- Show category name only when NOT in a subcategory -->
          <h2 v-if="!route.params.subcategoryId">{{ currentCategoryName }}</h2>
          
          <!-- Show breadcrumb path when in subcategory or deeper -->
          <div v-if="breadcrumbPath.length > 0" class="breadcrumb">
            <!-- Start with category name as first breadcrumb item -->
            <router-link 
              :to="{ name: 'ProductsByCategory', params: { categoryId: route.params.categoryId } }" 
              class="breadcrumb-item"
            >
              {{ currentCategoryName }}
            </router-link>
            
            <!-- Add separator and subcategory -->
            <Icon 
              icon="lucide:chevron-right" 
              class="breadcrumb-separator" 
            />
            <span class="breadcrumb-item">
              {{ breadcrumbPath[0].name }}
            </span>
            
            <!-- Add subsubcategory if it exists -->
            <template v-if="breadcrumbPath.length > 1">
              <Icon 
                icon="lucide:chevron-right" 
                class="breadcrumb-separator" 
              />
              <span class="breadcrumb-item">
                {{ breadcrumbPath[1].name }}
              </span>
            </template>
          </div>
        </div>        
        
        <!-- Product detail view - render first if productId exists -->
        <div v-if="route.params.productId">
          <div v-if="productDetails">
            <ProductDetailsCard 
            v-if="productDetails"
            :productId="route.params.productId"           
            :product="productDetails || {}"
            />
          </div>
          <div v-else class="loading">
            <Icon icon="svg-spinners:270-ring" class="loading-icon" />
            Loading products...
          </div>
        </div>
        

        <!-- Category/Subcategory/Product View -->
        <div v-else>
          <!-- Top level categories -->
          <div v-if="sideBar.length > 0 && !route.params.categoryId">
            <p v-if="categories.length === 0" class="not-available">
              No categories available.
            </p>
            <div v-else class="categories-grid">
              <CategoryCard 
                v-for="cat in categories" 
                :key="cat._id" 
                :category="cat" 
                @navigate="goToCategory"
              />
            </div>
          </div>

          <!-- Category level (shows subcategories + category-level products) -->
          <div v-else-if="route.params.categoryId && !route.params.subcategoryId">
            <div v-if="subcategories.length > 0" class="categories-grid">
              <SubCategoryCard 
                v-for="subcat in subcategories" 
                :key="subcat._id" 
                :subcategory="subcat" 
                @navigate="goToSubcategory"
              />
            </div>
            
            <!-- Show category-level products if they exist -->
            <div v-if="subcategoryLevelProducts.length > 0">
              <h3 class="products-section-title">Products in this category</h3>
              <div class="products-grid">
                <ProductCard 
                  v-for="product in subcategoryLevelProducts" 
                  :key="product._id" 
                  :product="product" 
                  @navigate="goToProduct"
                />
              </div>
            </div>

            <p 
              v-if="subcategories.length === 0 && subcategoryLevelProducts.length === 0" 
              class="not-available"
            >
              No subcategories available in this category.
            </p>
          </div>

          <!-- Subcategory level (shows subsubcategories + subcategory-level products) -->
          <div v-else-if="route.params.categoryId && route.params.subcategoryId && !route.params.subsubcategoryId">
            <div v-if="subsubcategories.length > 0" class="categories-grid">
              <SubSubCategoryCard 
                v-for="subsubcat in subsubcategories" 
                :key="subsubcat._id" 
                :subsubcategory="subsubcat" 
                @navigate="goToSubSubcategory"
              />
            </div>
            
            <!-- Show subcategory-level products if they exist -->
            <div v-if="subsubcategoryLevelProducts.length > 0">
              <h3 class="products-section-title">Products in this subcategory</h3>
              <div class="products-grid">
                <ProductCard 
                  v-for="product in subsubcategoryLevelProducts" 
                  :key="product._id" 
                  :product="product" 
                  @navigate="goToProduct"
                />
              </div>
            </div>

            <p 
              v-if="subsubcategories.length === 0 && subsubcategoryLevelProducts.length === 0" 
              class="not-available"
            >
              No further subcategories or products available in this subcategory.
            </p>
          </div>

          <!-- Subsubcategory level (shows only products) -->
          <div v-else-if="route.params.subsubcategoryId">
            <div v-if="products.length > 0" class="products-grid">
              <ProductCard 
                v-for="product in products" 
                :key="product._id" 
                :product="product" 
                @navigate="goToProduct"
              />
            </div>
            <p v-else class="not-available">
              No products available in this subcategory.
            </p>
          </div>
        </div>
        <div v-if="loading" class="loading">
          <Icon icon="svg-spinners:270-ring" class="loading-icon" />
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import api from '@/api'
import { useProductStore } from '@/stores/productStore'
import CategorySidebar from '@/components/products/ProductsSidebar.vue'
import CategoryCard from '@/components/products/CategoryCard.vue'
import SubCategoryCard from '@/components/products/SubCategoryCard.vue'
import SubSubCategoryCard from '@/components/products/SubSubCategoryCard.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import ProductDetailsCard from '@/components/products/ProductDetailsCard.vue'

const route = useRoute()
const router = useRouter()
const categories = ref([])
const subcategories = ref([])
const subsubcategories = ref([])
const sideBar = ref([])
const products = ref([])
const subcategoryLevelProducts = ref([])
const subsubcategoryLevelProducts = ref([])
const productDetails = ref({})
const loading = ref(false)
const productStore = useProductStore()

// Current selection names
const currentCategoryName = computed(() => {
  if (!route.params.categoryId) return 'All Categories'
  const category = sideBar.value.find(c => c._id === route.params.categoryId)
  return category?.category_name || 'Selected Category'
})

const breadcrumbPath = computed(() => {
  const path = []
  
  if (route.params.subcategoryId) {
    const category = sideBar.value.find(c => c._id === route.params.categoryId)
    if (category) {
      const subcategory = category.subcategories?.find(s => s._id === route.params.subcategoryId)
      if (subcategory) {
        path.push({ 
          name: subcategory.subcategory_name,
          id: subcategory._id
        })
        
        if (route.params.subsubcategoryId) {
          const subsubcategory = subcategory.subsubcategories?.find(
            ss => ss._id === route.params.subsubcategoryId
          )
          if (subsubcategory) {
            path.push({ 
              name: subsubcategory.subsubcategory_name,
              id: subsubcategory._id
            })
          }
        }
      }
    }
  }
  
  return path
})


const goToCategory = (categoryId) => {
  router.push({ name: 'ProductsByCategory', params: { categoryId } })
}

const goToSubcategory = (subcategoryId) => {
  router.push({
    name: 'ProductsBySubcategory',
    params: {
      categoryId: route.params.categoryId,
      subcategoryId,
    }
  })
}

const goToSubSubcategory = (subsubcategoryId) => {
  router.push({
    name: 'ProductsBySubsubcategory',
    params: {
      categoryId: route.params.categoryId,
      subcategoryId: route.params.subcategoryId,
      subsubcategoryId,
    }
  })
}

const goToProduct = (productId) => {
  router.push({
    name: 'ProductDetails',
    params: { productId }
  })
}


// Fetch data
const fetchProductsSidBar = async () => {
  try {
    loading.value = true
    const response = await api.getProductsSideBar()
    sideBar.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchSubCategories = async () => {
  if (!route.params.categoryId) return
  try {
    loading.value = true
    const response = await api.getSubcategories(route.params.categoryId)
    subcategories.value = response.data.subcategories || []
    subcategoryLevelProducts.value = response.data.products || []
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  } finally {
    loading.value = false
  }
}

const fetchSubSubCategories = async () => {
  if (!route.params.categoryId || !route.params.subcategoryId) return
  try {
    loading.value = true
    const response = await api.getSubSubcategories(route.params.subcategoryId)
    subsubcategories.value = response.data.subsubcategories || []
    subsubcategoryLevelProducts.value = response.data.products || []
  } catch (error) {
    console.error('Error fetching subsubcategories:', error)
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  if (!route.params.subsubcategoryId || !route.params.subcategoryId) {
    products.value = []
    return
  }
  
  loading.value = true
  try {
    const categoryId = route.params.categoryId || 'null'
    const subcategoryId = route.params.subcategoryId || 'null'
    const subsubcategoryId = route.params.subsubcategoryId || 'null'

    const response = await api.getProducts(categoryId, subcategoryId, subsubcategoryId)
    products.value = response.data || []
    console.log('products:', products.value)
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchProductDetails = async (productId) => {
    if (!route.params.productId) return

    loading.value = true
    try {
      const response = await api.getProductDetails(productId)
      productDetails.value = response.data
      console.log('productDetails:', productDetails.value)
    } catch (error) {
      console.error('Error fetching product details:', error)
    } finally {
      loading.value = false
    }
}

const fetchData = async () => {
  loading.value = true;
  try {
    await fetchProductsSidBar();
    await fetchCategories();
    
    if (route.params.categoryId) {
      await fetchSubCategories();
      
      if (route.params.subcategoryId) {
        await fetchSubSubCategories();
        
        if (route.params.subsubcategoryId) {
          await fetchProducts();
        }
      }
    }
    if (route.params.productId) {
      await fetchProductDetails(route.params.productId)
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
};

// Initial load
onMounted(fetchData);

// Watch for route changes
// Improved watch implementation
watch(
  () => ({
    categoryId: route.params.categoryId,
    subcategoryId: route.params.subcategoryId,
    subsubcategoryId: route.params.subsubcategoryId,
    productId: route.params.productId
  }),
  async (newParams, oldParams) => {
    // Skip initial identical run
    if (JSON.stringify(newParams) === JSON.stringify(oldParams)) return;
    
    loading.value = true;
    try {
      // Category level changed
      if (newParams.categoryId !== oldParams?.categoryId) {
        await fetchCategories();
        await fetchSubCategories();
        // Reset deeper levels when category changes
        subsubcategories.value = [];
        subsubcategoryLevelProducts.value = [];
        products.value = [];
      }
      
      // Subcategory level changed
      if (newParams.subcategoryId !== oldParams?.subcategoryId) {
        await fetchSubSubCategories();
        // Reset deeper level when subcategory changes
        products.value = [];
      }
      
      // Subsubcategory level changed
      if (newParams.subsubcategoryId !== oldParams?.subsubcategoryId) {
        await fetchProducts();
      }

      if (newParams.productId !== oldParams?.productId) {
        productDetails.value = null; // optional: clear old product
        await fetchProductDetails(newParams.productId);
      }
    } catch (error) {
      console.error('Error during route change:', error);
    } finally {
      loading.value = false;
    }
  },
  { deep: true }
);

</script>

<style scoped>

.layout-container {
  display: flex;
  min-height: calc(100vh - 100px); /* Viewport minus navbar */
}

.productsView-container {
  flex: 1;
  padding-left: 45px;
  margin-top: 55px; /* Space for fixed header */
}

.productsView-header {
  margin-bottom: 20px;
  margin-left: 45px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 100px;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 1001;
  display: flex;
  align-items: center;
  min-height: 36px; /* Match h2 height */
}

.productsView-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 550;
  line-height: 1.2;
}

.breadcrumb {
  display: flex;
  align-items: center;
  margin: 0;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 1.5rem; /* Match h2 size */
  font-weight: 550; /* Match h2 weight */
  line-height: 1.2;
  color: #2d3748;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
  color: #5a8fc7; 
  text-decoration: none;
  transition: all 0.2s ease;
}

.breadcrumb-item:hover {
  color: #4a7cb4; 
  text-decoration: underline;
  text-underline-offset: 2px;
}

.breadcrumb-item:last-child {
  color: #2d3748; 
  pointer-events: none; /* Disable hover/interaction on current page */
  text-decoration: none;
}

.breadcrumb-separator {
  width: 1.25rem;
  height: 1.25rem;
  color: #d1dbe6; 
  margin: 0 0.1rem;
}

.products-section-title {
  margin: 30px 0 15px 0;
  color: #2d3748;
  font-size: 1.2rem;
  padding-left: 10px;
  border-left: 4px solid #5a8fc7; 
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px; /* Give space for fixed header */
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 15px 20px;
  margin-top: 20px; /* Give space for fixed header */
}

.loading {
  padding: 20px;
  text-align: center;
  color: #718096;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-icon {
  font-size: 1.5rem;
}

.not-available {
  color: #4a5568;
  font-size: 1.1rem;
  text-align: center;
  margin-top: 100px;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

</style>