<template>
  <div class="hero-container">
    <div class="hero-bg"></div>
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1 class="hero-title">Nos Services</h1>
      <p class="hero-description">
        Solutions énergétiques durables et innovantes pour un avenir plus vert et plus propre
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Hero",
};
</script>

<style scoped>
.hero-container {
  position: relative;
  height: 50vh;
  background: linear-gradient(to right, #00aaff, #66cc66); /* eco-blue to eco-green */
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9');
  background-size: cover;
  background-position: center;
  mix-blend-mode: overlay;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.hero-content {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  padding: 0 1rem;
}

.hero-title {
  font-size: 2.5rem; /* For small screens */
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  animation: fade-in 1s ease-out;
}

.hero-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 40rem;
  animation: slide-up 1s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
