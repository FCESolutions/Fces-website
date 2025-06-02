<template>
  <AdminLogin v-if="!isAuthenticated" @loginSuccess="handleLoginSuccess" />
  <!-- add v-else when you uncomment the login -->
  <div v-else class="admin-dashboard">
    <!-- Tabs -->
    <div class="tabs-container">
      <div class="tabs">
        <button 
          :class="{ active: currentTab === 'orders' }" 
          @click="currentTab = 'orders'"
        >
          Commandes
        </button>
        <button 
          :class="{ active: currentTab === 'product' }" 
          @click="currentTab = 'product'"
        >
          Produits
        </button>
        <button 
          :class="{ active: currentTab === 'projects' }" 
          @click="currentTab = 'projects'"
        >
          Projets
        </button>
      </div>
      <div class="tab-indicator" :style="indicatorStyle"></div>
    </div>

    <!-- Active Component -->
    <div class="tab-content">
      <AdminOrders 
        v-if="currentTab === 'orders'" 
        :orders="orders" 
        @orderRemoved="handleOrderRemoved" 
      />

      <AdminProductManager 
        v-if="currentTab === 'product'" 
      />

      <AdminProjectsControl 
        v-if="currentTab === 'projects'" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '../api'
import { useAdminStore } from '@/stores/admin' 
import AdminLogin from '../components/Admin/AdminLogin.vue'
import AdminOrders from '../components/Admin/AdminOrders.vue'
import AdminProductManager from '../components/Admin/products/ProductManager.vue'
import AdminProjectsControl from '../components/Admin/AdminProjectsControl.vue'

const adminStore = useAdminStore()

const isAuthenticated = computed(() => adminStore.isAuthenticated)
const orders = ref([])
const currentTab = ref('orders') // default tab

// Compute indicator position based on active tab
const indicatorStyle = computed(() => {
  const index = ['orders', 'product', 'projects'].indexOf(currentTab.value)
  return {
    transform: `translateX(${index * 100}%)`
  }
})

const handleLoginSuccess = async ({ token }) => {
  adminStore.login(token)

  // fetch orders now
  try {
    const ordersResponse = await api.getOrders()
    orders.value = ordersResponse.data
  } catch (err) {
    console.error('Failed to fetch orders after login', err)
    orders.value = []
  }
}

const handleOrderRemoved = (id) => {
  orders.value = orders.value.filter(o => o._id !== id)
}

if (isAuthenticated.value) {
  api.getOrders().then(res => {
    orders.value = res.data
  }).catch(() => {
    orders.value = []
  })
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.tabs-container {
  position: sticky;
  top: 85px;
  bottom: 10px;
  background: #f5f5f5; /* same as tabs background, to cover content behind */
  margin-bottom: 1rem;
  z-index: 2000; /* make sure it stays on top */
  padding: 0.5rem 0; /* optional, add some vertical padding */
  border-radius: 12px 12px 0 0; /* keep rounded corners only on top */
}

.tabs {
  display: flex;
  gap: 0;
  background: #f5f5f5;
  border-radius: 12px;
  padding: 4px;
  position: relative;
}

.tabs button {
  flex: 1;
  padding: 0.8rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  color: #555;
}

.tabs button.active {
  color: #2F8F9D;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  height: calc(100% - 8px);
  width: calc(33.333% - 8px);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .tabs-container {
    top: 70px; /* Adjusted sticky position for mobile */
    margin-bottom: 1rem;
  }
  
  .tabs {
    padding: 3px;
  }
  
  .tabs button {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
    min-width: 100px;
  }
  
  .tab-indicator {
    width: calc(33.333% - 6px);
    height: calc(100% - 6px);
    top: 3px;
    left: 3px;
  }
}

@media (max-width: 480px) {
  .tabs-container {
    top: 60px; /* Further adjustment for very small screens */
    border-radius: 0;
    margin-left: -1rem;
    margin-right: -1rem;
    width: calc(100% + 2rem);
  }
  
  .tabs {
    border-radius: 0;
    padding: 2px;
  }
  
  .tabs button {
    padding: 0.6rem 0.5rem;
    font-size: 0.85rem;
    min-width: 90px;
  }
  
  /* Adjust indicator for very small screens */
  .tab-indicator {
    width: calc(33.333% - 4px);
    height: calc(100% - 4px);
    top: 2px;
    left: 2px;
  }
}

/* Smooth transitions for sticky elements */
.tabs-container {
  transition: top 0.3s ease;
}
</style>