<template>
  <section class="quote-section">
    <div class="quote-wrapper">
      <div class="quote-label">ENERGY WISDOM</div>
      <div class="quote-box">
        <div class="quote-mark left">“</div>
        <blockquote>
          L’énergie, c’est la vie. Une vie durable commence par des choix intelligents.
        </blockquote>
        <div class="quote-mark right">”</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quote-section {
  background-color: #000;
  padding: 140px 0; /* Remove side padding */
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  width: 100vw; /* Ensure full viewport width */
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.quote-wrapper {
  max-width: 950px;
  width: 100%;
  padding: 0 20px; /* Contain padding here */
}

.quote-label {
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 20px;
  color: #999;
  font-weight: 600;
  font-family: "Aboreto", serif;
}

.quote-box {
  position: relative;
  padding: 0 10px; /* Reduced padding */
}

blockquote {
  font-family: "Dancing Script", cursive;
  font-optical-sizing: auto;
  font-weight: 400;
  font-size: 2.5rem;
  font-style: italic;
  line-height: 1.6;
  color: #f1f1f1;
  z-index: 2;
  position: relative;
}

.quote-mark {
  position: absolute;
  font-size: 4.5rem;
  font-family: serif;
  color: #e0c177;
  opacity: 0.2;
  z-index: 0;
}

.left {
  top: -40px;
  left: 5px; /* Adjusted position */
}

.right {
  bottom: -40px;
  right: -10px;
}
</style>
