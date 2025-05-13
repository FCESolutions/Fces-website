<template>
  <div class="subcategory-card" @click="handleClick" role="button" tabindex="0">
    <img 
      :src="subcategory.subcategory_image_url" 
      :alt="subcategory.subcategory_name"
      class="subcategory-image"
      loading="lazy"
    >
    <div class="subcategory-content">
      <h3>{{ subcategory.subcategory_name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  subcategory: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const emit = defineEmits(['navigate'])

const handleClick = () => {
  emit('navigate', props.subcategory._id)
  productStore.setActiveSubcategory(props.subcategory._id)
}
</script>

<style scoped>
.subcategory-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
  position: relative;
}

.subcategory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #cbd5e0;
}

.subcategory-card:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.subcategory-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.subcategory-card:hover .subcategory-image {
  transform: scale(1.03);
}

.subcategory-content {
  padding: 1.25rem 1rem;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  transition: color 0.2s ease;
}

.subcategory-card:hover h3 {
  color: #1a365d;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .subcategory-image {
    height: 250px;
  }
  
  .subcategory-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .subcategory-card {
    border-radius: 0.4rem;
  }
  
  .subcategory-image {
    height: 220px;
  }
  
  h3 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .subcategory-image {
    height: 180px;
  }
  
  .subcategory-content {
    padding: 0.75rem;
  }
}

@media (max-width: 360px) {
  .subcategory-image {
    height: 150px;
  }
  
  h3 {
    font-size: 0.95rem;
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .subcategory-card,
  .subcategory-card:hover,
  .subcategory-image,
  .subcategory-card:hover .subcategory-image,
  h3,
  .subcategory-card:hover h3 {
    transition: none;
    transform: none !important;
  }
}
</style>