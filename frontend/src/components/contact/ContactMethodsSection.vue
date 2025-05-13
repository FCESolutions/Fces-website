<template>
  <section class="contact-duo">
    <div class="contact-left">
      <h2 class="label">Nos coordonnées</h2>
      <div class="info">
        <div class="line">
          <i class="fa-solid fa-envelope"></i>
          <span>fces.maroc@gmail.com</span>
        </div>
        <div class="line">
          <i class="fa-solid fa-phone"></i>
          <span>+212 6 14 11 66 55</span>
        </div>
        <div class="line">
          <i class="fa-solid fa-location-dot"></i>
          <span>14 RUE BORDEAUX QUARTIER L’HÔPITAL , Safi, Maroc</span>
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
