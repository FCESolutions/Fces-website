import { defineStore } from 'pinia'
import axios from 'axios'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false
  }),
  actions: {
    async fetchCategories() {
      this.loading = true
      try {
        const response = await axios.get('/api/categories')
        this.categories = response.data
      } finally {
        this.loading = false
      }
    }
  }
})