<template>
  <div class="floating-cart" @click="toggleCart">
    <Icon icon="mdi:cart" class="cart-icon" />
    <span class="cart-count">{{ cartStore.totalItems }}</span>
    
    <div v-if="isOpen" class="cart-dropdown" @click.stop>
      <div v-if="cartStore.items.length === 0" class="empty-cart">
        Your cart is empty
      </div>
      
      <div v-else>
        <div class="cart-items">
          <div v-for="item in cartStore.items" :key="item.product._id" class="cart-item">
            <div class="item-info">
              <h4>{{ item.product.product_name }}</h4>
              <p>{{ item.product.product_price }} € x {{ item.quantity }}</p>
            </div>
            <div class="item-actions">
              <button @click="decreaseQuantity(item.product._id)" class="quantity-btn">-</button>
              <input 
                type="number" 
                v-model.number="item.quantity" 
                min="1"
                @change="updateQuantity(item.product._id, item.quantity)"
                class="quantity-input"
              >
              <button @click="increaseQuantity(item.product._id)" class="quantity-btn">+</button>
              <button @click="removeItem(item.product._id)" class="remove-btn">
                <Icon icon="mdi:trash-can-outline" />
              </button>
            </div>
          </div>
        </div>
        
        <div class="cart-summary">
          <p>Total: {{ cartStore.totalPrice }} €</p>
          <button @click="proceedToCheckout" class="checkout-btn">
            Proceed to Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { Icon } from '@iconify/vue'

const cartStore = useCartStore()
const isOpen = ref(false)
const router = useRouter()

const toggleCart = () => {
  isOpen.value = !isOpen.value
}

const increaseQuantity = (productId) => {
  const item = cartStore.items.find(item => item.product._id === productId)
  if (item) {
    cartStore.updateQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId) => {
  const item = cartStore.items.find(item => item.product._id === productId)
  if (item && item.quantity > 1) {
    cartStore.updateQuantity(productId, item.quantity - 1)
  }
}

const updateQuantity = (productId, quantity) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeItem = (productId) => {
  cartStore.removeFromCart(productId)
}

const proceedToCheckout = () => {
  router.push({ name: 'Order' })
  isOpen.value = false
}
</script>

<style scoped>
.floating-cart {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #2F8F9D; /* Jungle Green */
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.floating-cart:hover {
  background-color: #247A8A; /* Slightly darker */}

.cart-icon {
  font-size: 24px;
}

.cart-count {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #4FC3F7; /* New eco-friendly badge color */
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}


.cart-dropdown {
  position: absolute;
  bottom: 65px;
  right: 20px;
  width: 360px;
  max-height: 500px;
  overflow-y: auto;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: #333;
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.empty-cart {
  text-align: center;
  padding: 30px 0;
  font-style: italic;
  color: #888;
}

.cart-items {
  margin-bottom: 15px;
}

.cart-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.item-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 500;
}

.item-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.item-actions {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.quantity-btn {
  background-color: #f0f0f0;
  border: none;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.quantity-btn:hover {
  background-color: #e0e0e0;
}

.quantity-input {
  width: 40px;
  text-align: center;
  margin: 0 6px;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
}

.remove-btn {
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  margin-left: auto;
  font-size: 18px;
}

.cart-summary {
  border-top: 1px solid #eee;
  padding-top: 15px;
  text-align: right;
}

.cart-summary p {
  font-weight: bold;
  margin: 0 0 10px 0;
  font-size: 16px;
}

.checkout-btn {
  background-color: #2F8F9D;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.checkout-btn:hover {
  background-color: #247A8A;
}
</style>