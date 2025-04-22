<template>
  <div class="category-card" @click=handleClick>
    <img 
      :src="category.category_image_url" 
      :alt="category.category_name"
      class="category-image"
    >
    <div class="category-content">
      <h3>{{ category.category_name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import { useProductStore } from '@/stores/productStore'

// Access the `category` prop directly
const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const productStore = useProductStore()
const emit = defineEmits(['navigate'])

const handleClick = () => {
  // Use `props.category` to access the passed prop
  emit('navigate', props.category._id)
  productStore.setActiveCategory(props.category)
}
</script>

<style scoped>
.category-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
}

.category-content {
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}
</style>