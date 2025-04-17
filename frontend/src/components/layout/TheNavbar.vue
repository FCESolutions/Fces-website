<template>
  <nav class="navbar">
    <router-link to="/" class="logo">
      <img 
        src="@/assets/logo.jpg" 
        alt="Cleanergy Logo" 
        class="logo-img"
      >
    </router-link>

    <div class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/products">Products</router-link>
      <router-link to="/about">About</router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar',
}
</script>

<style scoped>
/* Base Navbar Styles */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem; /* Reduced vertical padding */
    background-color: #fafafa;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    height: 80px; /* Fixed height for consistency */
    position: relative; /* Creates stacking context */
    z-index: 1000; /* Ensures navbar stays on top */
}

/* Logo Styles */
.logo {
  display: flex;
  align-items: center;
  height: 100%; /* Take full navbar height */
}

.logo-img {
  height: 100%; /* Image fills navbar height */
  width: auto; /* Maintain aspect ratio */
  object-fit: contain; /* Prevent distortion */
  padding: 10px 0; /* Optional: Add padding INSIDE the image if needed */
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem; /* Modern way to space links (replaces margins) */
}

.nav-links a {
  color: #333; /* Changed to dark for visibility on white bg */
  text-decoration: none;
  font-weight: 500;
  font-size: 1.3rem;
  padding: 0.5rem 0;
  position: relative;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #666; 
}

/* Active Route Styling */
.router-link-exact-active {
  color: #666;
}


</style>