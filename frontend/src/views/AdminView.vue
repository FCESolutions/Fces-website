<template>
    <AdminLogin v-if="!isAuthenticated" @loginSuccess="handleLoginSuccess" />
    <AdminOrders v-else :orders="orders" @orderRemoved="handleOrderRemoved" />
</template>

<script setup>
import AdminLogin from '../components/Admin/AdminLogin.vue';
import AdminOrders from '../components/Admin/AdminOrders.vue';
import { ref } from 'vue';

const isAuthenticated = ref(false);
const orders = ref([]);

const handleLoginSuccess = (data) => {
  orders.value = data
  isAuthenticated.value = true
}

const handleOrderRemoved = (id) => {
  orders.value = orders.value.filter(o => o._id !== id)
}
</script>

<style>

</style>