<template>
  <div class="products-view">
    <div class="layout-container">      
      
      <div class="productsView-container">
        <!-- Header (always visible) -->
        <div class="productsView-header">
          <div class="title-row">
            <CategorySidebar :categories="sideBar" />
            <div class="title-section">

              <!-- Show category name only when NOT in a subcategory -->
              <h2 v-if="!route.params.subcategoryId && !route.params.subsubcategoryId && !route.params.productId">
                {{ currentCategoryName }}
              </h2>
              
              <!-- Show breadcrumb path when in subcategory or deeper -->
              <div v-if="breadcrumbPath.length > 0" class="breadcrumb">
                <router-link
                  :to="{ name: 'ProductsByCategory', params: { categoryId: categoryIdFromPath } }"
                  class="breadcrumb-item"
                >
                  {{ currentCategoryName }}
                </router-link>

                <template v-for="(crumb, index) in breadcrumbPath" :key="index">
                  <Icon icon="lucide:chevron-right" class="breadcrumb-separator" />
                  
                  <router-link
                    v-if="index === 0"
                    :to="{ 
                      name: 'ProductsBySubcategory', 
                      params: { 
                        categoryId: categoryIdFromPath, 
                        subcategoryId: crumb.id 
                      } 
                    }"
                    class="breadcrumb-item"
                  >
                    {{ crumb.name }}
                  </router-link>

                  <router-link
                    v-else-if="index === 1"
                    :to="{ 
                      name: 'ProductsBySubsubcategory', 
                      params: { 
                        categoryId: categoryIdFromPath, 
                        subcategoryId: breadcrumbPath[0].id, 
                        subsubcategoryId: crumb.id 
                      } 
                    }"
                    class="breadcrumb-item"
                  >
                    {{ crumb.name }}
                  </router-link>
                </template>
              </div>
            </div>
          </div>

          <div class="header-search-container">
            <SearchBar
              :allCategories="sideBar"
              :allSubcategories="allSubcategories"
              :allSubsubcategories="allSubsubcategories"
              :allProducts="allProducts" 
              @navigate-state="handleNavigation"  
              @search-state="handleSearchState"
            />
          </div>
        </div>  
        
        <!-- Product detail view - render first if productId exists -->
        <div v-if="route.params.productId">  
            <ReturnButton />                 
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
            <ReturnButton />
            <div v-if="subcategories.length > 0 || subcategoryLevelProducts.length > 0" class="categories-grid">
              <SubCategoryCard 
                v-for="subcat in subcategories" 
                :key="subcat._id" 
                :subcategory="subcat" 
                @navigate="goToSubcategory"
              />
              
              <ProductCard 
                v-for="product in subcategoryLevelProducts" 
                :key="product._id" 
                :product="product" 
                @navigate="goToProduct"
              />
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
            <ReturnButton />
            <div v-if="subsubcategories.length > 0 || subsubcategoryLevelProducts.length > 0" class="categories-grid">
              <SubSubCategoryCard 
                v-for="subsubcat in subsubcategories" 
                :key="subsubcat._id" 
                :subsubcategory="subsubcat" 
                @navigate="goToSubSubcategory"
              />

              <ProductCard 
                v-for="product in subsubcategoryLevelProducts" 
                :key="product._id" 
                :product="product" 
                @navigate="goToProduct"
              />
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
            <ReturnButton /> 
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
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
import ReturnButton from '@/components/ReturnButton.vue'
import SearchBar from '@/components/products/SearchBar.vue'

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
const allProducts = ref([])

const isSearching = ref(false)
const searchResults = ref([])

// Current selection names
const currentCategoryName = computed(() => {
  // If no categoryId or productId, show 'All Categories'
  if (!route.params.categoryId && !route.params.productId) return 'All Categories';

  // If we are on the product details page, extract the category from the 'from' query (path)
  if (route.params.productId) {
    const fromPathParts = route.query.from ? route.query.from.split('/') : [];
    const categoryIndex = fromPathParts.indexOf('category');
    if (categoryIndex !== -1) {
      const categoryIdFromPath = fromPathParts[categoryIndex + 1];
      const category = sideBar.value.find(c => c._id === categoryIdFromPath);
      return category?.category_name || 'Selected Category';
    }
  }

  // For other views (like category/subcategory), find the category based on the categoryId
  const category = sideBar.value.find(c => c._id === route.params.categoryId);
  return category?.category_name || 'Selected Category';
});


const fromPathParts = computed(() => {
  const from = route.query.from || router.currentRoute.value.fullPath
  return from.split('/').filter(Boolean)
})

const categoryIdFromPath = computed(() => {
  const parts = fromPathParts.value
  const index = parts.indexOf('category')
  return index !== -1 ? parts[index + 1] : null
})

const subcategoryIdFromPath = computed(() => {
  const parts = fromPathParts.value
  const index = parts.indexOf('subcategory')
  return index !== -1 ? parts[index + 1] : null
})

const subsubcategoryIdFromPath = computed(() => {
  const parts = fromPathParts.value
  const index = parts.indexOf('subsubcategory')
  return index !== -1 ? parts[index + 1] : null
})

const breadcrumbPath = computed(() => {
  const path = []
  const category = sideBar.value.find(c => c._id === categoryIdFromPath.value)

  if (!category) return path // Return an empty path if no category found

  if (subcategoryIdFromPath.value) {
    const subcategory = category.subcategories?.find(s => s._id === subcategoryIdFromPath.value)
    if (subcategory) {
      path.push({ name: subcategory.subcategory_name, id: subcategory._id })

      if (subsubcategoryIdFromPath.value) {
        const subsubcategory = subcategory.subsubcategories?.find(ss => ss._id === subsubcategoryIdFromPath.value)
        if (subsubcategory) {
          path.push({ name: subsubcategory.subsubcategory_name, id: subsubcategory._id })
        }
      }
    }
  }

  return path
})

// Change the search-state handler to:
const handleSearchState = ({ isSearching: active, results }) => {
  // Only update if the state actually changed
  if (active !== isSearching.value || JSON.stringify(results) !== JSON.stringify(searchResults.value)) {
    isSearching.value = active
    searchResults.value = results
    
    // If not searching, ensure we clear the results after a delay
    if (!active) {
      setTimeout(() => {
        searchResults.value = []
      }, 300)
    }
  }
}

const cardComponentMap = {
  category: 'CategoryCard',
  subcategory: 'SubCategoryCard',
  subsubcategory: 'SubSubCategoryCard',
  product: 'ProductCard'
}

function getCardComponent(type) {
  return cardComponentMap[type] || null
}

// Replace handleSearchNavigation with:
const handleNavigation = (payload) => {
  
  // Force a small delay to ensure Vue processes the state change
  nextTick(() => {
    switch(payload.type) {
      case 'category':
        goToCategory(payload.data._id);
        break;
      case 'subcategory':
        goToSubcategory(payload.data._id);
        break;
      case 'subsubcategory':
        goToSubSubcategory(payload.data._id);
        break;
      case 'product':
        goToProduct(payload.data._id);
        break;
    }
  });

  // Clear search after navigation completes
  setTimeout(() => {
    isSearching.value = false
    searchResults.value = []
  }, 100)
}

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
    params: { productId },
    query: { from: router.currentRoute.value.fullPath }
  })
}


// Fetch cats with its subcats and its subsubcats for sidebar
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

// Fetch all categories
const fetchCategories = async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

// Fetch all category subcategories
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

// Fetch all subcategory subsubcategories
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

// Fetch all products of a category, subcategory, or subsubcategory
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

// Fetch product details
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

// Those three fcts are for the search bar
const allSubcategories = computed(() => {
  return sideBar.value.flatMap(cat => cat.subcategories || [])
})

const allSubsubcategories = computed(() => {
  return sideBar.value.flatMap(cat => 
    cat.subcategories?.flatMap(subcat => subcat.subsubcategories || []) || []
  )
})

// Get all Products
const getProducts = async () => {
  try {
    const response = await api.getAllProducts()
    allProducts.value = response.data || []
    return allProducts.value // Return the actual array
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

// Fetch data in the correct order
const fetchData = async () => {
  loading.value = true;
  try {
    await fetchProductsSidBar();
    await fetchCategories();
    await getProducts();
    
    if (route.params.categoryId) {
      await fetchSubCategories();
      
      if (route.params.subcategoryId) {
        await fetchSubSubCategories();
        
        if (route.params.subsubcategoryId) {
          await fetchProducts();
        }
      }
    }
    // Delay productDetails fetching slightly to ensure others finish
    if (route.params.productId) {
      setTimeout(() => {
        fetchProductDetails(route.params.productId)
      }, 50)
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

// watch for the search
watch(() => route.fullPath, () => {
  // Clear search when route changes
  isSearching.value = false
  searchResults.value = []
  fetchCategories();
  getProducts();
})

</script>

<style scoped>

.layout-container {
  display: flex;
  min-height: calc(100vh - 100px); /* Viewport minus navbar */
}

.productsView-container {
  flex: 1;
  padding-left: 45px;
  margin-top: 90px; /* Reduced from 55px to account for header height */
}

.productsView-header {
  margin-bottom: 20px;
  margin-left: 45px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  position: fixed;
  top: 100px;
  left: 0;
  width: calc(100% - 45px); /* Account for sidebar */
  background-color: white;
  z-index: 1001;
  display: flex;
  align-items: center;
  min-height: 36px;
  gap: 20px; /* Space between title/breadcrumb and search */
}

.header-search-container {
  flex-grow: 1;
  max-width: 500px;
  margin-left: auto;
  position: relative;
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 20px; /* Give space for fixed header */
  margin-bottom: 30px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 15px 20px;
  margin-top: 20px; /* Give space for fixed header */
  margin-bottom: 30px;
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

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }

  .productsView-container {
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 110px; /* Increased to account for stacked header */
  }

  .productsView-header {
    flex-direction: column; /* Stack rows */
    align-items: flex-start;
    gap: 6px; /* Space between icon and title */
    padding: 12px 15px;
    width: 100%;
    margin-left: 0;
    top: 80px; /* Adjust based on your navbar height */
    height: auto;
    min-height: auto;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  .title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }

  .productsView-header h2 {
    font-size: 1.3rem;
    margin: 0; 
  }

  .breadcrumb {
    font-size: 1rem;
    gap: 0.3rem;
    margin-top: 0;
    width: 100%;
    margin-bottom: 0;
  }

  .breadcrumb-item {
    color: #5a8fc7; /* Updated blue color */
  }

  .breadcrumb-item:hover {
    color: #4a7cb4; /* Slightly darker on hover */
  }

  .breadcrumb-separator {
    width: 1rem;
    height: 1rem;
    margin: 0 0.1rem;
  }

  .header-search-container {
    width: 100%;
    max-width: 100%;
    margin-top: 0;
    margin-left: 0;
    padding: 0;
  }

  .categories-grid,
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
    padding: 10px 0;
    margin-bottom: 20px;
  }
}
</style>