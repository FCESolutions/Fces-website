<template>
    <section>
      <div class="dropdowns">
        <select v-model="selectedCategory" class="dropdown">
          <option value="">Sélectionner une catégorie</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">
            {{ category.category_name }}
          </option>
        </select>

        <select 
          v-model="selectedSubcategory" 
          class="dropdown" 
          :disabled="!selectedCategory"
          v-if="filteredSubcategories.length > 0"
        >
          <option value="">Sélectionner une sous-catégorie</option>
          <option v-for="subcategory in filteredSubcategories" :key="subcategory._id" :value="subcategory._id">
            {{ subcategory.subcategory_name }}
          </option>
        </select>

        <select 
          v-model="selectedSubSubcategory" 
          class="dropdown" 
          :disabled="!selectedSubcategory"
          v-if="filteredSubSubcategories.length > 0"
        >
          <option value="">Sélectionner une sous-sous-catégorie</option>
          <option v-for="subsubcategory in filteredSubSubcategories" :key="subsubcategory._id" :value="subsubcategory._id">
            {{ subsubcategory.subsubcategory_name || subsubcategory.name }}
          </option>
        </select>
      </div>
    </section></template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    categories: Array,
    subcategories: Array,
    subsubcategories: Array
})
</script>

<style scoped> 

</style>