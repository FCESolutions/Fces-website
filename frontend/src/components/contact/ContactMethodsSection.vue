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

.contact-left {
  flex: 1;
  background: #111;
  color: white;
  padding: 80px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.contact-right {
  flex: 1;
  background: #1b1b1b;
  color: #e0c177;
  padding: 80px 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.label {
  font-family: "Aboreto", serif;
  font-size: 1.5rem;
  margin-bottom: 30px;
  color: #e0c177;
}

.info .line {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1rem;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif;
}

.info i {
  color: #e0c177;
  font-size: 1.2rem;
}

.slogan {
  font-family: "Dancing Script", cursive;
  font-size: 2.2rem;
  z-index: 2;
  text-align: center;
}

.icon-bg {
  position: absolute;
  font-size: 9rem;
  color: #e0c177;
  opacity: 0.06;
  bottom: 10px;
  right: 30px;
}
</style>
