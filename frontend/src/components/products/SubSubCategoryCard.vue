<template>
  <div class="subsubcategory-card" @click=handleClick>
    <img 
      :src="subsubcategory.subsubcategory_image_url" 
      :alt="subsubcategory.subsubcategory_name"
      class="subsubcategory-image"
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
  emit('navigate', props.subsubcategory._id)
  productStore.setActiveSubsubcategory(props.subsubcategory)
}

</script>

<style scoped>
.subsubcategory-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.subsubcategory-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.subsubcategory-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
}

.subsubcategory-content {
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}
</style>