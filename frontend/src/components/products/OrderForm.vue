<template>
  <div class="order-form-container">
    <h2>Informations de commande</h2>

    <div v-if="errors.length" class="error-messages">
      <p v-for="error in errors" :key="error">{{ error }}</p>
    </div>

    <form @submit.prevent="submitOrder" class="order-form">
      <div class="form-group">
        <label for="name">Nom complet</label>
        <input 
          type="text" 
          id="name" 
          v-model="formData.name" 
          required
          placeholder="Votre nom complet"
        >
      </div>

      <div class="form-group">
        <label for="email">Email (optionnel)</label>
        <input 
          type="email" 
          id="email" 
          v-model="formData.email" 
          placeholder="Votre adresse email"
        >
      </div>

      <div class="form-group">
        <label for="phone">Numéro de téléphone</label>
        <input 
          type="tel" 
          id="phone" 
          v-model="formData.phone" 
          required
          placeholder="Votre numéro de téléphone"
        >
      </div>

      <div class="order-summary" v-if="product">
        <h3>Résumé de la commande</h3>
        <div class="order-item">
          <span>{{ product.product_name }}</span>
        </div>
      </div>

      <button type="submit" class="submit-btn" :disabled="isSubmitting">
        {{ isSubmitting ? 'Commande en cours...' : 'Passer la commande' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from '@/api'
import { useCartStore } from '@/stores/cartStore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const cartStore = useCartStore()
const router = useRouter()

const errors = ref([])
const isSubmitting = ref(false)

const product = computed(() => cartStore.currentProduct)

const formData = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: ''
})

const validateForm = () => {
  errors.value = []

  if (!formData.value.name.trim()) {
    errors.value.push('Le nom est requis')
  }

  if (formData.value.email && !/^\S+@\S+\.\S+$/.test(formData.value.email)) {
    errors.value.push('Veuillez entrer un email valide')
  }

  if (!formData.value.phone.trim()) {
    errors.value.push('Le numéro de téléphone est requis')
  }

  return errors.value.length === 0
}

const submitOrder = async () => {
  if (!validateForm() || !product.value) return
  isSubmitting.value = true

  try {
    const orderData = {
      customer: {
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone
      },
      items: [
        {
          productId: product.value._id,
          productName: product.value.product_name,
          productImage: product.value.product_image_url || null
        }
      ],
      status: 'En attente',
    }

    console.log('Order Data:', orderData)
    await api.submitOrder(orderData)

    toast.success('Votre commande a été placée avec succès !')
    cartStore.clear()
    router.push({ name: 'Home' })
  } catch (error) {
    console.error('Error submitting order:', error)
    toast.error('Une erreur est survenue lors de la commande. Veuillez réessayer')
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

