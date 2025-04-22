// src/stores/categoryStore.js
import { defineStore } from 'pinia'

export const useProductStore = defineStore('category', {
  state: () => ({
    activeCategory: null,
    activeSubcategory: null,
    activeSubsubcategory: null,
  }),

  actions: {
    setActiveCategory(category) {
      this.activeCategory = category._id
      this.activeSubcategory = null
      this.activeSubsubcategory = null
    },
    resetActiveCategory() {
      this.activeCategory = null
    },

    setActiveSubcategory(subcategory) {
      this.activeSubcategory = subcategory._id
      this.activeSubsubcategory = null
    },
    resetActiveSubcategory() {
      this.activeSubcategory = null
    },

    setActiveSubsubcategory(subsubcategory) {
      this.activeSubsubcategory = subsubcategory._id
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
