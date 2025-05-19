<template>
  <section class="contact-duo">
    <div class="contact-left">
      <h2 class="label">Nos coordonnées</h2>
      <div class="info">
        <div class="line">
          <i class="fa-solid fa-envelope"></i>
          <a href="mailto:fces.maroc@gmail.com">fces.maroc@gmail.com</a>
        </div>
        <div class="line">
          <i class="fa-solid fa-phone"></i>
          <a href="https://wa.me/212614116655" target="_blank" rel="noopener">06 14 11 66 55</a>
        </div>
        <div class="line">
          <i class="fa-solid fa-location-dot"></i>
          <a href="https://maps.app.goo.gl/6CijUZ3pxZ8vH4kN7" target="_blank" rel="noopener">14 RUE BORDEAUX QUARTIER L’HÔPITAL , Safi, Maroc</a>
        </div>
      </div>
    </div>
    <div class="contact-right">
      <div class="slogan">Nous sommes à votre écoute</div>
      <i class="fa-solid fa-comments icon-bg"></i>
    </div>
  </section>
</template>

<style scoped>
.contact-duo {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 400px;
}

/* Left Panel: Contact Info */
.contact-left {
  flex: 1;
  background: #1A2B2E; /* dark teal-black */
  color: #E9E5DB;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.label {
  font-family: "Aboreto", serif;
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #7A8B74; /* sage green */
}

.info .line {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
  color: #E9E5DB;
}

.info i {
  color: #7A8B74;
  font-size: 1.2rem;
}

.info a {
  text-decoration: none;
  color: inherit;
  transition: color 0.3s ease, text-decoration 0.3s ease;
}

.info a:hover {
  color: #2F8F9D; /* your accent color */
  text-decoration: underline;
  cursor: pointer;
}


/* Right Panel: Slogan Section */
.contact-right {
  flex: 1;
  background: #E9E5DB;
  color: #1A2B2E;
  padding: 80px 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slogan {
  font-family: "Dancing Script", cursive;
  font-size: 2.2rem;
  z-index: 2;
  text-align: center;
  color: #2F8F9D; /* accent */
}

/* Background icon*/
.icon-bg {
  position: absolute;
  font-size: 9rem;
  color: #E38B29; /* muted terracotta orange */
  opacity: 0.1;
  bottom: 10px;
  right: 30px;
}

@media (max-width: 768px) {
  .contact-duo {
    flex-direction: column;
  }

  .contact-left,
  .contact-right {
    padding: 40px 20px;
    flex: none;
    width: 100%;
    min-height: auto;
  }

  .label {
    font-size: 1.3rem;
    text-align: center;
  }

  .info .line {
    justify-content: center;
    font-size: 0.95rem;
  }

  .slogan {
    font-size: 1.8rem;
    padding: 0 10px;
  }

  .icon-bg {
    font-size: 6rem;
    bottom: 5px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .slogan {
    font-size: 1.6rem;
  }

  .info .line {
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .label {
    font-size: 1.2rem;
  }
}

</style>
