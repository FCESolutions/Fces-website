import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
    // Load cart from localStorage if available
    const initialCart = JSON.parse(localStorage.getItem('cart')) || []
    const items = ref(initialCart)

    // Save to localStorage whenever cart changes
    watch(items, (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }, { deep: true })
  
    const addToCart = (product) => {
      const existingItem = items.value.find(item => item.product._id === product._id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        items.value.push({ 
          product, 
          quantity: 1,
          // Store only necessary product data for persistence
          productData: {
            _id: product._id,
            name: product.product_name,
            price: product.product_price,
            image: product.product_image_url
          }
        })
      }
    }
  
    const removeFromCart = (productId) => {
      items.value = items.value.filter(item => item.product._id !== productId)
    }
  
    const updateQuantity = (productId, newQuantity) => {
      const item = items.value.find(item => item.product._id === productId)
      if (item) {
        item.quantity = newQuantity > 0 ? newQuantity : 1
      }
    }
  
    const clearCart = () => {
      items.value = []
    }
  
    const totalItems = computed(() => {
      return items.value.reduce((sum, item) => sum + item.quantity, 0)
    })
  
    const totalPrice = computed(() => {
      return items.value.reduce((sum, item) => sum + (item.product.product_price * item.quantity), 0)
    })

    // Hydrate product data on load if needed
    const hydrateCart = (products) => {
      items.value = items.value.map(item => {
        const fullProduct = products.find(p => p._id === item.product._id)
        return {
          ...item,
          product: fullProduct || item.productData
        }
      })
    }
    
    return { items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, hydrateCart }
})