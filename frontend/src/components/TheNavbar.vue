<template>
  <nav :class="['navbar', { scrolled: isScrolled }]">
    <div class="logo">
      <img :src="logoImg" alt="FCES MAROC Logo" class="logo-img" @click="handleLogoClick"/>
    </div>

    <div class="nav-links" :class="{ 'mobile-menu-open': isMenuOpen }">
      <router-link :to="{ name: 'Home' }" @click="closeMenu">Accueil</router-link>
      <router-link :to="{ name: 'Products' }" @click="closeMenu">Nos Produits</router-link>
      <router-link :to="{ name: 'Services' }" @click="closeMenu">Nos Services</router-link>
      <router-link :to="{ name: 'Projects' }" @click="closeMenu">Nos projets</router-link>
      <router-link :to="{ name: 'Contact' }" @click="closeMenu">Contactez-nous</router-link>
    </div>
      
    <div class="whatsapp-container desktop-only">
      <WhatsapButton class="whatsapp-btn" />
    </div>



    <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
      <span :class="['hamburger-line', { 'line-1-open': isMenuOpen }]"></span>
      <span :class="['hamburger-line', { 'line-2-open': isMenuOpen }]"></span>
      <span :class="['hamburger-line', { 'line-3-open': isMenuOpen }]"></span>
    </button>
  </nav>
</template>

<script setup>
import logoImg from '../assets/logo.jpg'
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

import WhatsapButton from './WhatsappButton.vue'

const router = useRouter()

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleLogoClick = () => {
  router.push({ name: 'Home' })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* Base Navbar Styles */
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

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 2100;
}

.logo-img {
  height: 58px;
  object-fit: contain;
  display: block;
  opacity: 0;
  transform: translateX(-15px);
  animation: logoSlideIn 0.7s ease-out 0.2s forwards;
}

@keyframes logoSlideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  transition: right 0.3s ease-in-out;
  z-index: 2000;
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
  background-color: #00AEEF;
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
  color: #00AEEF;
  position: relative;
}

.router-link-exact-active::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px; /* Slightly thicker */
  bottom: 0; /* Drop it below the text */
  left: 0;
  transform: scaleX(1) !important;
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}



/* Hamburger Menu - Hidden by default */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 2100;
}

.hamburger-line {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #00AEEF;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Hamburger Animation */
.line-1-open {
  transform: rotate(45deg) translate(6px, 6px);
}

.line-2-open {
  opacity: 0;
}

.line-3-open {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Responsive Styles */
@media (max-width: 992px) {
  .nav-links {
    gap: 1.8rem;
  }
  
  .nav-links a {
    font-size: 1rem;
  }
}

@media (max-width: 768px) {
  .whatsapp-container {
    display: none; /* Hide desktop version */
  }

  .nav-links.mobile-menu-open + .whatsapp-container {
    display: flex;
    position: fixed;
    bottom: 25px;
    right: 75px;
    z-index: 2100;
    animation: slideUpFadeIn 0.5s ease-out 0.3s both;
  }

  @keyframes slideUpFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .navbar {
    padding: 0 7%;
    height: 80px;
  }
  
  /* Hide regular nav links and show hamburger */
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 300px;
    height: 90vh;
    background-color: white;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2.5rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    padding: 80px 0;
    transition: right 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .nav-links.mobile-menu-open {
    right: 0;
  }
  
  .nav-links a {
    font-size: 1.2rem;
    padding: 0.5rem 1rem;
  }

  /* Explicitly reset any styles that might affect the button */
  .nav-links .whatsapp-btn,
  .nav-links .whatsapp-btn:hover {
    text-decoration: none !important;
    background: initial !important;
    color: initial !important;
    padding: initial !important;
    position: initial !important;
  }
  
  .nav-links .whatsapp-btn::before,
  .nav-links .whatsapp-btn:hover::before {
    content: none !important;
  }
  
  .hamburger {
    display: flex;
  }
  
  /* Adjust logo size on mobile */
  .logo-img {
    height: 48px;
  }
}

/* Ensure WhatsApp button stays visible when scrolled */
.navbar.scrolled .whatsapp-container {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 5%;
  }
  
  .nav-links {
    width: 80%;
  }
  
  .logo-img {
    height: 42px;
  }
}
</style>