<template>
  <div 
    class="subsubcategory-card" 
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
    role="button"
    tabindex="0"
  >
    <img 
      :src="subsubcategory.subsubcategory_image_url" 
      :alt="subsubcategory.subsubcategory_name"
      class="subsubcategory-image"
      loading="lazy"
    >
    <div class="subsubcategory-content">
      <h3>{{ subsubcategory.subsubcategory_name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { useProductStore } from '@/stores/productStore'

const props = defineProps({
  subsubcategory: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const emit = defineEmits(['navigate'])

const handleClick = () => {
  emit('navigate', props.subsubcategory)
  productStore.setActiveSubsubcategory(props.subsubcategory._id)
}
</script>

<style scoped>
.subsubcategory-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: white;
  cursor: pointer;
  position: relative;
}

.subsubcategory-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e0;
}

.subsubcategory-card:focus-visible {
  outline: 2px solid #4299e1;
  outline-offset: 2px;
}

.subsubcategory-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
  transition: transform 0.4s ease;
  will-change: transform;
}

.subsubcategory-card:hover .subsubcategory-image {
  transform: scale(1.05);
}

.subsubcategory-content {
  padding: 1.25rem 1rem;
  text-align: center;
  background: white;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
  font-weight: 600;
  transition: color 0.2s ease;
}

.subsubcategory-card:hover h3 {
  color: #1a365d;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .subsubcategory-image {
    height: 240px;
  }
  
  .subsubcategory-content {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .subsubcategory-card {
    border-radius: 0.4rem;
  }
  
  .subsubcategory-image {
    height: 200px;
  }
  
  h3 {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .subsubcategory-image {
    height: 160px;
  }
  
  .subsubcategory-content {
    padding: 0.8rem;
  }
}

@media (max-width: 360px) {
  .subsubcategory-image {
    height: 140px;
  }
  
  h3 {
    font-size: 0.95rem;
    padding: 0.25rem 0;
  }
}

/* Reduced motion accessibility */
@media (prefers-reduced-motion: reduce) {
  .subsubcategory-card,
  .subsubcategory-card:hover,
  .subsubcategory-image,
  .subsubcategory-card:hover .subsubcategory-image,
  h3,
  .subsubcategory-card:hover h3 {
    transition: none;
    transform: none !important;
  }
}
</style>