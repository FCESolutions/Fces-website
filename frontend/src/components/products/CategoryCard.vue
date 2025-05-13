<template>
  <div class="category-card" @click="handleClick">
    <img 
      :src="category.category_image_url" 
      :alt="category.category_name"
      class="category-image"
      loading="lazy"
    >
    <div class="category-content">
      <h3>{{ category.category_name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const emit = defineEmits(['navigate'])

const handleClick = () => {
  emit('navigate', props.category._id)
  productStore.setActiveCategory(props.category._id)
}
</script>

<style scoped>
.category-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: white;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-card:hover .category-image {
  transform: scale(1.02);
}

.category-content {
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  transition: color 0.2s ease;
}

.category-card:hover h3 {
  color: #1a365d;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .category-image {
    height: 260px;
  }
}

@media (max-width: 768px) {
  .category-card {
    border-radius: 0.4rem;
  }
  
  .category-image {
    height: 230px;
  }
  
  h3 {
    font-size: 1rem;
    padding: 0.5rem 0;
  }
}

@media (max-width: 480px) {
  .category-image {
    height: 190px;
  }
  
  .category-content {
    padding: 0.75rem;
  }
}

@media (max-width: 360px) {
  .category-image {
    height: 160px;
  }
  
  h3 {
    font-size: 0.95rem;
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .category-card,
  .category-card:hover,
  .category-image,
  .category-card:hover .category-image,
  h3,
  .category-card:hover h3 {
    transition: none;
    transform: none !important;
  }
}
</style>