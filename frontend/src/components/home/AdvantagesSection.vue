<template>
    <section class="effectivite-section">
      <div class="effectivite-wrapper">
        <!-- Left: Text + Benefit Cards -->
        <div class="text-side">
          <div class="section-label-wrapper">
            <div class="section-label">Effectivité</div>
          </div>
          <div class="text-zone">
            <p><strong>DÉCOUVREZ LES AVANTAGES DE FCES DÈS AUJOURD'HUI</strong></p>
            <p>Choisir FCES, c’est opter pour des solutions énergétiques durables et rentables. Profitez d’une efficacité énergétique qui réduit vos factures tout en préservant l’environnement.</p>
          </div>


          <div class="benefits">
            <div class="benefit-card">
              <div class="card-icon">
                <Icon icon="carbon:energy-renewable" width="24" height="24" />
              </div>
              <h3>Économie d’énergie</h3>
              <p>Réduisez vos dépenses sans compromis sur le confort grâce à nos systèmes automatisés à haute efficacité.</p>
            </div>

            <div class="benefit-card">
              <div class="card-icon">
                <Icon icon="mdi:leaf" width="24" height="24" />
              </div>
              <h3>Durabilité écologique</h3>
              <p>Des installations responsables qui favorisent un avenir plus vert pour votre foyer comme pour la planète.</p>
            </div>
          </div>
        </div>

        <!-- Right: Image -->
        <div class="image-side">
          <img src="@/assets/imgs/advantagesSec.jpg" alt="Énergie verte" />
        </div>
      </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue';
</script>

<style scoped>
.effectivite-section {
  background: #fff;
  padding: 100px 40px;
}

.effectivite-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.section-label {
  font-family: "Montserrat", sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4b6e33;
  padding: 6px 16px 6px 36px;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  overflow: hidden;
}

.section-label::before {
  content: "";
  position: absolute;
  left: 12px;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(75, 110, 51, 0.3);
  border-radius: 50%;
  transform: translateY(-50%);
}

.section-label::after {
  content: "";
  position: absolute;
  left: 16px;
  top: 50%;
  width: 4px;
  height: 4px;
  background: #4b6e33;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: orbit 3s infinite linear;
  box-shadow: 0 0 2px rgba(75, 110, 51, 0.5);
}

@keyframes orbit {
  0% { transform: rotate(0deg) translateX(8px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(8px) rotate(-360deg); }
}

.text-zone h2 {
  font-family: "Aboreto", serif;
  font-size: 2.8rem;
  font-weight: 400;
  color: #111;
  margin-bottom: 20px;
  line-height: 1.4;
}

.text-zone p:first-child {
  font-family: "Aboreto", serif;
  font-size: 2.6rem;
  font-weight: 400;
  color: #111;
  margin-bottom: 12px;
}

.text-zone p:last-child {
  font-family: "Montserrat", sans-serif;
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 25px;
  line-height: 1.6;
}

.benefits {
  display: grid;
  gap: 25px;
}

.benefit-card {
  background: #fff;
  border-radius: 12px;
  padding: 15px 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4b6e33;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 50px;
  height: 50px;
  background: rgba(75, 110, 51, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  color: #4b6e33;
}

.benefit-card h3 {
  font-family: "Montserrat", sans-serif;
  font-size: 1.2rem;
  color: #222;
  margin-bottom: 12px;
  font-weight: 600;
}

.benefit-card p {
  font-family: "Montserrat", sans-serif;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.6;
}

.image-side img {
  max-width: 95%;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .effectivite-wrapper {
    grid-template-columns: 1fr;
  }

  .image-side {
    text-align: center;
  }
}
</style>