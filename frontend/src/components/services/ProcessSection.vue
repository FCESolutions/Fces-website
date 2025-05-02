<template>
  <section class="process-section">
    <div class="background-overlay"></div>
    <div class="container">
      <div class="content">
        <h2 class="title">Notre processus</h2>
        <p class="subtitle">Une approche méthodique pour des résultats optimaux</p>

        <div class="steps">
          <div class="step" data-aos="fade-up" data-aos-delay="100">
            <div class="step-number eco-green">
              <span>1</span>
              <div class="step-connector"></div>
            </div>
            <div class="step-content">
              <h3 class="step-title">Consultation</h3>
              <p class="step-description">
                Évaluation gratuite de vos besoins et de votre site pour déterminer la meilleure solution.
              </p>
            </div>
          </div>

          <div class="step" data-aos="fade-up" data-aos-delay="200">
            <div class="step-number eco-blue">
              <span>2</span>
              <div class="step-connector"></div>
            </div>
            <div class="step-content">
              <h3 class="step-title">Conception</h3>
              <p class="step-description">
                Création d'un système sur mesure adapté à vos besoins énergétiques spécifiques.
              </p>
            </div>
          </div>

          <div class="step" data-aos="fade-up" data-aos-delay="300">
            <div class="step-number eco-yellow">
              <span>3</span>
              <div class="step-connector"></div>
            </div>
            <div class="step-content">
              <h3 class="step-title">Installation</h3>
              <p class="step-description">
                Installation professionnelle par nos techniciens certifiés avec un minimum de perturbation.
              </p>
            </div>
          </div>

          <div class="step" data-aos="fade-up" data-aos-delay="400">
            <div class="step-number eco-orange">
              <span>4</span>
            </div>
            <div class="step-content">
              <h3 class="step-title">Maintenance</h3>
              <p class="step-description">
                Service après-vente et maintenance régulière pour assurer une performance optimale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No JS needed for static layout
</script>

<style scoped>
.process-section {
  position: relative;
  padding: 5rem 0;
  overflow: hidden;
  background-color: #f8fafc;
}

.background-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(46,125,50,0.03) 0%, rgba(25,118,210,0.03) 100%);
  z-index: 0;
}

.container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  z-index: 1;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
}

.title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #1a365d;
}

.subtitle {
  font-size: 1.125rem;
  color: #4a5568;
  margin-bottom: 3rem;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  position: relative;
}

@media (min-width: 768px) {
  .steps {
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
  }
}

.step {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.step-number {
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
  margin-bottom: 1.5rem;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step-connector {
  position: absolute;
  width: 2rem;
  height: 0.25rem;
  background: #e2e8f0;
  right: -7rem;
  top: 50%;
  transform: translateY(-50%);
  display: none;
}

@media (min-width: 768px) {
  .step-connector {
    display: block;
  }
}

.step-content {
  padding: 0 1rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #2d3748;
}

.step-description {
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.6;
}

/* Color Themes */
.eco-green {
  background-color: #2E7D32;
  background: linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%);
}

.eco-blue {
  background-color: #1976D2;
  background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%);
}

.eco-yellow {
  background-color: #FFC107;
  background: linear-gradient(135deg, #FFC107 0%, #FFD54F 100%);
}

.eco-orange {
  background-color: #FF9800;
  background: linear-gradient(135deg, #FF9800 0%, #FFB74D 100%);
}

@media (max-width: 768px) {
  .process-section {
    padding: 3rem 0;
  }
  
  .title {
    font-size: 1.75rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
  
  .step-number {
    width: 3.5rem;
    height: 3.5rem;
    font-size: 1.25rem;
  }
}
</style>