<template>
  <div 
    class="product-card" 
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    role="button"
    tabindex="0"
  >
    <div class="image-container">
      <img 
        :src="product.product_image_url" 
        :alt="product.product_name"
        class="product-image"
        loading="lazy"
      >
    </div>
    <div class="product-content">
      <h3>{{ product.product_name }}</h3>
      <button 
        @click.stop="proceedToCheckout" 
        class="add-to-cart-btn"
        aria-label="Commander article"
      >
        Commander Article
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['navigate'])

const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

const handleClick = () => {
  emit('navigate', props.product)
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
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.product-card:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.03);
}

.product-content {
  padding: 1.25rem 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
}

.add-to-cart-btn {
  width: 100%;
  background-color: #2F8F9D;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  margin-top: 0.5rem;
}

.add-to-cart-btn:hover {
  background-color: #247A8A;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .product-image {
    height: 240px;
  }
  
  .product-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .product-card {
    border-radius: 0.6rem;
  }
  
  .product-image {
    height: 200px;
  }
  
  h3 {
    font-size: 1rem;
  }

  .add-to-cart-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .product-image {
    height: 180px;
  }
  
  .product-content {
    padding: 0.8rem;
  }
}

@media (max-width: 360px) {
  .product-image {
    height: 160px;
  }
  
  h3 {
    font-size: 0.95rem;
  }

  .add-to-cart-btn {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .product-card,
  .product-card:hover,
  .product-image,
  .product-card:hover .product-image {
    transition: none;
    transform: none !important;
  }
}
</style>