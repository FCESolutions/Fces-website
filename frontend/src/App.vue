<template>
  <!-- Single root element -->
  <div id="app">
    <!-- TheNavbar will show on all pages -->
    <TheNavbar />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import TheNavbar from './components/TheNavbar.vue'


@Options({
  components: {
    TheNavbar
  }
})

export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-top: 50px; 
}
</style>
