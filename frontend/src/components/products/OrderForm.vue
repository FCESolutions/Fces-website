<template>
  <div class="order-form-container">
    <h2>Order Information</h2>

    <div v-if="errors.length" class="error-messages">
        <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>
    
    <form @submit.prevent="submitOrder" class="order-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
          placeholder="Your full name"
        >
      </div>
      
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          required
          placeholder="Your email address"
        >
      </div>
      
      <div class="form-group">
        <label for="phone">Phone Number</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="formData.phone" 
          required
          placeholder="Your phone number"
        >
      </div>
      
      <!-- <div class="form-group">
        <label for="address">Delivery Address</label>
        <textarea 
          id="address" 
          v-model="formData.address" 
          required
          placeholder="Your complete delivery address"
        ></textarea>
      </div> -->
      
      <!-- <div class="form-group">
        <label for="notes">Additional Notes</label>
        <textarea 
          id="notes" 
          v-model="formData.notes" 
          placeholder="Any special instructions"
        ></textarea>
      </div> -->
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        <div v-for="item in cartStore.items" :key="item.product._id" class="order-item">
          <span>{{ item.product.product_name }} (x{{ item.quantity }})</span>
          <span>{{ item.product.product_price * item.quantity }} €</span>
        </div>
        <div class="order-total">
          <span>Total:</span>
          <span>{{ cartStore.totalPrice }} €</span>
        </div>
      </div>
      
      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? 'Placing Order...' : 'Place Order' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/api'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const cartStore = useCartStore()
const router = useRouter()

const errors = ref([])
const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})

const isSubmitting = ref(false)

const validateForm = () => {
  errors.value = []
  
  if (!formData.value.name.trim()) {
    errors.value.push('Name is required')
  }
  
  if (!formData.value.email.trim()) {
    errors.value.push('Email is required')
  } else if (!/^\S+@\S+\.\S+$/.test(formData.value.email)) {
    errors.value.push('Please enter a valid email')
  }
  
  if (!formData.value.phone.trim()) {
    errors.value.push('Phone number is required')
  }
  /*
  if (!formData.value.address.trim()) {
    errors.value.push('Address is required')
  }
  */
  
  return errors.value.length === 0
}

const submitOrder = async () => {
    if (!validateForm()) return
    isSubmitting.value = true
    
    try {
        const orderData = {
            customer: {
                name: formData.value.name,
                email: formData.value.email,
                phone: formData.value.phone,
                /*address: formData.value.address,
                notes: formData.value.notes || '' // Ensure notes is at least an empty string*/
            },
            items: cartStore.items.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.product_price || 0, 
                productName: item.product.product_name, // Required by schema
                productImage: item.product.product_image_url || null // Optional but good to include
            })),
            subtotal: cartStore.totalPrice || 0, 
            total: cartStore.totalPrice || 0, 
            status: 'pending',
            paymentStatus: 'pending'
        }
        console.log('Order Data:', orderData)
        await api.submitOrder(orderData)
        
        toast.success('Your order has been placed successfully!')
        cartStore.clearCart()
        router.push({ name: 'Home' })
    } catch (error) {
        console.error('Error submitting order:', error)
        toast.error('There was an error placing your order. Please try again.')
    } finally {
        isSubmitting.value = false
    }
}
</script>

<style scoped>
.order-form-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 30px;
  background-color: #f9fdfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.order-form {
  display: grid;
  gap: 20px;
}

h2 {
  color: #2F8F9D;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-weight: 600;
  color: #333;
}

input,
textarea {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2F8F9D;
  box-shadow: 0 0 0 2px rgba(47, 143, 157, 0.2);
}

textarea {
  min-height: 90px;
  resize: vertical;
}

.order-summary {
  border: 1px solid #e1e1e1;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
}

.order-summary h3 {
  margin-top: 0;
  font-size: 20px;
  color: #2F8F9D;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 15px;
  color: #444;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-top: 12px;
  margin-top: 10px;
  font-size: 17px;
  border-top: 1px solid #ccc;
}

.submit-btn {
  background-color: #2F8F9D;
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.submit-btn:hover {
  background-color: #26727f;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  background-color: #a0a0a0;
  cursor: not-allowed;
}

.error-messages {
  color: #c0392b;
  background-color: #fdecea;
  border: 1px solid #f5c6cb;
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.error-messages p {
  margin: 5px 0;
  font-size: 14px;
}


@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 700px) {
  .order-form {
    grid-template-columns: 1fr;
  }

  .submit-btn,
  .order-summary,
  textarea#address,
  textarea#notes,
  .error-messages {
    grid-column: span 1;
  }

  .order-form-container {
    padding: 25px 15px;
  }
}
</style>

