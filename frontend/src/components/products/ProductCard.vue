<template>
  <div class="product-card" @click=handleClick>
    <img 
      :src="product.product_image_url" 
      :alt="product.product_name"
      class="product-image"
    >
    <div class="product-content">
      <h3>{{ product.product_name }}</h3>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['navigate'])

const handleClick = () => {
  emit('navigate', props.product._id)
}

</script>

<style scoped>
.product-card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  height: 290px;
  object-fit: cover;
}

.product-content {
  padding: 1rem;
  text-align: center;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}
</style>