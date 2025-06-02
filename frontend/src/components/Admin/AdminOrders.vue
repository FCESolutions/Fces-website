<template>
  <section class="orders-container">
    <div class="orders-header">
      <div class="header-content">
        <div class="header-title">
          <h2>Gestion des commandes</h2>
          <span class="order-count">{{ filteredOrders.length }} commande(s)</span>
        </div>

        <div class="controls">
          <div class="filter-control">
            <div class="select-wrapper">
              <label for="status-filter" class="sr-only">Filtrer par statut</label>
              <select
                id="status-filter"
                v-model="statusFilter"
                @change="filterOrders"
                class="styled-select"
              >
                <option value="all">Toutes les commandes</option>
                <option value="En attente">En attente</option>
                <option value="En cours de traitement">En cours de traitement</option>
                <option value="Livré">Livrée</option>
                <option value="Annulé">Annulée</option>
              </select>
              <div class="select-arrow"></div>
            </div>
          </div>

          <div class="search-control">
            <div class="search-wrapper">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Rechercher une commande..."
                @input="searchOrders"
                class="search-input"
              >
              <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="orders-grid">
      <div
        v-for="order in filteredOrders"
        :key="order._id"
        :id="`order-${order._id}`"
        class="order-card"
        :class="[order.status]"
      >
        <div class="order-header">
          <div class="order-meta">
            <span class="order-date">{{ formatDate(order.createdAt) }}</span>
            <h3>Commande n°{{ order.orderNumber }}</h3>
          </div>
          <!-- Remove button with red icon -->
          <button class="remove-btn no-print" @click="confirmRemove(order)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div class="status-ribbon no-print">
          <div class="status-group">
            <span class="status-label">Statut :</span>
            <span class="status-badge" :class="formatOrderClass(order.status)">
              {{ order.status || 'Non défini' }}
            </span>
          </div>
        </div>

        <div class="customer-info">
          <div class="customer-details">
            <h4>{{ order.customer.name }}</h4>
            <p>{{ order.customer.email }}</p>
            <p>{{ order.customer.phone }}</p>
          </div>
        </div>

        <div class="order-product">
          <img
            :src="getProductImageSrc(order.items[0])"
            :alt="order.items[0].productName"
            class="product-image"
            @error="handleImageError"
          >
          <p class="product-name">{{ order.items[0].productName }}</p>
        </div>

        <div class="order-footer no-print">
          <div class="order-actions">
            <div class="dropdown-control">
              <label for="orderStatus" class="sr-only">Statut</label>
              <select
                v-model="order.status"
                @change="updateStatus(order)"
                class="styled-select"
              >
                <option disabled value="">Modifier le statut</option>
                <option v-for="status in orderStatusOptions" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
              <button class="action-btn print-btn" @click="printOrder(order)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Imprimer
              </button>
          </div>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="no-orders">
        <p>Aucune commande ne correspond à vos critères.</p>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Confirmation de suppression</h3>
        <p>Êtes-vous sûr de vouloir supprimer cette commande ?</p>
        <div class="modal-actions">
          <button class="confirm-btn" @click="removeOrder(confirmedOrder)">Oui, supprimer</button>
          <button class="cancel-btn" @click="cancelRemove">Annuler</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast" :class="toastClass">
      <p>{{ toastMessage }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/api'

const props = defineProps({ 
  orders: Array 
})
const emit = defineEmits(['orderRemoved'])

const statusFilter = ref('all')
const searchQuery = ref('')
const showModal = ref(false)
const confirmedOrder = ref(null)
const toastMessage = ref('')
const toastClass = ref('')

console.log('props.orders:', props.orders.value);


const orderStatusOptions = [
  'En attente',
  'En cours de traitement',
  'Livré',
  'Annulé'
]

const formatDate = (isoDate) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(isoDate).toLocaleDateString('fr-FR', options)
}

const filteredOrders = computed(() => {
  return props.orders.filter(order => {
    const matchesStatus = statusFilter.value === 'all' || order.status === statusFilter.value
    const query = searchQuery.value.toLowerCase()
    const matchesQuery = !query || [
      order.orderNumber.toString(),
      order.customer.name.toLowerCase(),
      order.customer.email.toLowerCase(),
      order.customer.phone,
      ...order.items.map(i => i.productName.toLowerCase())
    ].some(field => field.includes(query))

    return matchesStatus && matchesQuery
  })
})

const updateStatus = async (order) => {
  try {
    await api.updateOrderStatus(order._id, order.status)
  } catch (err) {
    console.error('Failed to update status', err)
  }
}

const formatOrderClass = (status) => {
  switch (status) {
    case 'En attente': return 'status-pending'
    case 'En cours de traitement': return 'status-processing'
    case 'Livré': return 'status-delivered'
    case 'Annulé': return 'status-cancelled'
    default: return ''
  }
}

const getProductImageSrc = (item) => {
  let url = '';
  if (item.productImageFile?.fileId) {
    url = api.getImageUrl(item.productImageFile.fileId);
  } else {
    url = item.productImage || '';
  }
  console.log('Image URL:', url);
  return url;
}

const handleImageError = (e) => {
  const img = e.target
  img.alt = 'Aucune image disponible pour ce produit.'
  img.src = ''
}

// Open confirmation modal
const confirmRemove = (order) => {
  confirmedOrder.value = order
  showModal.value = true
  console.log(order._id)
}

// Remove order after confirmation
const removeOrder = async (order) => {
  try {
    await api.deleteOrder(order._id)
    // Remove from list
    emit('orderRemoved', order._id)
    
    showModal.value = false
    toastMessage.value = 'Commande supprimée avec succès!'
    toastClass.value = 'success-toast'
    setTimeout(() => toastMessage.value = '', 3000)
  } catch (err) {
    showModal.value = false
    toastMessage.value = 'Erreur lors de la suppression de la commande.'
    toastClass.value = 'error-toast'
    setTimeout(() => toastMessage.value = '', 3000)
  }
}

// Cancel removal
const cancelRemove = () => {
  showModal.value = false
}

const printOrder = (order) => {
  const orderElement = document.getElementById(`order-${order._id}`);
  if (!orderElement) return;

  const cloned = orderElement.cloneNode(true);
  cloned.querySelectorAll('.no-print').forEach(el => el.remove());

  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  printWindow.document.open();
  printWindow.document.write(`
    <html>
      <head>
        <title>Commande #${order.orderNumber}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
        </style>
      </head>
      <body>${cloned.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();

  // Wait for a short delay to ensure content is rendered
  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Wait for content to be visually ready
  printWindow.onload = () => {
    // Ensure rendering is complete
    setTimeout(triggerPrint, 300);
  };
};

</script>

<style scoped>
.orders-container {
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

.orders-header {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  /* Sticky styles */
  position: sticky;
  top: 145px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}


.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-title {
  display: flex;
  align-items: baseline;
  gap: 1rem;
}

.header-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.order-count {
  font-size: 0.9rem;
  color: #718096;
  background: #f7fafc;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.controls {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.select-wrapper {
  position: relative;
  min-width: 160px;
}

.styled-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background-color: white;
  font-size: 0.95rem;
  color: #4a5568;
  appearance: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.styled-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.select-arrow {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #718096;
  pointer-events: none;
}

.search-wrapper {
  position: relative;
  min-width: 140px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-input {
  width: 73%;
  padding: 0.75rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #4a5568;
  padding-left: 2.5rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.clear-search {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  color: #718096;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.order-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  padding-bottom: 5.5rem; /* Make space for fixed footer */
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

/* Order Number Styling - Subtle yet clear */
.order-meta h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  color: #555;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-meta h3::before {
  font-weight: 400;
  color: #999;
}

.order-date {
  position: relative;
  top: 0;
  right: 0;
  font-size: 0.7rem;
  color: #999;
}

/* Remove button with red icon */
.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #e74c3c; /* Red icon */
  transition: color 0.2s ease;
}

.remove-btn:hover {
  color: #c0392b;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
}

.confirm-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

/* Toast notification */
.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 1rem;
  border-radius: 5px;
  opacity: 0.9;
  transition: opacity 0.5s ease;
}

.success-toast {
  background-color: #2ecc71;
}

.error-toast {
  background-color: #e74c3c;
}


/* Status Ribbon Styles */
.status-ribbon {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

/* Enhanced Badge Styles */
.status-badge {
  padding: 0.25rem 0.4rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  color: white;
  display: inline-block;
  min-width: 95px;
  text-align: center;
}

/* ORDER STATUS COLORS */
.status-pending {
  background-color: #ecc94b; /* yellow */
}

.status-processing {
  background-color: #4299e1; /* blue */
}

.status-delivered {
  background-color: #48bb78; /* green */
}

.status-cancelled {
  background-color: #f56565; /* red */
}

/* Customer Info */
.customer-info {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.customer-details h4 {
  margin: 0 0 0.25rem;
}

.customer-details p {
  font-size: 0.9rem;
  color: #666;
}

/* Order product */
.order-product {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  background: #f7fafc;
  padding: 1rem;
  border-radius: 8px;
}

.product-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
}

.product-name {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}


.order-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: white;
  border-top: 1px solid rgba(0,0,0,0.08);
  border-radius: 0 0 8px 8px;
}

.order-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
}

.dropdown-control {
  flex: 1 1 48%;
  margin-right: 1%;
}

.dropdown-control label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dropdown-control select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: #fff;
  color: #2d3748;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg fill='%23666' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.dropdown-control select:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.print-btn {
  color: #4361ee;
  border-color: #4361ee;
}

.print-btn:hover {
  background-color: #4361ee;
  color: white;
}

.print-btn svg {
  width: 1em;
  height: 1em;
}

.no-orders {
  text-align: center;
  color: #777;
  font-style: italic;
  margin-top: 2rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .header-content {
        flex-direction: column;
        align-items: stretch;
    }
    
    .controls {
        flex-direction: column;
    }
    
    .select-wrapper,
    .search-wrapper {
        width: 100%;
    }

    .items-list {
        max-height: calc(2 * (60px + 1rem)); /* Slightly taller on mobile */
    }
    
    .item {
        height: 60px;
    }

    .order-card {
        padding-bottom: 6rem; /* Slightly more space on mobile */
    }
    
    .order-actions {
        flex-direction: column;
    }
    
    .action-group {
        width: 100%;
    }
    
    .dropdown-control {
        min-width: 100%;
    }
    
    .action-btn {
        width: 100%;
        justify-content: center;
        margin-top: 0.5rem;
    }

    .dropdown-control {
        flex: 1 1 100%;
        margin-right: 0;
        margin-bottom: 0.5rem;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
}
</style>
