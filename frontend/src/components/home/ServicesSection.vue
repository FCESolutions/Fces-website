<template>
    <section class="services-section">
      <h2 class="section-title">
        DÉCOUVREZ NOS SERVICES DE<br />
        RÉFRIGÉRATION, CLIMATISATION ET<br />
        ÉNERGIE SOLAIRE.
      </h2>

      <div class="services-grid">
        <div class="service-card">
          <div class="icon-wrapper">
            <Icon icon="ph:snowflake-light" width="32" height="32" />
          </div>
          <h3>DES SOLUTIONS ADAPTÉES À VOS<br />BESOINS EN CONFORT THERMIQUE.</h3>
          <p>Nous offrons des systèmes de réfrigération efficaces pour vos espaces commerciaux.</p>
          <router-link :to="{ name: 'Services' }" class="link-arrow">
              En savoir plus
          </router-link>
        </div>

        <div class="service-card">
          <div class="icon-wrapper">
            <Icon icon="carbon:humidity" width="32" height="32" />
          </div>
          <h3>CLIMATISATION : LE CONFORT À<br />PORTÉE DE MAIN TOUT AU LONG DE L'ANNÉE.</h3>
          <p>Nos solutions de climatisation garantissent une ambiance agréable, quelle que soit la saison.</p>
          <router-link :to="{ name: 'Services' }" class="link-arrow">
              En savoir plus
          </router-link>
        </div>

        <div class="service-card">
          <div class="icon-wrapper">
            <Icon icon="line-md:sun-rising-twotone-loop" width="32" height="32" />
          </div>
          <h3>ÉNERGIE SOLAIRE : UNE<br />ALTERNATIVE DURABLE ET ÉCONOMIQUE POUR VOTRE CONSOMMATION.</h3>
          <p>Adoptez l'énergie solaire pour réduire vos factures et protéger l'environnement.</p>
          <router-link :to="{ name: 'Services' }" class="link-arrow">
              En savoir plus
          </router-link>
        </div>
      </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style scoped>
.services-section {
  padding: 80px 40px;
  text-align: center;
  background-color: #f8f8f8;
}

.section-title {
  font-family: "Aboreto", serif;
  font-size: 1.8rem;
  font-weight: 400;
  color: #111;
  margin-bottom: 60px;
  line-height: 1.4;
}

.services-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.service-card {
  flex: 1 1 280px;
  max-width: 320px;
  padding: 30px 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  text-align: left;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
  font-size: 2rem;
  color: #000;
  margin-bottom: 20px;
}

.service-card h3 {
  font-family: "Montserrat", sans-serif;
  font-size: 1.05rem;
  color: #111;
  margin-bottom: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.service-card p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 18px;
  line-height: 1.6;
}

.link-arrow {
  font-weight: 500;
  font-size: 0.9rem;
  color: #000;
  text-decoration: none;
  position: relative;
  padding-right: 20px;
  transition: color 0.3s ease;
  display: inline-block;
}

.link-arrow::after {
  content: "→";
  position: absolute;
  right: 0;
  top: 0;
  transition: transform 0.3s ease;
}

.link-arrow:hover {
  color: #444;
}

.link-arrow:hover::after {
  transform: translateX(4px);
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .services-section {
    padding: 70px 30px;
  }
  
  .section-title {
    font-size: 1.6rem;
    margin-bottom: 50px;
  }
  
  .services-grid {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .services-section {
    padding: 60px 20px;
  }
  
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 40px;
  }
  
  .services-grid {
    gap: 25px;
  }
  
  .service-card {
    flex: 1 1 100%;
    max-width: 400px;
  }
  
  .service-card h3 {
    font-size: 1rem;
  }
  
  .service-card p {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .services-section {
    padding: 50px 15px;
  }
  
  .section-title {
    font-size: 1.3rem;
    margin-bottom: 30px;
    line-height: 1.3;
  }
  
  .services-grid {
    gap: 20px;
  }
  
  .service-card {
    padding: 25px 20px;
  }
  
  .icon-wrapper {
    margin-bottom: 15px;
  }
  
  .link-arrow {
    font-size: 0.85rem;
  }
}

@media (max-width: 360px) {
  .section-title {
    font-size: 1.2rem;
  }
  
  .service-card h3 {
    font-size: 0.95rem;
  }
}
</style>