<template>
  <nav :class="['navbar', { scrolled: isScrolled }]">
    <div class="logo">
      <p><span class="mark">F</span>ces</p>
    </div>


    <div class="nav-links">
      <router-link :to="{ name: 'Home' }">Home</router-link>
      <router-link :to="{ name: 'Products' }">Products</router-link>
      <router-link :to="{ name: 'About' }">About</router-link>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Ultra Minimal Transparent Navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5%;
    background: transparent;
    height: 100px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    transition: background 0.1s ease, box-shadow 0.3s ease;
}

.navbar.scrolled {
  background-color: white;
}


/* Logo with subtle depth */
.logo p {
  font-family: "Marck Script", cursive;
  font-size: 2.9rem;
  font-weight: 700;
  color: #1A1A1A;
  letter-spacing: -0.8px;
  margin: 0;
  padding: 0;
  position: relative;
  display: inline-block;
}

/* Capital F only */
.logo-mark {
  font-weight: 800;
  font-size: 2.9rem;
  letter-spacing: -1.5px;
  text-transform: uppercase;
  margin-right: 1px;
}

/* Dot at the bottom-right */
.logo p::after {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  bottom: -0.34rem;
  right: -0.6rem;
  color: #7A8B74; /* You can change this to #999 or any muted tone */
  opacity: 0.8;
}


.logo:hover {
  transform: scale(1.05);
}

/* Navigation Links - Floating Style */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.nav-links a {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease-out;
}

.nav-links a::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 1px;
  bottom: 0;
  left: 0;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.nav-links a:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

/* Active Route Styling */
.router-link-exact-active {
  font-weight: 600;
}

.router-link-exact-active::before {
  transform: scaleX(1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar {
    padding: 0 7%;
    height: 80px;
  }
  
  .logo p {
    font-size: 2rem;
  }
  
  .nav-links {
    gap: 1.8rem;
  }
  
  .nav-links a {
    font-size: 1rem;
  }
}
</style>