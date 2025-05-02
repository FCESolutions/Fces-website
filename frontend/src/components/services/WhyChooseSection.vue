<template>
  <section class="choose-us-section">
    <div class="container">
      <h2 class="title">Pourquoi choisir nos services d'énergie solaire?</h2>

      <div class="features-grid">
        <div class="feature-card eco-green" data-aos="fade-up" data-aos-delay="100">
          <h3 class="feature-title">Économies significatives</h3>
          <p class="feature-description">
            Réduisez jusqu'à 70% vos factures d'énergie grâce à nos solutions solaires optimisées et parfaitement dimensionnées.
          </p>
        </div>

        <div class="feature-card eco-blue" data-aos="fade-up" data-aos-delay="200">
          <h3 class="feature-title">Respect de l'environnement</h3>
          <p class="feature-description">
            Réduisez votre empreinte carbone de plusieurs tonnes par an tout en bénéficiant d'une énergie propre et renouvelable.
          </p>
        </div>

        <div class="feature-card eco-yellow" data-aos="fade-up" data-aos-delay="300">
          <h3 class="feature-title">Experts certifiés</h3>
          <p class="feature-description">
            Nos techniciens QUALI'PV garantissent une installation conforme aux normes et un rendement énergétique optimal.
          </p>
        </div>

        <div class="feature-card eco-orange" data-aos="fade-up" data-aos-delay="400">
          <h3 class="feature-title">Solutions sur mesure</h3>
          <p class="feature-description">
            Étude personnalisée de votre projet avec plusieurs options techniques adaptées à votre consommation et à votre habitat.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No special JS needed for this static section
</script>

<style scoped>
.choose-us-section {
  padding: 4rem 0;
  background-color: white;
}

.container {
  width: 100%;
  max-width: 1240px;
  padding: 0 2rem;
}

.title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #333;
  padding: 0 1rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.feature-card {
  padding: 2rem;
  border-radius: 0.5rem;
  background-color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%);
  transition: all 0.6s ease;
  z-index: 1;
}

.feature-card:hover::before {
  left: 100%;
}

.feature-card:hover {
  transform: translateY(-3px);
}

.feature-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.feature-description {
  font-size: 1rem;
  color: #555;
  position: relative;
  z-index: 2;
  line-height: 1.6;
}

/* Softened Title Colors */
.eco-green .feature-title { color: #4CAF50; } /* Softer green */
.eco-blue .feature-title { color: #2196F3; } /* Softer blue */
.eco-yellow .feature-title { color: #FFC107; } /* Kept original but less bright */
.eco-orange .feature-title { color: #FF9800; } /* Kept original but less bright */

/* Subtle hover backgrounds */
.eco-green:hover { background-color: rgba(76, 175, 80, 0.08); }
.eco-blue:hover { background-color: rgba(33, 150, 243, 0.08); }
.eco-yellow:hover { background-color: rgba(255, 193, 7, 0.08); }
.eco-orange:hover { background-color: rgba(255, 152, 0, 0.08); }


@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    padding: 0;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 1.75rem;
  }
}
</style>