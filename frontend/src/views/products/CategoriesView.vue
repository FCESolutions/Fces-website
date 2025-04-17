<template>
  <div class="categories-container">
    <h1>Our Product Categories</h1>
    <div v-if="loading">Loading categories...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="categories-grid">
      <CategoryCard 
        v-for="category in categories" 
        :key="category._id" 
        :category="category" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import CategoryCard from '@/components/layout/CategoryCard.vue'

const categories = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const response = await api.getCategories()
    categories.value = response.data
  } catch (err) {
    error.value = 'Failed to load categories. Please try again later.'
    console.error('Error fetching categories:', err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.categories-container {
  padding: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}
</style>