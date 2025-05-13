<template>
  <div id="app">
    <TheNavbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'
import Footer from './components/Footer.vue';
import TheNavbar from './components/TheNavbar.vue';

const router = useRouter()

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      router.push('admin/admin-access')
    }
  });
});
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 50px; 
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-wrapper {
  flex: 1; /* Fills space above footer */
}
</style>

