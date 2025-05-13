<template>
  <section class="map-section">
    <h2 class="map-title">Trouvez-nous ici</h2>
    <div class="map-wrapper">
      <iframe
        class="map-frame"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d581.5991850051174!2d-9.236153283165695!3d32.2869570415884!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdac278441ff864b%3A0x6cc959bf260cc14d!2sFCES%20Maroc!5e1!3m2!1sen!2sma!4v1745590173072!5m2!1sen!2sma"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </section>
</template>

<style scoped>
.map-section {
  background: #fff;
  color: #222;
  text-align: center;
  padding: 60px 20px 0;
}

.map-title {
  font-family: "Aboreto", serif;
  font-size: 1.8rem;
  margin-bottom: 30px;
  color: #1a1a1a;
}

.map-wrapper {
  width: 100%;
  height: 400px;
  overflow: hidden;
}

.map-frame {
  width: 100%;
  height: 100%;
  border: none;
  filter: grayscale(50%) contrast(120%) brightness(90%);
}

@media (max-width: 768px) {
  .map-section {
    padding: 40px 15px 0;
  }

  .map-title {
    font-size: 1.5rem;
  }

  .map-wrapper {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .map-title {
    font-size: 1.3rem;
  }

  .map-wrapper {
    height: 250px;
  }
}

</style>
