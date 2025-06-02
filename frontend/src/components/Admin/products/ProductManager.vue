<template>
  <div class="product-manager">
    <h2 class="title">Gestion des produits</h2>

    <!-- Search and Filters -->
    <div class="filters">
      <div class="filters-header">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Rechercher un produit..." 
          class="search-input"
        />

        <button 
          @click="showCategoryManager = true" 
          class="menu-icon-btn" 
          title="Gérer les catégories"
        >
          <Icon icon="mdi:dots-vertical" />
        </button>
      </div>

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
    <button @click="openAddProductForm" class="action-btn add-btn sticky-addBtn">
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
        <img 
          :src="getImageSrc(product)"
          :alt="product.product_name"
          class="product-img"
          loading="lazy"
          @error="handleImageError($event, product)"
        >
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
        <button @click="deleteProduct(product)" class="action-btn delete-btn">
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

    <!-- Product Form Modal -->
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
        <div class="modal-content">
          <Icon icon="mdi:alert-circle-outline" class="warning-icon" />
          <h3>Confirmer la suppression</h3>
          <p>Êtes-vous sûr de vouloir supprimer "{{ productToDelete?.product_name }}" ? Cette action est irréversible.</p>
          
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

      <!-- Category Manager Modal -->
      <div v-if="showCategoryManager" class="modal-overlay" @click.self="showCategoryManager = false">
        <div class="category-manager-modal">
          <button @click="showCategoryManager = false" class="close-btn">×</button>
          <h3>Gestion des catégories</h3>
          
          <div class="tabs">
            <button 
              :class="{ active: activeCategoryTab === 'categories' }"
              @click="activeCategoryTab = 'categories'"
            >
              Catégories
            </button>
            <button 
              :class="{ active: activeCategoryTab === 'subcategories' }"
              @click="activeCategoryTab = 'subcategories'"
              :disabled="!selectedManagerCategory"
            >
              Sous-catégories
            </button>
            <button 
              :class="{ active: activeCategoryTab === 'subsubcategories' }"
              @click="activeCategoryTab = 'subsubcategories'"
              :disabled="!selectedManagerSubcategory"
            >
              Sous-sous-catégories
            </button>
          </div>
          
          <!-- Categories Tab -->
          <div v-if="activeCategoryTab === 'categories'" class="list-container">
            <div class="category-items-wrapper">
              <div 
                v-for="category in categories" 
                :key="category._id"
                :class="['category-item', { selected: selectedManagerCategory === category._id }]"
                @click="selectManagerCategory(category._id)"
              >
                <img 
                  :src="category.category_image_url" 
                  :alt="category.category_name"
                  class="category-image"
                  @error="handleCategoryImageError"
                >
                <span class="category-name">{{ category.category_name }}</span>
                <div class="actions">
                  <button @click.stop="editCategory(category)" class="icon-btn">
                    <Icon icon="mdi:pencil-outline" />
                  </button>
                  <button @click.stop="confirmDeleteCategory(category._id)" class="icon-btn">
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="category-list">
              <div class="empty-wrapper">
                <p v-if="!categories.length" class="empty-state">Aucune catégorie pour le moment.</p>
                <div class="add-card" @click="openAddCategoryModal">
                  <Icon icon="mdi:plus" />
                  <span>Ajouter une catégorie</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Subcategories Tab -->
          <div v-if="activeCategoryTab === 'subcategories'" class="list-container">
            <div class="category-items-wrapper">
              <div 
                v-for="subcategory in managerSubcategories" 
                :key="subcategory._id"
                :class="['category-item', { selected: selectedManagerSubcategory === subcategory._id }]"
                @click="selectManagerSubcategory(subcategory._id)"
              >
                <img 
                  :src="subcategory.subcategory_image_url" 
                  :alt="subcategory.subcategory_name"
                  class="category-image"
                  @error="handleCategoryImageError"
                >
                <span class="category-name">{{ subcategory.subcategory_name }}</span>
                <div class="actions">
                  <button @click.stop="editSubcategory(subcategory)" class="icon-btn">
                    <Icon icon="mdi:pencil-outline" />
                  </button>
                  <button @click.stop="confirmDeleteSubcategory(subcategory._id)" class="icon-btn">
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="category-list">
              <div class="empty-wrapper">
                <p v-if="!managerSubcategories.length" class="empty-state">Aucune sous-catégorie disponible.</p>
                <div class="add-card" @click="openAddSubcategoryModal">
                  <Icon icon="mdi:plus" />
                  <span>Ajouter une sous-catégorie</span>
                </div>                
              </div>
            </div>            
          </div>
          
          <!-- SubSubcategories Tab -->
          <div v-if="activeCategoryTab === 'subsubcategories'" class="list-container">
            <div class="category-items-wrapper">
              <div 
                v-for="subsubcategory in managerSubSubcategories" 
                :key="subsubcategory._id"
                class="category-item"
              >
                <img 
                  :src="subsubcategory.subsubcategory_image_url" 
                  :alt="subsubcategory.subsubcategory_name || subsubcategory.name"
                  class="category-image"
                  @error="handleCategoryImageError"
                >
                <span class="category-name">{{ subsubcategory.subsubcategory_name || subsubcategory.name }}</span>
                <div class="actions">
                  <button @click.stop="editSubSubcategory(subsubcategory)" class="icon-btn">
                    <Icon icon="mdi:pencil-outline" />
                  </button>
                  <button @click.stop="confirmDeleteSubSubcategory(subsubcategory._id)" class="icon-btn">
                    <Icon icon="mdi:trash-can-outline" />
                  </button>
                </div>
              </div>
            </div>
            
            <div class="category-list">
              <div class="empty-wrapper">
                <p v-if="!managerSubSubcategories.length" class="empty-state">Aucune sous-sous-catégorie disponible.</p>
                <div class="add-card" @click="openAddSubSubcategoryModal">
                  <Icon icon="mdi:plus" />
                  <span>Ajouter une sous-sous-catégorie</span>
                </div>                
              </div>
            </div>
          </div>

        </div>
      </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="showAddCategory" class="modal-overlay" @click.self="showAddCategory = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Modifier' : 'Ajouter' }} une catégorie</h3>
          <button @click="showAddCategory = false" class="modal-close-btn">×</button>
        </div>

        <div class="modal-body">
          <label class="form-group">
            <span>Nom de la catégorie <span class="required">*</span></span>
            <input type="text" v-model="newCategory.name" placeholder="Nom" required />
          </label>

          <label class="form-group">
            <span>Image <span class="required">*</span></span>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif, image/webp"
              @change="handleCategoryImageUpload"
            />
            <div v-if="newCategory.imagePreview" class="preview-wrapper">
              <img :src="newCategory.imagePreview" alt="Prévisualisation" />
              <button @click="removeCategoryImage" type="button" class="remove-img-btn">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
            <div v-else class="image-placeholder">
              <p>Aucune image sélectionnée</p>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <button 
            @click="saveNewCategory" 
            :disabled="!newCategory.name || (!newCategory.imageFile && !newCategory.imageUrl && !editingCategory)"
            class="modal-save-btn"
          >
            {{ editingCategory ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Subcategory Modal -->
    <div v-if="showAddSubcategory" class="modal-overlay" @click.self="showAddSubcategory = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editingSubcategory ? 'Modifier' : 'Ajouter' }} une sous-catégorie</h3>
          <button @click="showAddSubcategory = false" class="modal-close-btn">×</button>
        </div>

        <div class="modal-body">
          <label class="form-group">
            <span>Nom de la sous-catégorie <span class="required">*</span></span>
            <input type="text" v-model="newSubcategory.name" placeholder="Nom" required />
          </label>

          <label class="form-group">
            <span>Image <span class="required">*</span></span>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif, image/webp"
              @change="handleSubcategoryImageUpload"
            />
            <div v-if="newSubcategory.imagePreview" class="preview-wrapper">
              <img :src="newSubcategory.imagePreview" alt="Prévisualisation" />
              <button @click="removeSubcategoryImage" type="button" class="remove-img-btn">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
            <div v-else class="image-placeholder">
              <p>Aucune image sélectionnée</p>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <button 
            @click="saveNewSubcategory" 
            :disabled="!newSubcategory.name || (!newSubcategory.imageFile && !newSubcategory.imageUrl && !editingSubcategory)"
            class="modal-save-btn"
          >
            {{ editingSubcategory ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit SubSubcategory Modal -->
    <div v-if="showAddSubSubcategory" class="modal-overlay" @click.self="showAddSubSubcategory = false">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ editingSubSubcategory ? 'Modifier' : 'Ajouter' }} une sous-sous-catégorie</h3>
          <button @click="showAddSubSubcategory = false" class="modal-close-btn">×</button>
        </div>

        <div class="modal-body">
          <label class="form-group">
            <span>Nom <span class="required">*</span></span>
            <input type="text" v-model="newSubSubcategory.name" placeholder="Nom" required class="modal-input"/>
          </label>

          <label class="form-group">
            <span>Image <span class="required">*</span></span>
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/gif, image/webp"
              @change="handleSubSubcategoryImageUpload"
              class="modal-input"
            />
            <div v-if="newSubSubcategory.imagePreview" class="preview-wrapper">
              <img :src="newSubSubcategory.imagePreview" alt="Prévisualisation" />
              <button @click="removeSubSubcategoryImage" type="button" class="remove-img-btn">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
            <div v-else class="image-placeholder">
              <p>Aucune image sélectionnée</p>
            </div>
          </label>
        </div>

        <div class="modal-footer">
          <button 
            @click="saveNewSubSubcategory" 
            :disabled="!newSubSubcategory.name || (!newSubSubcategory.imageFile && !newSubSubcategory.imageUrl && !editingSubSubcategory)"
            class="modal-save-btn"
          >
            {{ editingSubSubcategory ? 'Mettre à jour' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
    <!-- Delete Modal -->
    <DeleteModal 
      :visible="showConfirmModal" 
      :title="confirmTitle" 
      :message="confirmMessage" 
      @confirm="onConfirm" 
      @cancel="onCancel"
    />

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '@/api'
import { useToast } from 'vue-toastification'
import ProductForm from './ProductForm.vue'
import DeleteModal from './DeleteModal.vue'
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
const currentProduct = ref(null)

const showDeleteModal = ref(false)
const productToDelete = ref(null)
const showCategoryManager = ref(false)
const activeCategoryTab = ref('categories')
const selectedManagerCategory = ref(null)
const selectedManagerSubcategory = ref(null)

// Category management states
const showAddCategory = ref(false)
const showAddSubcategory = ref(false)
const showAddSubSubcategory = ref(false)

const showConfirmModal = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const onConfirmAction = ref(null)

const newCategory = ref({
  name: '',
  imageFile: null,
  imageUrl: '',
  imagePreview: ''
})

const newSubcategory = ref({
  name: '',
  imageFile: null,
  imageUrl: '',
  imagePreview: ''
})

const newSubSubcategory = ref({
  name: '',
  imageFile: null,
  imageUrl: '',
  imagePreview: ''
})

// Editing states
const editingCategory = ref(null)
const editingSubcategory = ref(null)
const editingSubSubcategory = ref(null)

// Computed properties
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

const managerSubcategories = computed(() => {
  if (!selectedManagerCategory.value) return []
  return subcategories.value.filter(
    sub => String(sub.category_id?._id || sub.category_id) === String(selectedManagerCategory.value)
  )
})

const managerSubSubcategories = computed(() => {
  if (!selectedManagerSubcategory.value) return []
  return subsubcategories.value.filter(
    ssc => String(ssc.subcategory_id?._id || ssc.subcategory_id) === String(selectedManagerSubcategory.value)
  )
})

// Methods
const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.uploadImage(formData)
    
    return {
      url: api.getImageUrl(response.data.fileInfo.fileId),
      fileInfo: response.data.fileInfo
    }
  } catch (error) {
    console.error('Image upload failed:', error)
    throw error
  }
}

const getImageSrc = (product) => {
  if (product.product_image_file?.fileId) {
    return api.getImageUrl(product.product_image_file.fileId)
  }
  return product.product_image_url || ''
}

const handleImageError = (e, product) => {
  const img = e.target
  img.alt = 'Aucune image disponible pour ce produit.'
  img.src = ''
}

const handleCategoryImageError = (e) => {
  const img = e.target
  img.src = ''
}

const openAddProductForm = () => {
  currentProduct.value = null
  showProductForm.value = true
}

const editProduct = (product) => {
  currentProduct.value = JSON.parse(JSON.stringify(product))
  showProductForm.value = true
}

const deleteProduct = (product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    await api.deleteProduct(productToDelete.value._id)
    products.value = products.value.filter(p => p._id !== productToDelete.value._id)
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
    await api.updateProductStock(product._id, product.stock)
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

// Category management methods
const openAddCategoryModal = () => {
  editingCategory.value = null
  newCategory.value = {
    name: '',
    imageFile: null,
    imageUrl: '',
    imagePreview: ''
  }
  showAddCategory.value = true
}

const openAddSubcategoryModal = () => {
  editingSubcategory.value = null
  newSubcategory.value = {
    name: '',
    imageFile: null,
    imageUrl: '',
    imagePreview: ''
  }
  showAddSubcategory.value = true
}

const openAddSubSubcategoryModal = () => {
  editingSubSubcategory.value = null
  newSubSubcategory.value = {
    name: '',
    imageFile: null,
    imageUrl: '',
    imagePreview: ''
  }
  showAddSubSubcategory.value = true
}

const handleCategoryImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    newCategory.value.imageFile = file
    newCategory.value.imagePreview = URL.createObjectURL(file)
    newCategory.value.imageUrl = ''
  }
}

const handleSubcategoryImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    newSubcategory.value.imageFile = file
    newSubcategory.value.imagePreview = URL.createObjectURL(file)
    newSubcategory.value.imageUrl = ''
  }
}

const handleSubSubcategoryImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    newSubSubcategory.value.imageFile = file
    newSubSubcategory.value.imagePreview = URL.createObjectURL(file)
    newSubSubcategory.value.imageUrl = ''
  }
}

const removeCategoryImage = () => {
  newCategory.value.imageFile = null
  newCategory.value.imagePreview = ''
  newCategory.value.imageUrl = ''
}

const removeSubcategoryImage = () => {
  newSubcategory.value.imageFile = null
  newSubcategory.value.imagePreview = ''
  newSubcategory.value.imageUrl = ''
}

const removeSubSubcategoryImage = () => {
  newSubSubcategory.value.imageFile = null
  newSubSubcategory.value.imagePreview = ''
  newSubSubcategory.value.imageUrl = ''
}

const saveNewCategory = async () => {
  try {
    let imageUrl = newCategory.value.imageUrl
    
    if (newCategory.value.imageFile) {
      const uploadResult = await uploadImage(newCategory.value.imageFile)
      imageUrl = uploadResult.url
    } else if (!imageUrl && !editingCategory.value) {
      throw new Error('Image is required')
    }

    const categoryData = {
      category_name: newCategory.value.name,
      category_image_url: imageUrl
    }

    let res
    if (editingCategory.value) {
      res = await api.updateCategory(editingCategory.value._id, categoryData)
      const index = categories.value.findIndex(c => c._id === editingCategory.value._id)
      if (index !== -1) {
        categories.value[index] = res.data
      }
      toast.success('Catégorie mise à jour')
    } else {
      res = await api.createCategory(categoryData)
      categories.value.push(res.data)
      toast.success('Catégorie créée avec succès')
    }

    showAddCategory.value = false
    editingCategory.value = null
    newCategory.value = {
      name: '',
      imageFile: null,
      imageUrl: '',
      imagePreview: ''
    }
  } catch (err) {
    console.error('Failed to save category:', err)
    toast.error(err.message || 'Échec de la sauvegarde de la catégorie')
  }
}

const saveNewSubcategory = async () => {
  try {
    let imageUrl = newSubcategory.value.imageUrl
    
    if (newSubcategory.value.imageFile) {
      const uploadResult = await uploadImage(newSubcategory.value.imageFile)
      imageUrl = uploadResult.url
    } else if (!imageUrl && !editingSubcategory.value) {
      throw new Error('Image is required')
    }

    const subcategoryData = {
      subcategory_name: newSubcategory.value.name,
      subcategory_image_url: imageUrl,
      category_id: selectedManagerCategory.value
    }

    let res
    if (editingSubcategory.value) {
      res = await api.updateSubcategory(editingSubcategory.value._id, subcategoryData)
      const index = subcategories.value.findIndex(s => s._id === editingSubcategory.value._id)
      if (index !== -1) {
        subcategories.value[index] = res.data
      }
      toast.success('Sous-catégorie mise à jour')
    } else {
      res = await api.createSubcategory(subcategoryData)
      subcategories.value.push(res.data)
      toast.success('Sous-catégorie créée avec succès')
    }

    showAddSubcategory.value = false
    editingSubcategory.value = null
    newSubcategory.value = {
      name: '',
      imageFile: null,
      imageUrl: '',
      imagePreview: ''
    }
  } catch (err) {
    console.error('Failed to save subcategory:', err)
    toast.error(err.message || 'Échec de la sauvegarde de la sous-catégorie')
  }
}

const saveNewSubSubcategory = async () => {
  try {
    let imageUrl = newSubSubcategory.value.imageUrl
    
    if (newSubSubcategory.value.imageFile) {
      const uploadResult = await uploadImage(newSubSubcategory.value.imageFile)
      imageUrl = uploadResult.url
    } else if (!imageUrl && !editingSubSubcategory.value) {
      throw new Error('Image is required')
    }

    const subsubcategoryData = {
      subsubcategory_name: newSubSubcategory.value.name,
      subsubcategory_image_url: imageUrl,
      subcategory_id: selectedManagerSubcategory.value,
      category_id: selectedManagerCategory.value
    }

    let res
    if (editingSubSubcategory.value) {
      res = await api.updateSubSubcategory(editingSubSubcategory.value._id, subsubcategoryData)
      const index = subsubcategories.value.findIndex(s => s._id === editingSubSubcategory.value._id)
      if (index !== -1) {
        subsubcategories.value[index] = res.data
      }
      toast.success('Sous-sous-catégorie mise à jour')
    } else {
      res = await api.createSubSubcategory(subsubcategoryData)
      subsubcategories.value.push(res.data)
      toast.success('Sous-sous-catégorie créée avec succès')
    }

    showAddSubSubcategory.value = false
    editingSubSubcategory.value = null
    newSubSubcategory.value = {
      name: '',
      imageFile: null,
      imageUrl: '',
      imagePreview: ''
    }
  } catch (err) {
    console.error('Failed to save subsubcategory:', err)
    toast.error(err.message || 'Échec de la sauvegarde de la sous-sous-catégorie')
  }
}

const selectManagerCategory = (categoryId) => {
  selectedManagerCategory.value = categoryId
  selectedManagerSubcategory.value = null
  activeCategoryTab.value = 'subcategories'
}

const selectManagerSubcategory = (subcategoryId) => {
  selectedManagerSubcategory.value = subcategoryId
  activeCategoryTab.value = 'subsubcategories'
}

const editCategory = (category) => {
  editingCategory.value = category
  newCategory.value = {
    name: category.category_name,
    imageFile: null,
    imageUrl: category.category_image_url,
    imagePreview: category.category_image_url
  }
  showAddCategory.value = true
}

const editSubcategory = (subcategory) => {
  editingSubcategory.value = subcategory
  newSubcategory.value = {
    name: subcategory.subcategory_name,
    imageFile: null,
    imageUrl: subcategory.subcategory_image_url,
    imagePreview: subcategory.subcategory_image_url
  }
  showAddSubcategory.value = true
}

const editSubSubcategory = (subsubcategory) => {
  editingSubSubcategory.value = subsubcategory
  newSubSubcategory.value = {
    name: subsubcategory.subsubcategory_name || subsubcategory.name,
    imageFile: null,
    imageUrl: subsubcategory.subsubcategory_image_url,
    imagePreview: subsubcategory.subsubcategory_image_url
  }
  showAddSubSubcategory.value = true
}

function confirmDeleteCategory(categoryId) {
  confirmTitle.value = 'Suppression de catégorie'
  confirmMessage.value = `
    Voulez-vous vraiment supprimer <strong>cette catégorie</strong> ? 
    Cela supprimera toutes ses <strong>sous-catégories</strong>, 
    <strong>sous-sous-catégories</strong> et <strong>produits associés</strong>.
  `
  onConfirmAction.value = () => {
    deleteCategory(categoryId)
    showConfirmModal.value = false
  }
  showConfirmModal.value = true
}

function confirmDeleteSubcategory(subcategoryId) {
  confirmTitle.value = 'Suppression de sous-catégorie'
  confirmMessage.value = `
    Voulez-vous vraiment supprimer <strong>cette sous-catégorie</strong> ? 
    Cela supprimera toutes ses <strong>sous-sous-catégories</strong> et 
    <strong>produits associés</strong>.
  `
  onConfirmAction.value = () => {
    deleteSubcategory(subcategoryId)
    showConfirmModal.value = false
  }
  showConfirmModal.value = true
}

function confirmDeleteSubSubcategory(subsubcategoryId) {
  confirmTitle.value = 'Suppression de sous-sous-catégorie'
  confirmMessage.value = `
    Voulez-vous vraiment supprimer <strong>cette sous-sous-catégorie</strong> ? 
    Cela supprimera tous les <strong>produits associés</strong>.
  `
  onConfirmAction.value = () => {
    deleteSubSubcategory(subsubcategoryId)
    showConfirmModal.value = false
  }
  showConfirmModal.value = true
}

function onConfirm() {
  if (onConfirmAction.value) onConfirmAction.value()
}

function onCancel() {
  showConfirmModal.value = false
}

const deleteCategory = async (categoryId) => {
  try {
    await api.deleteCategory(categoryId)
    categories.value = categories.value.filter(c => c._id !== categoryId)
    subcategories.value = subcategories.value.filter(s => String(s.category_id?._id || s.category_id) !== String(categoryId))
    toast.success('Catégorie supprimée')
  } catch (err) {
    toast.error('Échec de la suppression: ' + err.message)
  }
}

const deleteSubcategory = async (subcategoryId) => {
  try {
    await api.deleteSubcategory(subcategoryId)
    subcategories.value = subcategories.value.filter(s => s._id !== subcategoryId)
    subsubcategories.value = subsubcategories.value.filter(ss => String(ss.subcategory_id?._id || ss.subcategory_id) !== String(subcategoryId))
    toast.success('Sous-catégorie supprimée')
  } catch (err) {
    toast.error('Échec de la suppression: ' + err.message)
  }
}

const deleteSubSubcategory = async (subsubcategoryId) => {
  try {
    await api.deleteSubSubcategory(subsubcategoryId)
    subsubcategories.value = subsubcategories.value.filter(ss => ss._id !== subsubcategoryId)
    toast.success('Sous-sous-catégorie supprimée')
  } catch (err) {
    toast.error('Échec de la suppression: ' + err.message)
  }
}

// Lifecycle hooks
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

// Watchers
watch(selectedCategory, () => {
  selectedSubcategory.value = ''
  selectedSubSubcategory.value = ''
})

watch(selectedSubcategory, () => {
  selectedSubSubcategory.value = ''
})
</script>

<style scoped>
.product-manager {
  max-width: 900px;
  margin: auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
  background: #f8f9fa;
  padding: 0.8rem;
  border-radius: 10px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.05);
  position: sticky;
  top: 148px;
  z-index: 100;
  backdrop-filter: blur(8px); 
}

.filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.menu-icon-btn {
  background: transparent;
  border: none;
  color: #2F8F9D;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.menu-icon-btn:hover {
  color: #1d6e75;
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
  font-size: 1rem;
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

/* cats tabs */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2001;
}

.category-manager-modal {
  background: white;
  padding: 2rem;
  width: 80%;
  max-width: 900px;
  height: 80vh; /* Fixed height */
  min-height: 500px; /* Minimum height */
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  position: relative;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  background: none;
  border: none;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 1rem;
}

.tab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Important for fixed height */
}

.tabs button {
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tabs button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tabs button.active {
  color: #2F8F9D;
  border-bottom-color: #2F8F9D;
}

.list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* Scrollable content */
  padding-right: 0.5rem; /* Prevent scrollbar overlap */
}

.category-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: auto; /* Pushes to bottom when content is short */
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #eee;
  flex: 1 1 calc(50% - 1rem);
  min-width: 250px;
  transition: all 0.2s;
  cursor: pointer;
}

.category-item:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.category-item.selected {
  border-color: #2F8F9D;
  background-color: #f0f9fa;
}

.category-items-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 1rem;
}

.category-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  background-color: #f5f5f5;
}

.category-name {
  flex: 1;
  font-weight: 500;
  color: #333;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.icon-btn:hover {
  color: #2F8F9D;
  background: #f0f9fa;
}

.empty-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #2F8F9D;
  border-radius: 8px;
  color: #2F8F9D;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1 1 100%;
}

.add-card:hover {
  background: #f0f9fa;
}

.empty-state {
  text-align: center;
  padding: 1.5rem;
  margin-top: 0rem;
  color: #666;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px dashed #ddd;
  flex: 1 1 100%;
}

/* Custom scrollbar for better UX */
.list-container::-webkit-scrollbar {
  width: 8px;
}

.list-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.list-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.list-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* add/edit cats modals */
/* Modal Box */
.modal-box {
  background: #fff;
  border-radius: 1rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.modal-close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  color: #555;
}

/* Modal Body */
.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.95rem;
}

.form-group input[type="text"],
.form-group input[type="file"] {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input[type="text"]:focus {
  border-color: #2f8f9d;
}

.required {
  color: red;
  font-weight: bold;
}

/* Image Preview */
.preview-wrapper {
  position: relative;
  display: inline-block;
  margin-top: 0.5rem;
}

.preview-wrapper img {
  width: 100px;
  height: auto;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
}

.remove-img-btn {
  position: absolute;
  top: -8px;
  right: 340px;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 0.3rem;
  cursor: pointer;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

/* Modal Footer */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  text-align: right;
}

.modal-save-btn {
  background: #2f8f9d;
  color: #fff;
  padding: 0.6rem 1.2rem;
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s;
}

.modal-save-btn:hover:enabled {
  background: #257b86;
}

.modal-save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.image-placeholder {
  font-size: 0.85rem;
  color: #999;
  background: #f9f9f9;
  padding: 1rem;
  border: 1px dashed #ccc;
  border-radius: 0.5rem;
  text-align: center;
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
  margin-bottom: 1rem;
}

.sticky-addBtn {
  position: sticky;
  top: 400px; /* This should be filters height (148px) + filters element height (~72px) */
  z-index: 900; /* Lower than filters z-index */
  margin-top: 0.5rem; /* Add some spacing */
  width: auto; /* Or specific width if needed */
  backdrop-filter: blur(8px);
  transition: top 0.3s ease;
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
/* Mobile Responsiveness */
@media (max-width: 768px) {
  .product-manager {
    padding: 1rem;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .filters {
    top: 120px; /* Adjusted sticky position for mobile */
    padding: 0.8rem;
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
    padding: 1rem;
    position: relative;
  }
  
  .product-img {
    width: 100%;
    height: auto;
    max-height: 250px;
  }
  
  .info {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .action-btn {
    position: static;
    width: 100%;
    margin-bottom: 0.5rem;
    justify-content: center;
  }
  
  .sticky-addBtn {
    position: sticky;
    top: 290px;  /* Adjusted for mobile */
    z-index: 90;
    margin-bottom: 1rem;
    width: calc(100% - 2rem); /* Account for padding */
    margin-left: 1rem;
    margin-right: 1rem;
  }
  
  .update-btn {
    margin-top: 0.5rem;
    width: 100%;
  }

  .empty-state {
    padding: 2rem 1rem;
  }
  
  /* Modal adjustments */
  .modal {
    width: 95%;
    padding: 1.5rem;
  }
  
  .category-manager-modal {
    width: 95%;
    height: 85vh;
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .filters {
    top: 100px; /* Further adjustment for very small screens */
  }
  
  .sticky-addBtn {
    top: 180px;
  }
  
  .info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .stock-input {
    width: 100%;
  }
  
  /* delete modal */
  .delete-modal {
    width: 95%;
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .cancel-btn,
  .confirm-delete-btn {
    width: 100%;
  }
  
  /* Category manager adjustments */
  .category-item {
    flex-direction: column;
    text-align: center;
    min-width: 100%;
  }
  
  .actions {
    margin-top: 0.5rem;
    justify-content: center;
  }
  
  .tabs button {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
}

/* Enhanced sticky behavior for all screen sizes */
.sticky-addBtn {
  position: sticky;
  top: 220px; /* Default position for desktop */
  z-index: 90;
  backdrop-filter: blur(8px);
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

/* Ensure sticky elements don't overlap */
@media (min-width: 769px) {
  .filters {
    top: 148px;
  }
  .sticky-addBtn {
    top: 220px;
  }
}

/* Smooth transitions for sticky elements */
.filters, .sticky-addBtn {
  transition: top 0.3s ease;
}
</style>