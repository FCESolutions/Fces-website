<template>
  <div class="stock-manager">
    <h2 class="title">Gestion du stock</h2>

    <!-- Search and Filters -->
    <div class="filters">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Rechercher un produit..." 
        class="search-input"
      />

      <!-- Category and Subcategory Dropdowns -->
      <div class="dropdowns">
        <select v-model="selectedCategory" class="dropdown">
          <option value="">Sélectionner une catégorie</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.category_name }}
          </option>
        </select>

        <select 
          v-model="selectedSubcategory" 
          class="dropdown" 
          :disabled="!selectedCategory"
          v-if="filteredSubcategories.length > 0"
        >
          <option value="">Sélectionner une sous-catégorie</option>
          <option v-for="subcategory in filteredSubcategories" :key="subcategory._id" :value="subcategory._id">
            {{ subcategory.subcategory_name }}
          </option>
        </select>

        <select 
          v-model="selectedSubSubcategory" 
          class="dropdown" 
          :disabled="!selectedSubcategory"
          v-if="filteredSubSubcategories.length > 0"
        >
          <option value="">Sélectionner une sous-sous-catégorie</option>
          <option v-for="subsubcategory in filteredSubSubcategories" :key="subsubcategory._id" :value="subsubcategory._id">
            {{ subsubcategory.subsubcategory_name || subsubcategory.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">Chargement des produits...</div>
    
    <!-- Product List -->
    <div v-else>
        <div 
            v-if="filteredProducts.length > 0"
            v-for="product in filteredProducts" 
            :key="product._id" 
            class="product-item"
        >
            <img :src="product.product_image_url" alt="Product" class="product-img" />
            <div class="info">
                <h3>{{ product.product_name }}</h3>
                <label>
                    Stock:
                    <input 
                    type="number" 
                    v-model.number="product.stock" 
                    min="0" 
                    class="stock-input"
                    />
                </label>
                <button @click="updateStock(product)" class="update-btn">
                    Mettre à jour
                </button>
            </div>
        </div>
        <div v-else class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>Aucun produit trouvé</h3>
            <p>Vos critères de recherche ne correspondent à aucun produit.</p>
            <button @click="resetFilters" class="reset-btn">
                Réinitialiser les filtres
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { useToast } from 'vue-toastification'

const toast = useToast()
const products = ref([])
const categories = ref([])
const subcategories = ref([])
const subsubcategories = ref([])
const selectedCategory = ref('')
const selectedSubcategory = ref('')
const selectedSubSubcategory = ref('')
const loading = ref(true)
const searchQuery = ref('')

onMounted(async () => {
  try {
    const [productsRes, categoriesRes, subcategoriesRes, subsubcategoriesRes] = await Promise.all([
      api.getAllProducts(),
      api.getCategories(),
      api.getAllSubcategories(),
      api.getAllSubSubcategories() // Add this API call
    ])
    
    products.value = productsRes.data
    categories.value = categoriesRes.data
    subcategories.value = subcategoriesRes.data
    subsubcategories.value = subsubcategoriesRes.data || []

  } catch (err) {
    console.error('Error loading data:', err)
    toast.error('Erreur lors du chargement des produits')
  } finally {
    loading.value = false
  }
})

// Filter products based on search query and selected category/subcategory
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.product_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const productCategoryId = p.category_id?._id || p.category_id
    const productSubcategoryId = p.subcategory_id?._id || p.subcategory_id
    const productSubSubcategoryId = p.subsubcategory_id?._id || p.subsubcategory_id
    
    const matchesCategory = !selectedCategory.value || 
                          String(productCategoryId) === String(selectedCategory.value)
    
    const matchesSubcategory = !selectedSubcategory.value || 
                             String(productSubcategoryId) === String(selectedSubcategory.value)
    
    const matchesSubSubcategory = !selectedSubSubcategory.value || 
                                (productSubSubcategoryId && 
                                 String(productSubSubcategoryId) === String(selectedSubSubcategory.value))
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesSubSubcategory
  })
})

// Filter subcategories based on selected category
const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return subcategories.value.filter(sc => 
    String(sc.category_id?._id || sc.category_id) === String(selectedCategory.value)
  )
})

// Filter sub-subcategories based on selected subcategory
const filteredSubSubcategories = computed(() => {
  if (!selectedSubcategory.value) return []
  return subsubcategories.value.filter(ssc => 
    String(ssc.subcategory_id?._id || ssc.subcategory_id) === String(selectedSubcategory.value)
  )
})

const updateStock = async (product) => {
  try {
    await api.updateOrderStock(product._id, product.stock)
    toast.success('Stock mis à jour avec succès')
  } catch (err) {
    console.error('Error updating stock:', err)
    toast.error("Erreur lors de la mise à jour du stock")
  }
}

const resetFilters = () => {
  selectedCategory.value = ''
  selectedSubcategory.value = ''
  selectedSubSubcategory.value = ''
  searchQuery.value = ''
}

watch(selectedCategory, () => {
  selectedSubcategory.value = ''
  selectedSubSubcategory.value = ''
})

watch(selectedSubcategory, () => {
  selectedSubSubcategory.value = ''
})

</script>

<style scoped>
.stock-manager {
  max-width: 900px;
  margin: auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.search-input {
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  width: calc(100% - 1.6rem); /* Fix for overflow */
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #2f8f9d;
  outline: none;
}

.dropdowns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.dropdown {
  padding: 0.8rem 2rem 0.8rem 1rem; /* More padding on right for arrow */
  border: 1px solid #ddd;
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none; /* Remove default arrow */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1.2rem;
}

.dropdown:hover {
  border-color: #2f8f9d;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-bottom: 1px solid #eee;
  padding: 1.5rem 0;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #f8f9fa;
}

.product-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.info {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
}

.info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.2rem;
  width: 100%;
}

.stock-input {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.update-btn {
  background-color: #2f8f9d;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.update-btn:hover {
  background-color: #258e7d;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.update-btn:active {
  transform: translateY(0);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #f8f9fa;
  border-radius: 10px;
  margin-top: 1rem;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #6c757d;
}

.empty-state h3 {
  color: #343a40;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 1.5rem;
}

.reset-btn {
  background-color: #2f8f9d;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.reset-btn:hover {
  background-color: #258e7d;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .stock-manager {
    padding: 1rem;
  }
  
  .filters {
    padding: 1rem;
  }
  
  .dropdowns {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .dropdown {
    width: 100%;
    min-width: auto;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .product-img {
    width: 100%;
    height: auto;
    max-height: 250px;
  }
  
  .info {
    width: 100%;
  }
  
  .update-btn {
    margin-top: 0.5rem;
    width: 100%;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
}

@media (max-width: 480px) {
  .info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stock-input {
    width: 100%;
  }
  
  .update-btn {
    margin-top: 0.5rem;
    width: 100%;
  }
}
</style>