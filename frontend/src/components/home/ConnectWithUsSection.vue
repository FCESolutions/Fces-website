<template>
  <section class="connect-section">
    <h4 class="subtitle">Contactez-nous</h4>
    <h2 class="title">Contactez notre équipe</h2>
    <p class="description">Nous sommes là pour vous aider avec toutes vos questions.</p>

    <div class="cards">
      <!-- Email -->
      <div class="card">
        <Icon icon="mdi:email-outline" class="icon" />
        <h3>Envoyez-nous un email</h3>
        <p>Notre équipe de support est prête à vous aider.</p>
        <a class="email-link" href="mailto:contact@fces.com">fces.maroc@gmail.com</a>
      </div>

      <!-- Call -->
      <div class="card">
        <Icon icon="mdi:phone-outline" class="icon" />
        <h3>Appelez-nous</h3>
        <p>Disponible du lundi au vendredi, de 8h à 17h.</p>
        <p class="contact-detail">+212 614-116655</p>
      </div>

      <!-- Visit Us -->
      <div class="card">
        <Icon icon="mdi:map-marker-outline" class="icon" />
        <h3>Visitez-nous</h3>
        <p>Venez nous rendre visite dans nos bureaux.</p>
        <p class="contact-detail">14 RUE BORDEAUX QUARTIER L’HÔPITAL , Safi, Maroc</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style scoped>
.connect-section {
  text-align: center;
  padding: 60px 20px;
  background: #fff;
}

.subtitle {
  color: #888;
  text-transform: uppercase;
  font-size: 14px;
  margin-bottom: 10px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  color: #555;
  margin-bottom: 40px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background: #f9f9ff;
  border-radius: 12px;
  padding: 30px 20px;
  width: 260px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.icon {
  font-size: 32px;
  color: #3b82f6; /* light blue */
  margin-bottom: 15px;
}

.card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.card p {
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
}

.email-link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.contact-detail {
  color: #333;
  font-weight: 500;
}
</style>
