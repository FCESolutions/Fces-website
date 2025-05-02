// src/stores/categoryStore.js
import { defineStore } from 'pinia'

export const useProductStore = defineStore('category', {
  state: () => ({
    activeCategory: null,
    activeSubcategory: null,
    activeSubsubcategory: null,
  }),

  actions: {
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId
      this.activeSubcategory = null
      this.activeSubsubcategory = null
    },
    resetActiveCategory() {
      this.activeCategory = null
    },

    setActiveSubcategory(subcategoryId) {
      this.activeSubcategory = subcategoryId
      this.activeSubsubcategory = null
    },
    resetActiveSubcategory() {
      this.activeSubcategory = null
    },

    setActiveSubsubcategory(subsubcategoryId) {
      this.activeSubsubcategory = subsubcategoryId
    },
    resetActiveSubsubcategory() {
      this.activeSubsubcategory = null
    },
    
    resetActiveStates() {
      this.activeCategory = null
      this.activeSubcategory = null
      this.activeSubsubcategory = null
    }
  }
})
