<template>
  <section class="connect-section">
    <div class="cards">
      <!-- Email Card -->
      <a href="mailto:fces.maroc@gmail.com" class="card-link">
        <div class="card">
          <Icon icon="mdi:email-outline" class="icon" />
          <h3>Envoyez-nous un email</h3>
          <p>Notre équipe de support est prête à vous aider.</p>
          <p class="contact-detail">fces.maroc@gmail.com</p>
        </div>
      </a>

      <!-- Call Card -->
      <a href="https://wa.me/212702085182" target="_blank" rel="noopener" class="card-link">
        <div class="card">
          <Icon icon="mdi:phone-outline" class="icon" />
          <h3>Appelez-nous</h3>
          <p>Disponible du lundi au vendredi, de 8h à 17h.</p>
          <p class="contact-detail">0702-085182</p>
        </div>
      </a>

      <!-- Location Card (optional: could link to Google Maps) -->
      <a href="https://maps.app.goo.gl/6CijUZ3pxZ8vH4kN7" target="_blank" rel="noopener" class="card-link">
        <div class="card">
          <Icon icon="mdi:map-marker-outline" class="icon" />
          <h3>Visitez-nous</h3>
          <p>Venez nous rendre visite dans nos bureaux.</p>
          <p class="contact-detail">14 RUE BORDEAUX QUARTIER L'HÔPITAL, Safi, Maroc</p>
        </div>
      </a>
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

.connect-container {
  max-width: 1200px;
  margin: 0 auto;
}

.subtitle {
  color: #888;
  text-transform: uppercase;
  font-size: 14px;
  margin-bottom: 10px;
  letter-spacing: 1px;
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #111;
}

.description {
  color: #555;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card-link:hover .card {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 32px;
  color: #3b82f6;
  margin-bottom: 15px;
}

.card h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #222;
}

.card p {
  font-size: 14px;
  color: #444;
  margin-bottom: 6px;
  line-height: 1.5;
}

.email-link {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  margin-top: 5px;
  transition: all 0.2s ease;
}

.email-link:hover {
  text-decoration: underline;
  transform: scale(1.02);
}


.contact-detail {
  color: #444;
  font-weight: 500;
  margin-top: 10px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.card-link:hover .contact-detail {
  color: #3b82f6;
  transform: scale(1.03);
  text-decoration: underline;
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
  .connect-section {
    padding: 50px 20px;
  }
  
  .title {
    font-size: 28px;
  }
  
  .description {
    font-size: 15px;
    margin-bottom: 30px;
  }
}

@media (max-width: 768px) {
  .cards {
    gap: 15px;
  }
  
  .card {
    width: 100%;
    max-width: 350px;
    padding: 25px 20px;
  }
  
  .title {
    font-size: 26px;
  }
  
  .subtitle {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .connect-section {
    padding: 40px 15px;
  }
  
  .title {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .description {
    margin-bottom: 25px;
    padding: 0 10px;
  }
  
  .card {
    padding: 20px 15px;
  }
  
  .card h3 {
    font-size: 17px;
  }
  
  .contact-detail {
    font-size: 13px;
  }
  
  .email-link {
    font-size: 13px;
  }
}
</style>