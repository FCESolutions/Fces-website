<template>
  <div class="category-card">
    <img 
      :src="category.category_image_url" 
      :alt="category.category_name"
      class="category-image"
    >
    <div class="category-content">
      <h3>{{ category.category_name }}</h3>
      <router-link 
        :to="`/categories/${category._id}`"
        class="view-products-btn"
      >
        View Products
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true
  }
})
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
  height: 180px;
  object-fit: cover;
}

.category-content {
  padding: 1rem;
}

h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.view-products-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #4299e1;
  color: white;
  text-decoration: none;
  border-radius: 0.25rem;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.view-products-btn:hover {
  background-color: #3182ce;
}
</style>