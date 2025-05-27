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

    <!-- Add Product Button -->
    <button @click="openAddProductForm" class="action-btn add-btn">
      <Icon icon="material-symbols:add" class="icon" />
      Ajouter
    </button>


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
        <button @click="deleteProduct(product._id)" class="action-btn delete-btn">
          <Icon icon="material-symbols:delete-outline" class="icon" />
          Supprimer
        </button>
        <button @click="editProduct(product)" class="action-btn edit-btn">
          <Icon icon="material-symbols:edit-outline" class="icon" />
          Modifier
        </button>
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
    <div v-if="showProductForm" class="modal-overlay" @click.self="showProductForm = false">
      <div class="modal">
        <button @click="showProductForm = false" class="close-btn">×</button>
        <ProductForm
          :product="currentProduct"
          :currentProduct="currentProduct" 
          :categories="categories"
          :subcategories="subcategories"
          :subsubcategories="subsubcategories"
          @saved="onProductSaved"
          @cancel="showProductForm = false"
        />
      </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="delete-modal">
        <button @click="showDeleteModal = false" class="close-btn">×</button>
        
        <div class="modal-content">
          <Icon icon="mdi:alert-circle-outline" class="warning-icon" />
          <h3>Confirmer la suppression</h3>
          <p>Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.</p>
          
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="cancel-btn">
              Annuler
            </button>
            <button @click="confirmDelete" class="confirm-delete-btn">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { useToast } from 'vue-toastification'
import ProductForm from './ProductForm.vue'
import { Icon } from '@iconify/vue';


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

const showProductForm = ref(false)
const currentProduct = ref(null) // null for new product, product object for editing

const showDeleteModal = ref(false)
const productToDelete = ref(null)

onMounted(async () => {
  try {
    const [productsRes, categoriesRes, subcategoriesRes, subsubcategoriesRes] = await Promise.all([
      api.getAllProducts(),
      api.getCategories(),
      api.getAllSubcategories(),
      api.getAllSubSubcategories()
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

const filteredSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return subcategories.value.filter(sc => 
    String(sc.category_id?._id || sc.category_id) === String(selectedCategory.value)
  )
})

const filteredSubSubcategories = computed(() => {
  if (!selectedSubcategory.value) return []
  return subsubcategories.value.filter(ssc => 
    String(ssc.subcategory_id?._id || ssc.subcategory_id) === String(selectedSubcategory.value)
  )
})

const openAddProductForm = () => {
  currentProduct.value = null
  showProductForm.value = true
}

const editProduct = (product) => {
  currentProduct.value = JSON.parse(JSON.stringify(product))
  showProductForm.value = true
}

const deleteProduct = (productId) => {
  productToDelete.value = productId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await api.deleteProduct(productToDelete.value)
    products.value = products.value.filter(p => p._id !== productToDelete.value)
    toast.success('Produit supprimé avec succès')
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err)
    toast.error('Erreur lors de la suppression du produit')
  } finally {
    showDeleteModal.value = false
    productToDelete.value = null
  }
}

const onProductSaved = async () => {
  showProductForm.value = false
  loading.value = true
  try {
    const res = await api.getAllProducts()
    products.value = res.data
  } catch (err) {
    toast.error("Erreur lors de l'actualisation des produits")
  } finally {
    loading.value = false
  }
}

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
  padding: 0.6rem 1rem 1.5rem 1.5rem;
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
  padding: 0.5rem 0;
  border: none;
  border-bottom: 2px solid #2F8F9D;
  background: transparent;
  text-align: center;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
}

.stock-input:focus {
  outline: none;
  border-bottom-color: #227a86; /* slightly darker shade for focus */
}

.stock-input::placeholder {
  color: #aaa;
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 9000;
  max-width: 100%;
  width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

/* delete edit btns */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 100px;
  font-size: 0.95rem;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #e9ecef;
  color: #2c3e50;
}

.action-btn .icon {
  font-size: 1.2rem;
}

.add-btn {
  background-color: #2f8f9d;
  color: white;
}

.add-btn:hover {
  background-color: #258e7d;
}

.edit-btn {
  background-color: #f0f3f5;
  color: #2c3e50;
}

.edit-btn:hover {
  background-color: #dbe3e6;
}

.delete-btn {
  background-color: #f8d7da;
  color: #842029;
}

.delete-btn:hover {
  background-color: #f1b0b7;
}

/* Delete Modal Styles */
.delete-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-width: 90%;
  width: 450px;
  text-align: center;
}

.warning-icon {
  font-size: 3rem;
  color: #FF5252;
  margin-bottom: 1rem;
}

.modal-content h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.modal-content p {
  color: #666;
  margin-bottom: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.cancel-btn {
  background: #f1f1f1;
  color: #333;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.cancel-btn:hover {
  background: #e0e0e0;
}

.confirm-delete-btn {
  background: #FF5252;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.confirm-delete-btn:hover {
  background: #ff3333;
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

  /* delete modal */
  .delete-modal {
    width: 90%;
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .confirm-delete-btn {
    width: 100%;
  }
}
</style>