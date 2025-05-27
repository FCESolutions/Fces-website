<template>
  <div class="product-form">
    <h2>{{ currentProduct ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>

    <!-- Add a status indicator if editing -->
    <div v-if="currentProduct" class="edit-status">
      Modification du produit: {{ currentProduct.product_name }}
    </div>

    <!-- Category section -->
    <div class="form-section">
      <label>
        Catégorie <span class="required">*</span>
        <div class="select-with-add">
          <select v-model="formData.category_id" required>
            <option value="">Sélectionner une catégorie</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.category_name || cat.name }}
            </option>
          </select>
          <button type="button" @click="showAddCategory = true" class="add-option-btn">+</button>
        </div>
        <span v-if="errors.category_id" class="error-message">{{ errors.category_id }}</span>
      </label>
    </div>

    <!-- Subcategory section -->
    <div class="form-section" v-if="formData.category_id">
      <label>
        Sous-catégorie <span class="optional">(optionnel)</span>
        <div class="select-with-add">
          <select v-model="formData.subcategory_id">
            <option value="">Sélectionner une sous-catégorie</option>
            <option v-for="sub in filteredSubcategories" :key="sub._id" :value="sub._id">
              {{ sub.subcategory_name || sub.name }}
            </option>
          </select>
          <button 
            type="button" 
            @click="showAddSubcategory = true" 
            class="add-option-btn"
            :disabled="!formData.category_id"
          >
            +
          </button>
        </div>
        <p v-if="filteredSubcategories.length === 0">Aucune sous-catégorie trouvée. Ajoutez-en une avec le bouton +.</p>
      </label>
    </div>

    <!-- Sub-subcategory section -->
    <div class="form-section" v-if="formData.subcategory_id">
      <label>
        Sous-sous-catégorie <span class="optional">(optionnel)</span>
        <div class="select-with-add">
          <select v-model="formData.subsubcategory_id">
            <option value="">Sélectionner une sous-sous-catégorie</option>
            <option v-for="ssc in filteredSubSubcategories" :key="ssc._id" :value="ssc._id">
              {{ ssc.subsubcategory_name || ssc.name }}
            </option>
          </select>
          <button 
            type="button" 
            @click="showAddSubSubcategory = true" 
            class="add-option-btn"
            :disabled="!formData.subcategory_id"
          >
            +
          </button>
        </div>
        <p v-if="filteredSubSubcategories.length === 0">Aucune sous-sous-catégorie trouvée. Ajoutez-en une avec le bouton +.</p>
      </label>
    </div>


    <!-- Product name -->
    <div class="form-section">
      <label>
        Nom du produit <span class="required">*</span>
        <input v-model="formData.product_name" required placeholder="Nom du produit" />
        <span v-if="errors.product_name" class="error-message">{{ errors.product_name }}</span>
      </label>
    </div>

    <!-- Marque -->
    <div class="form-section">
      <label>
        Marque <span class="required">*</span>
        <input v-model="formData.marque" required placeholder="Marque du produit" />
        <span v-if="errors.marque" class="error-message">{{ errors.marque }}</span>
      </label>
    </div>

    <!-- Product image -->
    <div class="form-section">
      <label>
        Image URL <span class="required">*</span>
        <input 
          v-model="formData.product_image_url" 
          required 
          placeholder="URL de l'image"
          :class="{ 'error': errors.product_image_url }"
        />
        <div v-if="formData.product_image_url" class="image-preview">
          <!-- Add error handling for image loading -->
          <img 
            :src="cleanImageUrl(formData.product_image_url)" 
            alt="Product preview" 
            @error="handleImageError"
          />
        </div>
        <span v-if="errors.product_image_url" class="error-message">{{ errors.product_image_url }}</span>
      </label>
    </div>

    <!-- Description editor -->
    <div class="description-editor">
      <label>
        Description <span class="required">*</span>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </label>
      <div class="desc-toolbar">
        <button class="desc-action-btn" @click="addHeading">+ Heading</button>
        <button class="desc-action-btn" @click="addParagraph">+ Paragraph</button>
        <button class="desc-action-btn" @click="addBulletList">+ Bullet List</button>
        <button class="desc-toggle-btn" @click="previewMode = !previewMode">
          <Icon v-if="previewMode" icon="mdi:arrow-left" class="mr-1" />
          <Icon v-else icon="mdi:eye-outline" class="mr-1" />
          {{ previewMode ? 'Back to Edit' : 'Preview' }}
        </button>
      </div>

      <!-- Edit Mode -->
      <transition name="fade">
        <draggable
          v-if="!previewMode"
          v-model="formData.description"
          handle=".handle"
          item-key="id"
        >
          <template #item="{ element, index }">
            <div class="desc-block">
              <span class="handle"><Icon icon="mdi:drag" style="font-size: 23px" /></span>

              <div v-if="element.type === 'heading'">
                <input v-model="element.content" placeholder="Enter heading..." />
              </div>

              <div v-else-if="element.type === 'paragraph'">
                <textarea v-model="element.content" placeholder="Enter paragraph..."></textarea>
              </div>

              <div v-else-if="element.type === 'bullet_list'">
                <div
                  v-for="(item, i) in element.items"
                  :key="i"
                  class="bullet-item"
                >
                  <input v-model="element.items[i]" placeholder="– Bullet point..." />
                  <button @click="removeBulletItem(index, i)" class="desc-remove-btn">
                    <Icon icon="mdi:minus" />
                  </button>
                </div>
                <button @click="addBulletItem(index)" class="add-btn">
                  <Icon icon="mdi:plus" class="mr-1" /> Bullet
                </button>
              </div>
            </div>
          </template>
        </draggable>
      </transition>

      <!-- Preview Mode -->
      <transition name="fade">
        <div v-if="previewMode" class="preview-container special-preview">
          <template v-for="(element, index) in formData.description" :key="index">
            <h4 v-if="element.type === 'heading'">{{ element.content }}</h4>
            <p v-else-if="element.type === 'paragraph'">{{ element.content }}</p>
            <ul v-else-if="element.type === 'bullet_list'">
              <li v-for="(item, i) in element.items" :key="i">{{ item }}</li>
            </ul>
          </template>
        </div>
      </transition>
    </div>

    <!-- External links -->
    <div class="form-section">
      <label>Liens externes <span class="optional">(optionnel)</span></label>
      <div class="link-blocks">
        <div
          v-for="(link, index) in formData.external_links"
          :key="'ext-' + index"
          class="link-block"
        >
          <div class="input-group">
            <button
              @click="removeExternalLink(index)"
              class="link-remove-btn"
              title="Supprimer"
            >
              <Icon icon="mdi:minus" />
            </button>
            <input v-model="link.label" placeholder="Label" />
            <input v-model="link.url" placeholder="URL" />            
          </div>
        </div>
        <button @click="addExternalLink" class="add-btn">Ajouter un lien</button>
      </div>
    </div>

    <!-- Product files -->
    <div class="form-section">
      <label>Fichiers produits <span class="optional">(optionnel)</span></label>
      <div class="link-blocks">
        <div
          v-for="(file, index) in formData.product_files"
          :key="'file-' + index"
          class="link-block"
        >
          <div class="input-group">
            <button
              @click="removeProductFile(index)"
              class="link-remove-btn"
              title="Supprimer"
            >
              <Icon icon="mdi:minus" />
            </button>
            <input v-model="file.label" placeholder="Label" />
            <input v-model="file.url" placeholder="URL" />
          </div>
        </div>
        <button @click="addProductFile" class="add-btn">Ajouter un fichier</button>
      </div>
    </div>

    <!-- Specification Editor -->
    <div class="form-section">
      <label> 
        Spécifications techniques <span class="required">*</span> 
        <span v-if="errors.specifications" class="error-message">{{ errors.specifications }}</span>
      </label>
      <div class="specs-editor">
        <!-- Categories list -->
        <div v-for="(category, catIndex) in formData.specifications.categories" :key="catIndex" class="spec-category">
          <div class="category-header">
            <input v-model="category.name" placeholder="Nom de la catégorie" class="category-name" />
            <button @click="removeCategory(catIndex)" class="trash-spec-remove-btn">
              <Icon icon="mdi:trash-can-outline" />
            </button>
          </div>

          <!-- Tabs navigation -->
          <div class="spec-tabs">
            <button 
              @click="category.activeTab = 'simple'"
              :class="{ 'active': category.activeTab === 'simple' }"
            >
              Spécifications simples
            </button>
            <button 
              @click="category.activeTab = 'model'"
              :class="{ 'active': category.activeTab === 'model' }"
            >
              Spécifications par modèle
            </button>
          </div>

          <!-- Simple specs tab -->
          <div v-show="category.activeTab === 'simple'" class="spec-tab-content">
            <div v-for="(spec, specIndex) in category.simpleSpecs" :key="'simple-'+specIndex" class="spec-item">
              <input v-model="spec.title" placeholder="Titre" class="spec-title" />
              <input v-model="spec.value" placeholder="Valeur" class="spec-value" />
              <button @click="removeSimpleSpec(catIndex, specIndex)" class="spec-remove-btn">
                <Icon icon="mdi:minus" />
              </button>
            </div>
            <button @click="addSimpleSpec(catIndex)" class="add-btn">
              <Icon icon="mdi:plus" /> Ajouter une spécification simple
            </button>
          </div>

          <!-- Model-based specs tab -->
          <div v-show="category.activeTab === 'model'" class="spec-tab-content">
            <div v-for="(modelGroup, modelIndex) in category.modelSpecs" :key="'model-'+modelIndex" class="model-group">
              <div class="model-header">
                <input v-model="modelGroup.subcategory" placeholder="Nom du sous-modèle" class="subcategory-name" />
                <button @click="removeModelGroup(catIndex, modelIndex)" class="trash-spec-remove-btn">
                  <Icon icon="mdi:trash-can-outline" />
                </button>
              </div>
              
              <div v-for="(spec, specIndex) in modelGroup.specs" :key="'model-spec-'+specIndex" class="spec-item">
                <input v-model="spec.title" placeholder="Titre" class="spec-title" />
                <input v-model="spec.value" placeholder="Valeur" class="spec-value" />
                <button @click="removeModelSpec(catIndex, modelIndex, specIndex)" class="spec-remove-btn">
                  <Icon icon="mdi:minus" />
                </button>
              </div>
              
              <button @click="addModelSpec(catIndex, modelIndex)" class="add-btn small">
                <Icon icon="mdi:plus" /> Ajouter une spécification
              </button>
            </div>
            <button @click="addModelGroup(catIndex)" class="add-btn">
              <Icon icon="mdi:plus" /> Ajouter un groupe de modèles
            </button>
          </div>
        </div>

        <!-- Add new category button -->
        <button @click="addNewCategory" class="add-btn">
          <Icon icon="mdi:plus" /> Ajouter une catégorie
        </button>
      </div>
    </div>


    <!-- Stock -->
    <div class="form-section">
      <label>
        Stock <span class="required">*</span>
        <input type="number" v-model.number="formData.stock" min="0" required />
        <span v-if="errors.stock" class="error-message">{{ errors.stock }}</span>
      </label>
    </div>

    <!-- Add Category Modal -->
    <div v-if="showAddCategory" class="modal-overlay" @click.self="showAddCategory = false">
      <div class="modal">
        <h3>Ajouter une nouvelle catégorie</h3>
        <button @click="showAddCategory = false" class="close-btn">×</button>
        <div class="form-section">
          <label>
            Nom de la catégorie <span class="required">*</span>
            <input v-model="newCategory.name" placeholder="Nom" required />
          </label>
        </div>
        <div class="form-section">
          <label>
            Image URL <span class="required">*</span>
            <input v-model="newCategory.image_url" placeholder="URL de l'image" required />
          </label>
        </div>
        <button @click="saveNewCategory" class="save-btn">Enregistrer</button>
      </div>
    </div>

    <!-- Add Subcategory Modal -->
    <div v-if="showAddSubcategory" class="modal-overlay" @click.self="showAddSubcategory = false">
      <div class="modal">
        <h3>Ajouter une nouvelle sous-catégorie</h3>
        <button @click="showAddSubcategory = false" class="close-btn">×</button>
        <div class="form-section">
          <label>
            Nom de la sous-catégorie <span class="required">*</span>
            <input v-model="newSubcategory.name" placeholder="Nom" required />
          </label>
        </div>
        <div class="form-section">
          <label>
            Image URL <span class="required">*</span>
            <input v-model="newSubcategory.image_url" placeholder="URL de l'image" required />
          </label>
        </div>
        <button @click="saveNewSubcategory" class="save-btn">Enregistrer</button>
      </div>
    </div>

    <!-- Add SubSubcategory Modal -->
    <div v-if="showAddSubSubcategory" class="modal-overlay" @click.self="showAddSubSubcategory = false">
      <div class="modal">
        <h3>Ajouter une nouvelle sous-sous-catégorie</h3>
        <button @click="showAddSubSubcategory = false" class="close-btn">×</button>
        <div class="form-section">
          <label>
            Nom <span class="required">*</span>
            <input v-model="newSubSubcategory.name" placeholder="Nom" required />
          </label>
        </div>
        <div class="form-section">
          <label>
            Image URL <span class="required">*</span>
            <input v-model="newSubSubcategory.image_url" placeholder="URL de l'image" required />
          </label>
        </div>
        <button @click="saveNewSubSubcategory" class="save-btn">Enregistrer</button>
      </div>
    </div>

    <!-- Form actions -->
    <div class="form-actions">
      <button @click="saveProduct" class="save-btn">Enregistrer</button>
      <button @click="$emit('cancel')" class="cancel-btn">Annuler</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive, watchEffect } from 'vue'
import api from '@/api'
import draggable from 'vuedraggable'
import { useToast } from 'vue-toastification'
import { Icon } from '@iconify/vue';

const toast = useToast()

const props = defineProps({
  product: Object, // null when creating, contains product data when editing
  categories: Array,
  subcategories: Array,
  subsubcategories: Array,
  currentProduct: Object // Add this to track if we're editing
})

const emit = defineEmits(['saved', 'cancel'])
const previewMode = ref(false)

const defaultProduct = {
  product_name: '',
  category_id: '',
  subcategory_id: '',
  subsubcategory_id: '',
  marque: '',
  product_image_url: '',
  description: [],
  external_links: [],
  product_files: [],
  specifications: {},
  stock: 0
}

// Modify the formData initialization to properly handle editing
const formData = ref(
  props.product 
    ? JSON.parse(JSON.stringify({
        ...defaultProduct,
        ...props.product,
        // Ensure specifications exists and has proper structure
        specifications: props.product.specifications || {}
      }))
    : { 
        ...defaultProduct,
        specifications: {}
      }
)

// Specification methods
const newCategoryName = ref('')
const newSpecKey = reactive({})
const newModelKey = reactive({})
const newModelValue = reactive({})

// Add this to your script setup
const errors = reactive({
  product_name: null,
  category_id: null,
  marque: null,
  product_image_url: null,
  description: null,
  stock: null,
  specifications: null
})

// Initialize the specifications structure if empty
// Update the watchEffect to properly handle the model specs conversion
watchEffect(() => {
  if (!formData.value.specifications) {
    formData.value.specifications = {
      categories: []
    }
  } else if (!formData.value.specifications.categories) {
    // Convert from your existing format to our editable format
    formData.value.specifications = {
      categories: Object.entries(formData.value.specifications).map(([categoryName, specs]) => {
        const category = {
          name: categoryName,
          simpleSpecs: [],
          modelSpecs: [],
          activeTab: 'simple'
        }
        
        // Process all specs to determine if they're simple or model-based
        Object.entries(specs).forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Simple spec
            category.simpleSpecs.push({
              title: key,
              value: value
            })
          } else if (typeof value === 'object' && value !== null) {
            // Model-based spec
            category.modelSpecs.push({
              subcategory: key,
              specs: Object.entries(value).map(([modelKey, modelValue]) => ({
                title: modelKey,
                value: modelValue
              }))
            })
          }
        })
        
        return category
      })
    }
  }
})

// Initialize empty arrays if they don't exist
if (!formData.value.description) formData.value.description = [{ type: 'paragraph', content: '' }]
if (!formData.value.external_links) formData.value.external_links = []
if (!formData.value.product_files) formData.value.product_files = []
if (!formData.value.specifications) formData.value.specifications = { specs: {} }
if (formData.value.stock === undefined || formData.value.stock === null) formData.value.stock = 0

// Add new category/subcategory states
const showAddCategory = ref(false)
const showAddSubcategory = ref(false)
const showAddSubSubcategory = ref(false)

const newCategory = ref({
  name: '',
  image_url: ''
})

const newSubcategory = ref({
  name: '',
  image_url: '',
  category_id: ''
})

const newSubSubcategory = ref({
  name: '',
  image_url: '',
  subcategory_id: ''
})

// Update subcategory's category_id when category changes
watch(() => formData.value.category_id, (newVal) => {
  newSubcategory.value.category_id = newVal
  // When editing, ensure we reset subcategories if category changes
  if (props.product && props.product.category_id !== newVal) {
    formData.value.subcategory_id = ''
    formData.value.subsubcategory_id = ''
  }
})

// Update subsubcategory's subcategory_id when subcategory changes
watch(() => formData.value.subcategory_id, (newVal) => {
  newSubSubcategory.value.subcategory_id = newVal
  if (props.product && props.product.subcategory_id !== newVal) {
    formData.value.subsubcategory_id = ''
  }
})

// Filtered dropdown options
const filteredSubcategories = computed(() => {
  if (!formData.value.category_id) return []
  return props.subcategories.filter(
    sub => String(sub.category_id?._id || sub.category_id) === String(formData.value.category_id)
  )
})

const filteredSubSubcategories = computed(() => {
  if (!formData.value.subcategory_id) return []
  return props.subsubcategories.filter(
    ssc => String(ssc.subcategory_id?._id || ssc.subcategory_id) === String(formData.value.subcategory_id))
})

// Convert specs object to an array of [key, value] for safe rendering
const specEntries = computed(() =>
  Object.entries(formData.value.specifications?.specs || {})
)

// img methods
const cleanImageUrl = (url) => {
  if (!url) return url
  
  try {
    const urlObj = new URL(url)
    // Remove file extensions from pathname
    const path = urlObj.pathname.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
    urlObj.pathname = path
    return urlObj.toString()
  } catch {
    // If URL parsing fails, just return the original
    return url
  }
}

const handleImageError = (e) => {
  const img = e.target
  // Try adding common extensions if the image fails to load
  const extensions = ['.jpg', '.jpeg', '.png', '.webp']
  const currentSrc = img.src
  
  if (!extensions.some(ext => currentSrc.endsWith(ext))) {
    // Try each extension until one works
    for (const ext of extensions) {
      const testSrc = currentSrc + ext
      img.src = testSrc
      // If it loads, update the form data
      img.onload = () => {
        formData.value.product_image_url = testSrc
      }
      break
    }
  }
}

// Description methods
const addParagraph = () => {
  formData.value.description.push({
    type: 'paragraph',
    content: ''
  })
}

const addBulletList = () => {
  formData.value.description.push({
    type: 'bullet_list',
    items: ['']
  })
}

const addHeading = () => {
  formData.value.description.push({
    type: 'heading',
    content: ''
  })
}

const removeDescriptionItem = (index) => {
  formData.value.description.splice(index, 1)
}

const addBulletItem = (descIndex) => {
  formData.value.description[descIndex].items.push('')
}

const removeBulletItem = (descIndex, itemIndex) => {
  formData.value.description[descIndex].items.splice(itemIndex, 1)
}

// External links methods
const addExternalLink = () => {
  formData.value.external_links.push({
    label: '',
    url: '',
    type: 'external_resource'
  })
}

const removeExternalLink = (index) => {
  formData.value.external_links.splice(index, 1)
}

// Product files methods
const addProductFile = () => {
  formData.value.product_files.push({
    label: '',
    url: '',
    type: 'pdf'
  })
}

const removeProductFile = (index) => {
  formData.value.product_files.splice(index, 1)
}

// Specifications methods
// Category methods
const addNewCategory = () => {
  formData.value.specifications.categories.push({
    name: 'Nouvelle catégorie',
    simpleSpecs: [],
    modelSpecs: []
  })
}

const removeCategory = (index) => {
  if (confirm('Supprimer cette catégorie et toutes ses spécifications?')) {
    formData.value.specifications.categories.splice(index, 1)
  }
}

// Simple spec methods
const addSimpleSpec = (catIndex) => {
  formData.value.specifications.categories[catIndex].simpleSpecs.push({
    title: '',
    value: ''
  })
}

const removeSimpleSpec = (catIndex, specIndex) => {
  formData.value.specifications.categories[catIndex].simpleSpecs.splice(specIndex, 1)
}

// Model spec methods
const addModelGroup = (catIndex) => {
  formData.value.specifications.categories[catIndex].modelSpecs.push({
    subcategory: 'Nouveau sous-modèle',
    specs: []
  })
}

const removeModelGroup = (catIndex, modelIndex) => {
  if (confirm('Supprimer ce groupe de modèles et toutes ses spécifications?')) {
    formData.value.specifications.categories[catIndex].modelSpecs.splice(modelIndex, 1)
  }
}

const addModelSpec = (catIndex, modelIndex) => {
  formData.value.specifications.categories[catIndex].modelSpecs[modelIndex].specs.push({
    title: '',
    value: ''
  })
}

const removeModelSpec = (catIndex, modelIndex, specIndex) => {
  formData.value.specifications.categories[catIndex].modelSpecs[modelIndex].specs.splice(specIndex, 1)
}

const transformedSpecifications = computed(() => {
  const result = {}
  
  formData.value.specifications.categories.forEach(category => {
    // Simple specs
    const simpleSpecs = {}
    category.simpleSpecs.forEach(spec => {
      if (spec.title && spec.value) {
        simpleSpecs[spec.title] = spec.value
      }
    })
    
    // Model specs
    const modelSpecs = {}
    category.modelSpecs.forEach(modelGroup => {
      if (modelGroup.subcategory) {
        const modelValues = {}
        modelGroup.specs.forEach(spec => {
          if (spec.title && spec.value) {
            modelValues[spec.title] = spec.value
          }
        })
        modelSpecs[modelGroup.subcategory] = modelValues
      }
    })
    
    // Combine both types
    result[category.name] = {
      ...simpleSpecs,
      ...modelSpecs
    }
  })
  
  return result
})

// Save new category
const saveNewCategory = async () => {
  try {
    const res = await api.createCategory({
      category_name: newCategory.value.name,
      image_url: newCategory.value.image_url
    })
    
    // Add to local categories list
    props.categories.push(res.data)
    
    // Select the new category
    formData.value.category_id = res.data._id
    
    // Reset and close
    newCategory.value = { name: '', image_url: '' }
    showAddCategory.value = false
  } catch (err) {
    console.error('Failed to create category:', err)
  }
}

// Save new subcategory
const saveNewSubcategory = async () => {
  try {
    const res = await api.createSubcategory({
      subcategory_name: newSubcategory.value.name,
      image_url: newSubcategory.value.image_url,
      category_id: formData.value.category_id
    })
    
    // Add to local subcategories list
    props.subcategories.push(res.data)
    
    // Select the new subcategory
    formData.value.subcategory_id = res.data._id
    
    // Reset and close
    newSubcategory.value = { name: '', image_url: '', category_id: '' }
    showAddSubcategory.value = false
  } catch (err) {
    console.error('Failed to create subcategory:', err)
  }
}

// Save new subsubcategory
const saveNewSubSubcategory = async () => {
  try {
    const res = await api.createSubSubcategory({
      subsubcategory_name: newSubSubcategory.value.name,
      image_url: newSubSubcategory.value.image_url,
      subcategory_id: formData.value.subcategory_id
    })
    
    // Add to local subsubcategories list
    props.subsubcategories.push(res.data)
    
    // Select the new subsubcategory
    formData.value.subsubcategory_id = res.data._id
    
    // Reset and close
    newSubSubcategory.value = { name: '', image_url: '', subcategory_id: '' }
    showAddSubSubcategory.value = false
  } catch (err) {
    console.error('Failed to create subsubcategory:', err)
  }
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = null)
  
  // Validate required fields
  if (!formData.value.product_name?.trim()) {
    errors.product_name = 'Le nom du produit est requis'
    isValid = false
  }
  
  if (!formData.value.category_id) {
    errors.category_id = 'La catégorie est requise'
    isValid = false
  }
  
  if (!formData.value.marque?.trim()) {
    errors.marque = 'La marque est requise'
    isValid = false
  }
  
  if (!formData.value.product_image_url?.trim()) {
    errors.product_image_url = "L'URL de l'image est requise"
    isValid = false
  } else if (!isValidUrl(formData.value.product_image_url)) {
    errors.product_image_url = "L'URL de l'image n'est pas valide"
    isValid = false
  }
  
  if (!formData.value.description?.length) {
    errors.description = 'La description est requise'
    isValid = false
  }
  
  if (formData.value.stock === null || formData.value.stock === undefined || formData.value.stock < 0) {
    errors.stock = 'Le stock doit être un nombre positif'
    isValid = false
  }
  
  // Validate specifications
  if (!formData.value.specifications?.categories?.length) {
    errors.specifications = 'Au moins une spécification technique est requise'
    isValid = false
  }
  
  return isValid
}

const isValidUrl = (url) => {
  try {
    // Basic check - allow relative URLs too
    if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
      return true
    }
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Save product
const saveProduct = async () => {
  if (!validateForm()) {
    toast.error('Veuillez corriger les erreurs dans le formulaire')
    return
  }

  try {
    const cleanData = {
      ...formData.value,
      product_image_url: cleanImageUrl(formData.value.product_image_url), // Clean the URL
      specifications: transformedSpecifications.value
    }

    if (props.product) {
      await api.updateProduct(props.product._id, cleanData)
      toast.success('Produit mis à jour avec succès')
    } else {
      await api.createProduct(cleanData)
      toast.success('Produit créé avec succès')
    }
    
    emit('saved')
  } catch (err) {
    console.error('Failed to save product:', err)
    toast.error(`Échec de ${props.product ? 'la mise à jour' : 'la création'} du produit`)
  }
}
</script>

<style scoped>

.product-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1.5rem;
  color: #1e3a8a;
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.edit-status {
  background: #f0f9ff;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #3b82f6;
  margin-bottom: 1.5rem;
  color: #1e40af;
  font-size: 0.9rem;
}

.form-section {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1.25rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #334155;
  font-size: 0.9rem;
}

input, select, textarea {
  width: 95%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.required {
  color: #ef4444;
}

.optional {
  color: #64748b;
  font-size: 0.8rem;
}

/* cat, subcat, subsubcat input forms*/
.select-with-add {
  display: flex;
  gap: 0.5rem;
}

.select-with-add select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg fill='none' stroke='%23334155' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem; /* Make space for the icon */
}

.add-option-btn {
  padding: 0.4rem 0.6rem;
  margin-left: 0px;
  margin-bottom: 6px;
  background: transparent;
  color: #3b82f6;
  border: none;
  cursor: pointer;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, border-color 0.2s, transform 0.1s;
}

.add-option-btn:hover {
  color: #2563eb;
  transform: translateY(-1px);
}

.add-option-btn:disabled {
  color: #94a3b8;
  cursor: not-allowed;
  transform: none;
}

.description-editor,
.external-links,
.product-files,
.specs-editor {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 4px;
  background: white;
}

.image-preview {
  position: relative;
  margin-top: 0.5rem;
}

.image-preview img {
  max-width: 150px;
  max-height: 150px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  object-fit: contain;
  background: #f8fafc;
}

.image-preview img:before {
  content: "Image non disponible";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f8fafc;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
}

/* description editor */
.desc-block {
  border: 1px solid #e2e8f0;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  border-radius: 4px;
  background: #f8fafc;
  position: relative;
}

/* Buttons in desc editor */
.desc-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.desc-action-btn {
  background: #f1f5f9;
  color: #1e3a8a;
  border: 1px solid #cbd5e1;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.desc-action-btn:hover {
  background: #e2e8f0;
}

.desc-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.desc-toggle-btn:hover {
  background: #2563eb;
}

.desc-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Description Editor Remove Buttons */
.desc-remove-btn {
  all: unset;
  cursor: pointer;
  color: #ef4444;
  font-size: 20px;
  line-height: 1;
  transition: transform 0.2s;
  background: none !important;
  padding: 0;
  margin: 0;
}

.desc-remove-btn:hover {
  transform: scale(1.2);
}

.bullet-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.5rem;
}

.preview-container {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.preview-container h4 {
  color: #1e40af;
  font-size: 1.1rem;
  margin: 0.5rem 0;
}

.preview-container ul {
  margin-left: 1.5rem;
  color: #334155;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.handle {
  cursor: move;
  color: #64748b;
  margin-right: 0.5rem;
}

.handle:hover {
  color: #1e3a8a;
}

.add-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.add-btn:hover {
  background: #2563eb;
}

/* external links and product files */
.link-blocks {
  margin-top: 0.5rem;
}

.link-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-block input {
  width: 94%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
}

.link-block input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.5);
}

.link-remove-btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 20px;
  border: none;
  background: transparent;
  color: #ef4444; /* red-500 */
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 4px;
}

.link-remove-btn svg {
  display: block;
}

/* Specifications Editor */
.specs-editor {
  margin-top: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.spec-category {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.category-name {
  flex: 1;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.spec-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.spec-section h4 {
  margin-bottom: 1rem;
  color: #1e40af;
  font-size: 1rem;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.spec-title, .spec-value {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.model-group {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f1f5f9;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.model-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.subcategory-name {
  flex: 1;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
}

.add-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.add-btn:hover {
  background: #2563eb;
}

.add-btn.small {
  padding: 0.3rem 0.6rem;
  font-size: 0.8rem;
}

/* Spec Editor Remove Buttons */
.spec-remove-btn {
  all: unset;
  cursor: pointer;
  color: #ef4444;
  font-size: 18px;
  background: none !important;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
}

.spec-remove-btn:hover {
  color: #dc2626;
}

/* Category Remove Buttons */
.trash-spec-remove-btn {
  all: unset;
  cursor: pointer;
  color: #ef4444;
  font-size: 20px;
  background: none !important;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
}

.trash-spec-remove-btn:hover {
  background: #fee2e2 !important;
}

/* Tabs styles */
.spec-tabs {
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #e2e8f0;
  margin: 1rem 0;
}

.spec-tabs button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
}

.spec-tabs button:hover {
  color: #334155;
}

.spec-tabs button.active {
  color: #1e40af;
  border-bottom-color: #1e40af;
}

.spec-tab-content {
  padding: 0.5rem 0;
}

/* Compact styles for tabs */
.model-group {
  margin-bottom: 1.5rem;
}

.spec-item {
  margin-bottom: 0.75rem;
}

.add-btn {
  margin-top: 0.75rem;
}

.add-btn {
  background: #dbeafe;
  color: #1d4ed8;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #bfdbfe;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.save-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
}

.save-btn:hover {
  background: #2563eb;
}

.cancel-btn {
  background: white;
  color: #64748b;
  border: 1px solid #cbd5e1;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  backdrop-filter: blur(2px);
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #334155;
}

.error-msg {
  color: #ef4444;
  font-size: 0.8rem;
  display: block;
  margin-top: 0.25rem;
}

/* Error Styles */
.error {
  border-color: #ef4444 !important;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

/* For select with error */
.select-with-add .error {
  border-color: #ef4444 !important;
}

/* For description editor error */
.description-editor.error {
  border-color: #ef4444 !important;
}

.description-editor .error-message {
  margin-top: 0.5rem;
}

/* For specs editor error */
.specs-editor.error {
  border-color: #ef4444 !important;
}

.specs-editor .error-message {
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .product-form {
    padding: 1rem;
    max-width: 100%;
  }

  .form-section {
    padding: 1rem;
  }

  input, select, textarea {
    width: 100%;
  }

  .select-with-add {
    flex-direction: column;
  }

  .add-option-btn {
    width: 100%;
    justify-content: center;
  }

  /* Spec Editor Mobile Styles */
  .specs-editor {
    padding: 1rem;
  }

  .spec-category {
    padding: 1rem;
  }

  .spec-item {
    flex-direction: column;
    align-items: stretch;
  }

  .spec-title, .spec-value {
    width: 90%;
  }

  .model-group {
    padding: 0.75rem;
  }

  /* Form Actions */
  .form-actions {
    flex-direction: column;
  }

  .save-btn, .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .desc-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .desc-action-btn, .desc-toggle-btn {
    width: 100%;
    justify-content: center;
  }

  .link-block {
    flex-direction: column;
  }

  .link-block input {
    width: 100%;
  }
}
</style>

