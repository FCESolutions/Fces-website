<template>
  <AdminLogin v-if="!isAuthenticated" @loginSuccess="handleLoginSuccess" />
  <!-- add v-eslse when you uncomment the login -->
  <div v-else class="admin-dashboard">
    <!-- Tabs -->
    <div class="tabs">
      <button 
        :class="{ active: currentTab === 'orders' }" 
        @click="currentTab = 'orders'"
      >
        Commandes
      </button>
      <button 
        :class="{ active: currentTab === 'stock' }" 
        @click="currentTab = 'stock'"
      >
        Gestion de stock
      </button>
      <button 
        :class="{ active: currentTab === 'projects' }" 
        @click="currentTab = 'projects'"
      >
        Nos Projets
      </button>
    </div>

    <!-- Active Component -->
    <div class="tab-content">
      <AdminOrders 
        v-if="currentTab === 'orders'" 
        :orders="orders" 
        @orderRemoved="handleOrderRemoved" 
      />

      <AdminStockManager 
        v-if="currentTab === 'stock'" 
      />

      <AdminProjectsControl 
        v-if="currentTab === 'projects'" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminLogin from '../components/Admin/AdminLogin.vue'
import AdminOrders from '../components/Admin/AdminOrders.vue'
import AdminStockManager from '../components/Admin/products/StockManager.vue'
import AdminProjectsControl from '../components/Admin/AdminProjectsControl.vue'

const isAuthenticated = ref(false)
const orders = ref([])
const currentTab = ref('orders') // default tab

const handleLoginSuccess = (data) => {
  orders.value = data
  isAuthenticated.value = true
}

const handleOrderRemoved = (id) => {
  orders.value = orders.value.filter(o => o._id !== id)
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.tabs button {
  padding: 0.7rem 1.5rem;
  background: #f2f2f2;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.tabs button.active {
  background: #2F8F9D;
  color: white;
  transform: scale(1.05);
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
