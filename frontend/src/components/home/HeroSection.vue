<template>
    <section class="hero-section">
        <div class="container">
        <div class="left-section">
            <h1>
            VOTRE CONFORT,<br />
            NOTRE EXPERTISE EN ÉNERGIE
            </h1>
            <p>
            Chez FCES, nous sommes spécialisés dans les solutions de réfrigération, de climatisation et d’énergie solaire.
            Faites confiance à notre savoir-faire pour améliorer votre confort tout en respectant l’environnement.
            </p>
            <div class="buttons">
              <router-link :to="{ name: 'Services' }" tag="button" class="btn btn-primary">Découvrez</router-link>
              <router-link :to="{ name: 'Contact' }" tag="button" class="btn btn-secondary">Contactez</router-link>
            </div>
        </div>
        <div class="right-section">
            <img src="@/assets/imgs/hero.jpg" alt="People working together on laptop" />
        </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'; 
</script>

<style scoped>
.hero-section {
  height: calc(100vh - 50px); /* accounts for #App padding-top */
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 40px 0;
}

.left-section {
  flex: 1;
  padding-right: 40px;
}

.left-section h1 {
  font-size: 2.8em;
  font-family: "Aboreto", system-ui;
  font-weight: 400;
  margin-bottom: 20px;
  color: #111;
}

.left-section p {
  font-family: "Montserrat", sans-serif;
  font-weight: 400;
  color: #444;
  margin-bottom: 30px;
  max-width: 500px;
  line-height: 1.6;
}

.buttons {
  display: flex;
  gap: 18px;
}

.btn {
  padding: 14px 30px;
  font-size: 1em;
  border-radius: 10px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  transition: all 0.4s ease;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  text-decoration: none;
}

.btn:hover {
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  color: #000;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e4e8eb 0%, #f5f7fa 100%);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.btn-primary:hover::before {
  opacity: 1;
}

.btn-secondary {
  background: white;
  color: #333;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
}

.right-section img {
  max-width: 85%;
  border-radius: 12px;
  object-fit: cover;
}

</style>