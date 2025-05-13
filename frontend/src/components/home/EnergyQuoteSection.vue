<template>
  <section class="quote-section">
    <div class="quote-wrapper">
      <div class="quote-label">SAGESSE ÉNERGÉTIQUE</div>
      <div class="quote-box">
        <div class="quote-mark left">"</div>
        <blockquote>
          L'énergie, c'est la vie. Une vie durable commence par des choix intelligents.
        </blockquote>
        <div class="quote-mark right">"</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.quote-section {
  background-color: #000;
  padding: 140px 0;
  text-align: center;
  color: white;
  display: flex;
  justify-content: center;
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.quote-wrapper {
  max-width: 950px;
  width: 100%;
  padding: 0 20px;
}

.quote-label {
  font-size: 0.9rem;
  letter-spacing: 2px;
  margin-bottom: 20px;
  color: #999;
  font-weight: 600;
  font-family: "Aboreto", serif;
  text-transform: uppercase;
}

.quote-box {
  position: relative;
  padding: 0 10px;
}

blockquote {
  font-family: "Dancing Script", cursive;
  font-weight: 400;
  font-size: 2.5rem;
  font-style: italic;
  line-height: 1.6;
  color: #f1f1f1;
  z-index: 2;
  position: relative;
  margin: 0;
  padding: 0 20px;
}

.quote-mark {
  position: absolute;
  font-size: 4.5rem;
  font-family: serif;
  color: #e0c177;
  opacity: 0.2;
  z-index: 0;
  line-height: 1;
}

.left {
  top: -20px;
  left: 0;
}

.right {
  bottom: -60px;
  right: 0;
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
  .quote-section {
    padding: 100px 0;
  }
  
  blockquote {
    font-size: 2.2rem;
  }
  
  .quote-mark {
    font-size: 4rem;
  }
}

@media (max-width: 768px) {
  blockquote {
    font-size: 2rem;
    line-height: 1.5;
    padding: 0 15px;
  }
  
  .quote-mark {
    font-size: 3.5rem;
  }
  
  .left {
    top: -15px;
  }
  
  .right {
    bottom: -50px;
  }
}

@media (max-width: 480px) {
  .quote-section {
    padding: 80px 0;
  }
  
  blockquote {
    font-size: 1.7rem;
    padding: 0 10px;
  }
  
  .quote-label {
    font-size: 0.8rem;
    margin-bottom: 15px;
  }
  
  .quote-mark {
    font-size: 3rem;
  }
  
  .left {
    top: -10px;
    left: -5px;
  }
  
  .right {
    bottom: -40px;
    right: -5px;
  }
}

@media (max-width: 360px) {
  blockquote {
    font-size: 1.5rem;
  }
  
  .quote-mark {
    font-size: 2.5rem;
  }
}
</style>