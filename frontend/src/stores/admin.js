import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const adminToken = ref(localStorage.getItem('admin_token') || null)

  // Reactive computed boolean for login status
  const isAuthenticated = computed(() => !!adminToken.value)

  function login(token) {
    adminToken.value = token
    localStorage.setItem('admin_token', token)
  }

  function logout() {
    adminToken.value = null
    localStorage.removeItem('admin_token')
  }

  return { adminToken, isAuthenticated, login, logout }
})
