<template>
  <div class="subcategory-card" @click=handleClick>
    <img 
      :src="subcategory.subcategory_image_url" 
      :alt="subcategory.subcategory_name"
      class="subcategory-image"
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
  transition: transform 0.2s, box-shadow 0.2s;
}

.subcategory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subcategory-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
}

.subcategory-content {
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}
</style>