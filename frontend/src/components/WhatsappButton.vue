<template>
  <a
    :href="whatsappLink"
    target="_blank"
    rel="noopener noreferrer"
    class="whatsapp-button"
    aria-label="Contact us on WhatsApp"
  >
    <Icon icon="mdi:whatsapp" class="icon" />
    <span class="text default-text">WhatsApp</span>
  </a>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const phoneNumber = '212702085182'
const message = encodeURIComponent("Bonjour, je suis intéressé(e) par vos services. Pouvez-vous me fournir plus d'informations ?")
const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`
</script>

<style scoped>
.whatsapp-button {
  display: inline-flex;
  width: 110px;
  align-items: center;
  justify-content: start;
  gap: 0.1rem;
  padding: 0.75rem 1rem;
  background-color: rgba(37, 211, 102, 0.15); /* transparent soft green */
  border: 2px solid #25d366;
  color: #25d366;
  font-weight: 600;
  border-radius: 50px;
  text-decoration: none;
  transition: background-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon {
  font-size: 1.5rem;
  transition: transform 0.3s ease;
}

.text {
  transition: opacity 0.3s ease;
  white-space: nowrap;
  position: absolute;
  left: 38%;
  transform: translateX(-50%);
}

.default-text {
  opacity: 1;
  position: relative;
}

.whatsapp-button:hover {
  background-color: rgba(37, 211, 102, 0.2);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
  transform: translateY(-1px);
}

.whatsapp-button:hover .icon {
  transform: scale(1.1);
}

/* Mobile: no hover effect */
@media (max-width: 768px) {
  .text {
    position: relative;
    transform: none;
    left: auto;
  }

  .default-text {
    opacity: 1 !important;
  }

  .hover-text {
    display: none !important;
  }
}
</style>
