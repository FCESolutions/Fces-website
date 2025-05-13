<template>
  <section class="header-section">
    <div class="content-wrapper">
      <h1>Nos Projets</h1>
      <div class="divider"></div>
      <p>
        Découvrez nos réalisations en énergie propre et climatisation innovante à travers différentes régions.
      </p>
    </div>
  </section>
</template>

<style scoped>
.header-section {
  background: radial-gradient(circle at top left, #2F8F9D, #1e5d65);
  color: #fff;
  padding: 70px 40px;
  margin-bottom: 40px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

.content-wrapper {
  max-width: 800px;
  margin-left: 0;
}

.header-section h1 {
  font-size: 40px;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 10px;
}

.divider {
  width: 50px;
  height: 3px;
  background-color: #ffffff;
  margin: 0 0 20px 0;
  border-radius: 2px;
}

.header-section p {
  color: #333;
  font-size: 17px;
  line-height: 1.7;
  max-width: 700px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
