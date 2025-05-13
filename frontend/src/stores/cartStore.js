import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const currentProduct = ref(null)

  const setProductToOrder = (product) => {
    currentProduct.value = product
  }

  const clear = () => {
    currentProduct.value = null
  }

  return {
    currentProduct,
    setProductToOrder,
    clear
  }
})
