<template>
  <section class="services-section">
    <div class="container">
      <!-- Intro Section -->
      <div class="intro" data-aos="fade-up">
        <h1 class="intro-title">Nos Solutions Énergétiques</h1>
        <p class="intro-text">
          Découvrez notre gamme complète de services d'énergie renouvelable, conçus pour répondre à tous vos besoins énergétiques avec des solutions durables et économiques.
        </p>
      </div>

      <!-- Services Grid -->
      <div class="services-grid">
        <div
          v-for="(service, index) in services"
          :key="index"
          class="service-card"
          :style="`--card-accent: ${service.color}`"
          data-aos="fade-up"
          :data-aos-delay="service.delay * 100"
        >
          <div class="card-content">
            <div class="card-icon">
              <span class="mdi" :class="`mdi-${service.icon}`"></span>
            </div>
            <h3 class="card-title">{{ service.title }}</h3>
            <p class="card-description">{{ service.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ServicesSection',
  data() {
    return {
      services: [
        {
          title: "Système solaire hybride",
          description:
            "Installation de systèmes solaires hybrides avec ou sans stockage par batteries lithium ou gel, adaptés à vos besoins énergétiques spécifiques.",
          icon: "solar-panel",
          color: "#6AA8FF", // Brighter blue
          delay: 1,
        },
        {
          title: "Pompage solaire",
          description:
            "Solutions de pompage d'eau alimentées par énergie solaire, idéales pour l'irrigation agricole et l'approvisionnement en eau dans les zones rurales.",
          icon: "water-pump",
          color: "#7ED49A", // Brighter green
          delay: 2,
        },
        {
          title: "Solaire thermique",
          description:
            "Systèmes solaires thermiques pour la production d'eau chaude sanitaire et le chauffage, réduisant considérablement votre facture énergétique.",
          icon: "water-thermometer",
          color: "#FFB280", // Brighter coral
          delay: 3,
        },
        {
          title: "Climatisation solaire",
          description:
            "Systèmes de réfrigération et de climatisation alimentés par énergie solaire, offrant confort et économies dans les climats chauds.",
          icon: "snowflake",
          color: "#7DD5E0", // Brighter teal
          delay: 4,
        },
        {
          title: "Vente et distribution",
          description:
            "Fourniture de composants et de systèmes d'énergie solaire de haute qualité, avec des partenariats avec les principales marques du secteur.",
          icon: "truck-delivery",
          color: "#C9A0FF", // Brighter purple
          delay: 5,
        },
        {
          title: "Installation et maintenance",
          description:
            "Services professionnels d'installation et programmes de maintenance régulière pour garantir les performances optimales de votre système.",
          icon: "tools",
          color: "#FF9ACD", // Brighter pink
          delay: 6,
        },
      ],
    };
  },
};
</script>

<style scoped>
.services-section {
  padding: 5rem 1rem;
  background-color: #FBFBFB;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.intro {
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 1rem;
}

.intro-title {
  font-size: 2.1rem;
  color: #2C3E50;
  margin-bottom: 1.25rem;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.intro-text {
  font-size: 1.05rem;
  color: #6D7D8E;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.7;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.service-card {
  background: #FFFFFF;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.35s cubic-bezier(0.16, 0.85, 0.3, 1.05);
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.03);
  padding: 1.5rem;
}

.service-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.card-content {
  padding: 0.5rem;
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--card-accent);
  transition: all 0.3s ease;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #2C3E50;
  font-weight: 600;
  letter-spacing: -0.3px;
  position: relative;
  display: inline-block;
}

.card-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 2px;
  background: var(--card-accent);
  transition: width 0.3s ease;
}

.service-card:hover .card-title::after {
  width: 60px;
}

.card-description {
  color: #6D7D8E;
  margin-bottom: 0;
  line-height: 1.7;
  font-size: 0.92rem;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.8rem;
  }
  
  .intro-title {
    font-size: 1.8rem;
  }
  
  .services-section {
    padding: 3.5rem 1rem;
  }
  
  .service-card {
    padding: 1.3rem;
  }
}
</style>