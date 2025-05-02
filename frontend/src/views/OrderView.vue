<template>
  <div class="order-view">
    <ReturnButton />
    <OrderForm />
  </div>
</template>

<script setup>
import ReturnButton from '@/components/ReturnButton.vue'
import OrderForm from '@/components/products/OrderForm.vue'
import { useCartStore } from '@/stores/cartStore'
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const cartStore = useCartStore()
const router = useRouter()

onBeforeMount(() => {
  if (cartStore.items.length === 0) {
    router.push({ name: 'Home' })
  }
})
</script>

<style scoped>
.order-view {
  max-width: 1700px;
  margin: 0 100px;
  padding: 20px;
}
</style>