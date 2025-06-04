<template>
  <div class="product-details">
    <!-- Header Section -->
<div class="product-header">
  <h1 class="product-title">{{ product.product_name }}</h1>
  <div class="product-subtitle">
    <span class="product-price">Marque: {{ product.marque }}</span>
    <span class="product-stock-badge" :class="product.stock === 'En stock' ? 'in-stock' : 'out-of-stock'" v-if="product.stock > 0">
        <template v-if="product.stock > 0">
          {{ product.stock }} article disponible{{ product.stock > 1 ? 's' : '' }}
        </template>
    </span>
  </div>
</div>


    <!-- Main Content -->
    <div class="product-content">
      <!-- Image Gallery -->
      <div class="product-gallery">
        <img 
          :src="imageSrc" 
          :alt="product.product_name"
          class="main-image"
          loading="lazy"
          @error="handleImageError"
        >
        <button 
          @click.stop="proceedToCheckout" 
          class="add-to-cart-btn"
          aria-label="Commander article"
        >
           Commander Article <span v-if="product.stock == 0">- Disponible sur commande</span>
        </button>
      </div>

      <!-- Description & Specs Container -->
      <div class="product-info">
        <!-- Description -->
        <div class="product-description" v-if="product.description && product.description.length">
          <h2 class="section-title">Description du produit</h2>
          <div class="description-content">
            <template v-for="(descItem, index) in product.description" :key="index">
              <!-- Heading -->
              <h3 v-if="descItem.type === 'heading'" class="description-heading">
                {{ descItem.content }}
              </h3>
              
              <!-- Paragraph -->
              <p v-else-if="descItem.type === 'paragraph'" class="description-paragraph">
                {{ descItem.content }}
              </p>
              
              <!-- Bullet List -->
              <ul v-else-if="descItem.type === 'bullet_list'" class="description-list">
                <li v-for="(item, itemIndex) in descItem.items" :key="itemIndex" class="description-list-item">
                  {{ item }}
                </li>
              </ul>
            </template>
          </div>
        </div>

        <!-- Specifications -->
        <div class="product-specs" v-if="product.specifications && Object.keys(product.specifications).length">
          <h2 class="section-title">Spécifications techniques</h2>
          <div class="specs-container">
            <template v-for="(specGroup, groupName) in product.specifications" :key="groupName">
              <!-- Group Title -->
              <h3 v-if="groupName !== 'specs'" class="spec-section-header">{{ groupName }}</h3>
              
              <!-- For each specification group -->
              <div v-if="typeof specGroup === 'object' && !Array.isArray(specGroup)" class="spec-group">
                <template v-for="(value, specName) in specGroup" :key="specName">
                  <!-- SECTION HEADERS (empty values) -->
                  <div v-if="value === ''" class="spec-section-header">
                    {{ specName }}
                  </div>
                  
                  <!-- REGULAR SPEC ITEMS -->
                  <div v-else class="spec-item">
                    <span class="spec-name">{{ specName }}</span>   
                    <span class="spec-value">
                      <template v-if="typeof value === 'object'">
                        <div v-for="(variantVal, variantName) in value" :key="variantName" class="variant-spec">
                          <span class="variant-name">{{ variantName }}:</span>
                          <span class="variant-value">{{ variantVal }}</span>
                        </div>
                      </template>
                      <template v-else>
                        {{ value }}
                      </template>
                    </span>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>

      <!-- Downloads -->
      <div class="product-downloads" v-if="product.product_files && product.product_files.length">
        <h2 class="section-title">Documentation technique</h2>
        <div class="download-buttons">
          <a 
            v-for="(file, index) in product.product_files" 
            :key="index"
            :href="getSafeUrl(file.url)"
            target="_blank"
            class="download-btn"
          >
            <Icon icon="heroicons-outline:document-download" class="icon" />
            {{ file.label }}
          </a>
        </div>
      </div>

      <!-- External Links -->
      <div class="product-external-links" v-if="product.external_links && product.external_links.length">
        <h2 class="section-title">Liens externes</h2>
        <div class="external-link-buttons">
          <a 
            v-for="(link, index) in product.external_links" 
            :key="index"
            :href="getSafeUrl(link.url)"
            target="_blank"
            class="external-link-btn"
          >
            <Icon icon="heroicons-outline:link" class="icon" />
            {{ link.label }}
          </a>
        </div>
      </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import api from '@/api'
import { fullUrl } from '@/utils/url'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

// Image handling
const imageSrc = computed(() => {
  if (props.product.product_image_file?.fileId) {
    return api.getImageUrl(props.product.product_image_file.fileId)
  }
  return props.product.product_image_url
})

const handleImageError = (e) => {
  const img = e.target
  img.alt = 'Aucune image disponible pour ce produit.'
  img.src = ''  // Optionally set to a blank or error placeholder if needed
  console.warn('Aucune image disponible pour le produit:', props.product.product_name)
}

// Get the category store instance
const productStore = useProductStore()
productStore.setActiveCategory(props.product.category_id)
productStore.setActiveSubcategory(props.product.subcategory_id)
productStore.setActiveSubsubcategory(props.product.subsubcategory_id)

const getSafeUrl = (url) => {
  console.log('Original URL:', url);

  const result = url.startsWith('http://') || url.startsWith('https://') 
    ? url 
    : fullUrl(url);

  console.log('Final Safe URL:', result);

  return result;
}

const proceedToCheckout = (event) => {
  event.stopPropagation()
  cartStore.setProductToOrder(props.product)
  router.push({ 
    name: 'Order',
    query: { from: route.fullPath }
  
  })
}
</script>

<style scoped>
.product-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #2d3748;
}

.product-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1.5rem;
}

.product-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a202c;
  line-height: 1.3;
}

.product-subtitle {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  margin-top: 0.3rem;
}

.product-price {
  font-weight: 500;
  color: #2d3748;
}

.product-stock-badge {
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.in-stock {
  background-color: #def7ec;
  color: #03543f;
}

.out-of-stock {
  background-color: #ffe5e5;
  color: #9b2c2c;
}



.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.product-gallery {
  position: sticky;
  top: 1rem;
  align-self: start;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center children horizontally */
  gap: 1rem; /* Consistent spacing between elements */
}

.main-image {
  width: 100%;
  max-width: 500px;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn {
  width: 100%;
  max-width: 500px; /* Prevent button from being too wide */
  background-color: #2F8F9D;
  color: white;
  border: none;
  padding: 0.85rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn:hover {
  background-color: #247A8A;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.add-to-cart-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.add-to-cart-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 143, 157, 0.4);
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem;
  color: #1a202c;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.specs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.spec-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.8rem;
}

.spec-section-header {
  grid-column: 1 / -1;
  font-weight: 600;
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  padding: 0.5rem 0.8rem;
  background-color: #edf2f7;
  border-left: 4px solid #3182ce;
  color: #2c5282;
  border-radius: 4px;
}

.spec-item {
  display: flex;
  flex-direction: column;
  padding: 0.8rem;
  background: #f8fafc;
  border-radius: 0.4rem;
}

.spec-name {
  font-weight: 500;
  color: #4a5568;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
}

.spec-value {
  font-weight: 600;
  color: #1a202c;
}

.variant-spec {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.variant-name {
  font-weight: 500;
  color: #4a5568;
}

.description-heading {
  font-size: 1.2rem;
  margin: 1.5rem 0 0.5rem 0;
  color: #444;
}

.description-paragraph {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #555;
}

.description-list {
  margin: 0.5rem 0 1rem 1rem;
  padding-left: 1rem;
  line-height: 1.6;
}

.description-list-item {
  margin-bottom: 0.5rem;
}

.download-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: #3182ce;
  color: white;
  border-radius: 0.4rem;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #2c5282;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
}

.external-link-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
}

.external-link-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  background: #2f855a; /* green-ish tone to distinguish */
  color: white;
  border-radius: 0.4rem;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.external-link-btn:hover {
  background: #276749;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .product-content {
    gap: 1.5rem;
  }
  
  .main-image {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .product-details {
    padding: 1.5rem;
  }
  
  .product-content {
    grid-template-columns: 1fr;
  }
  
  .product-gallery {
    position: static;
    margin-bottom: 1.5rem;
  }

  .add-to-cart-btn {
    max-width: 100%;
    padding: 1rem;
    font-size: 1.05rem;
    white-space: normal; /* Allow text to wrap on mobile */
    flex-wrap: wrap; /* Allow the span to wrap properly */
    justify-content: center;
    text-align: center;
  }
  
  .product-title {
    font-size: 1.6rem;
  }
  
  .section-title {
    font-size: 1.3rem;
  }
  
  .spec-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .product-details {
    padding: 1rem;
  }
  
  .product-title {
    font-size: 1.4rem;
  }

  .add-to-cart-btn {
    padding: 0.9rem;
    font-size: 0.95rem;
    line-height: 1.4; /* Better line spacing for wrapped text */
  }
  
  .add-to-cart-btn span {
    display: inline-block; /* Make the span behave better when wrapped */
    width: 100%; /* Force it to take full width when it wraps */
    text-align: center;
  }
  
  .product-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .section-title {
    font-size: 1.2rem;
  }
  
  .description-heading {
    font-size: 1.1rem;
  }
  
  .download-buttons {
    flex-direction: column;
  }
  
  .download-btn {
    justify-content: center;
  }
}

@media (max-width: 360px) {
  .product-title {
    font-size: 1.3rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .spec-item, .spec-section-header {
    padding: 0.6rem;
  }
}
</style>