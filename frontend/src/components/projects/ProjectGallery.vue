<template>
  <section class="project-gallery">
    <div class="section-header">
      <h2>Nos réalisations</h2>
      <p class="subtitle">Découvrez notre expertise en énergie renouvelable à travers ces projets</p>
    </div>

    <div class="projects-container">
      <div
        class="project-block"
        v-for="(project, index) in projects"
        :key="index"
      >
        <div class="project-header">
          <h3 class="project-title">{{ project.title }}</h3>
          <div class="project-badge" v-if="project.title.includes('en cours')">En cours</div>
        </div>

        <!-- Multiple images -->
        <div v-if="Array.isArray(project.image)" class="multi-image-scroll-wrapper">
          <div class="multi-image-scroll" :class="{ 'center-content': project.image.length <= 3 }">
            <div
              v-for="(imgObj, i) in project.image"
              :key="i"
              class="scroll-img-wrapper"
            >
              <div class="image-container">
                <img
                  :src="typeof imgObj === 'string' ? imgObj : imgObj.src"
                  :alt="`${project.title} - ${i + 1}`"
                  class="scroll-img"
                />
                <div class="image-overlay"></div>
              </div>
              <div
                v-if="imgObj.desc"
                class="img-description"
              >{{ imgObj.desc }}</div>
            </div>
          </div>
        </div>

        <!-- Single image -->
        <div v-else class="single-image-block">
          <div class="image-container">
            <img
              :src="project.image"
              :alt="project.title"
              class="single-img"
            />
            <div class="image-overlay"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import champsPv50kw1 from '@/assets/imgs/champsPv-50kw-1.jpg'
import champsPv50kw2 from '@/assets/imgs/champsPv-50kw-2.jpg'
import champsPv50kw3 from '@/assets/imgs/champsPv-50kw-3.jpg'
import champsPv50kw4 from '@/assets/imgs/champsPv-50kw-4.jpg'

import systemeSolaireHybride16kw from '@/assets/imgs/systemeSolaireHybride-16kw.jpg'
import systemeSolaireHybride14kwc from '@/assets/imgs/systemeSolaireHybride-14kwc.jpg'
import systemeSolaireHybride12kwAC from '@/assets/imgs/systemeSolaireHybride-12kw-AC.jpg'
import systemeSolaireHybride4kwc from '@/assets/imgs/systemeSolaireHybride-4kwc.jpg'
import systemeSolaireHybride3kw from '@/assets/imgs/systemeSolaireHybride-3kw.jpg'

import pompageSolaire300kw from '@/assets/imgs/pompageSolaire-300kw.jpg'
import pompageSolaire300kw2 from '@/assets/imgs/pompageSolaire-300kw-2.jpg'

import pompageSolaire70CV from '@/assets/imgs/pompageSolaire70CV.jpg'

import parkingSolaireMarsaMaroc1 from '@/assets/imgs/parkingSolaireMarsaMarocSafi-1.jpg'
import parkingSolaireMarsaMaroc2 from '@/assets/imgs/parkingSolaireMarsaMarocSafi-2.jpg'
import parkingSolaireMarsaMaroc3 from '@/assets/imgs/parkingSolaireMarsaMarocSafi-3.jpg'
import parkingSolaireMarsaMaroc4 from '@/assets/imgs/parkingSolaireMarsaMarocSafi-4.jpg'
import parkingSolaireMarsaMaroc5 from '@/assets/imgs/parkingSolaireMarsaMarocSafi-5.jpg'



const projects = [
  {
    title: 'Champs photovoltaïques – Systèmes 50kW',
    image: [
      { src:champsPv50kw1},
      { src: champsPv50kw2},
      { src: champsPv50kw3},
      { src: champsPv50kw4}
    ],
  },
  {
    title: 'Système solaire hybride',
    image: [
      { src: systemeSolaireHybride16kw, desc: 'Système solaire hybride – 16kW' },
      { src: systemeSolaireHybride14kwc, desc: 'Système solaire hybride – 14kWc' },
      { src: systemeSolaireHybride12kwAC, desc: 'Système solaire hybride – 12kW AC' },
      { src: systemeSolaireHybride4kwc, desc: 'Système solaire hybride – 4kWc' }, 
      { src: systemeSolaireHybride3kw, desc: 'Système solaire hybride – 3kW' },
    ],
  },
  {
    title: 'Système de pompage solaire – 300kW',
    image: [
      { src: pompageSolaire300kw},
      { src: pompageSolaire300kw2}
      ],
  },
  {
    title: 'Parking solaire à Marsa Maroc de safi - 64kWc (projet en cours)',
    image: [
      { src: parkingSolaireMarsaMaroc1},
      { src: parkingSolaireMarsaMaroc2}, 
      { src: parkingSolaireMarsaMaroc3},
      { src: parkingSolaireMarsaMaroc4},
      { src: parkingSolaireMarsaMaroc5}
    ],
  },
  {
    title: 'Pompage solaire – 70CV (projet en cours)',
    image: [
      { src: pompageSolaire70CV, desc: 'Structure galvanisée solide' }
    ],
  },
]
</script>

<style scoped>
.project-gallery {
  padding: 80px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.project-gallery::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(23, 107, 135, 0.08) 0%, transparent 70%);
  z-index: 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 1;
}

.project-gallery h2 {
  color: #176B87;
  font-size: 36px;
  margin-bottom: 12px;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.project-gallery h2::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: #64CCC5;
  border-radius: 2px;
}

.subtitle {
  color: #5a6d80;
  font-size: 18px;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.project-block {
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.project-block:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.project-title {
  font-size: 22px;
  color: #176B87;
  font-weight: 600;
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.project-badge {
  background: #FF9EAA;
  color: white;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Image styles */
.multi-image-scroll-wrapper {
  overflow: hidden;
  position: relative;
}

.multi-image-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 15px 5px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: #64CCC5 transparent;
}

.multi-image-scroll::-webkit-scrollbar {
  height: 6px;
}

.multi-image-scroll::-webkit-scrollbar-thumb {
  background: #64CCC5;
  border-radius: 3px;
}

.multi-image-scroll.center-content {
  justify-content: center;
}

.scroll-img-wrapper {
  flex: 0 0 auto;
  scroll-snap-align: start;
  position: relative;
}

.image-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scroll-img-wrapper:hover .image-overlay {
  opacity: 1;
}

.scroll-img {
  height: 250px;
  width: auto;
  max-width: 350px;
  min-width: 280px;
  object-fit: cover;
  transition: transform 0.4s ease;
  display: block;
}

.scroll-img-wrapper:hover .scroll-img {
  transform: scale(1.03);
}

.single-image-block {
  display: flex;
  justify-content: center;
}

.single-img {
  width: 100%;
  max-width: 800px;
  height: auto;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
  transition: transform 0.4s ease;
}

.single-image-block:hover .single-img {
  transform: scale(1.02);
}

.img-description {
  margin-top: 12px;
  font-size: 15px;
  color: #5a6d80;
  text-align: center;
  padding: 0 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .project-gallery {
    padding: 60px 15px;
  }
  
  .project-gallery h2 {
    font-size: 28px;
  }
  
  .subtitle {
    font-size: 16px;
    padding: 0 10px;
  }
  
  .project-block {
    padding: 20px;
  }
  
  .project-title {
    font-size: 19px;
  }
  
  .scroll-img {
    height: 200px;
    min-width: 240px;
  }
}
</style>
