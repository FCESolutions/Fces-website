<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Your existing footer content -->
      <div class="footer-top">
        <div class="footer-left">
          <div class="logo">
            <p>Fces</p>
          </div>
          <nav class="footer-nav">
            <router-link :to="{ name: 'Contact' }">Contactez-nous</router-link>
            <router-link :to="{ name: 'Services' }">Nos Services</router-link>
            <router-link :to="{ name: 'Products' }">Nos Produits</router-link>
          </nav>
        </div>
        <div class="footer-cta">
          <h4>Froid, climatisation et énérgie solaire</h4>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="footer-links">
          <a href="#">Politique de confidentialité</a>
          <a href="#">Conditions de service</a>
          <a href="#">Paramètres des cookies</a>
        </div>
        <p class="copyright">© 2025 Fces. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #111;
  color: #fff;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 60px 0 30px;
  font-family: 'Inter', sans-serif;
  margin-top: auto; /* Pushes footer to bottom */
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid #333;
  padding-bottom: 40px;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Logo styles */
.logo p {
  font-family: "Marck Script", cursive;
  font-size: 2.9rem;
  font-weight: 500;
  color: #fff;
  letter-spacing: -0.8px;
  margin: 0;
  padding: 0;
  position: relative;
  display: inline-block;
}

.logo p::after {
  content: '•';
  font-size: 2.5rem;
  position: absolute;
  bottom: -0.34rem;
  right: -0.6rem;
  color: #7A8B74;
  opacity: 0.8;
}

/* Nav placed beneath the logo */
.footer-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin-top: 10px;
}

.footer-nav a {
  color: #fff;
  font-weight: 500;
  text-decoration: none;
}

.footer-nav a:hover {
  text-decoration: underline;
}

.footer-cta h4 {
  font-size: 16px;
  font-weight: 500;
  color: #ccc;
  max-width: 260px;
}

.footer-bottom {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #aaa;
}

.footer-links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.footer-links a {
  color: #aaa;
  text-decoration: none;
}

.footer-links a:hover {
  color: #fff;
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 30px;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .footer-nav {
    justify-content: flex-start;
  }
}
</style>