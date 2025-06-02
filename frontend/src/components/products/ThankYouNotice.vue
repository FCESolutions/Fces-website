<template>
  <div
    class="thank-you-notice"
    :class="{ leaving: isLeaving }"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <div class="message-box">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h2>Commande reçue !</h2>
      <p class="main-message">
        Numéro : <strong>{{ orderNumber }}</strong>
      </p>

      <div class="details">
        <p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Confirmation dans les <strong>24h</strong>
        </p>
        <p>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2F8F9D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2 4.33 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          Tel : <strong>{{ phoneNumber }}</strong>
        </p>
      </div>

      <p class="closing">Redirection automatique vers l'accueil...</p>

      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLeaving = ref(false)
const progress = ref(0)
const interval = ref(null)
const timeout = ref(null)

const orderNumber = ref('CM' + Math.floor(Math.random() * 10000))
const phoneNumber = ref('06 12 34 56 78')

const showTime = 5000 // 5 seconds

const startTimer = () => {
  interval.value = setInterval(() => {
    progress.value += 100 / (showTime / 50)
    if (progress.value >= 100) clearInterval(interval.value)
  }, 50)

  timeout.value = setTimeout(() => {
    isLeaving.value = true
    setTimeout(() => router.push({ name: 'Home' }), 600)
  }, showTime)
}

const pauseTimer = () => {
  clearInterval(interval.value)
  clearTimeout(timeout.value)
}

const resumeTimer = () => {
  const remaining = 100 - progress.value
  const remainingTime = (remaining / 100) * showTime

  interval.value = setInterval(() => {
    progress.value += 100 / (remainingTime / 50)
    if (progress.value >= 100) clearInterval(interval.value)
  }, 50)

  timeout.value = setTimeout(() => {
    isLeaving.value = true
    setTimeout(() => router.push({ name: 'Home' }), 600)
  }, remainingTime)
}

onMounted(() => {
  startTimer()
})
</script>

<style scoped>
.thank-you-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f9fafb;
  transition: opacity 0.6s ease;
  padding: 1rem;
  box-sizing: border-box;
}

.thank-you-notice.leaving {
  opacity: 0;
}

.message-box {
  background: white;
  padding: 2.5rem 3rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  text-align: center;
  animation: fadeIn 0.4s ease;
  max-width: 90vw;
  width: 100%;
  max-width: 500px;
}

.icon-container {
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 1.7rem;
  color: #2f8f9d;
  margin-bottom: 0.75rem;
}

.main-message {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1rem;
}

.details {
  background: #f8fafc;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin: 1.25rem 0;
  text-align: left;
}

.details p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0.75rem 0;
}

.closing {
  font-size: 0.95rem;
  color: #6b7280;
  font-style: italic;
  margin-top: 1rem;
}

.progress-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin-top: 1.5rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #2f8f9d;
  transition: width 0.05s linear;
}

/* Mobile */
@media (max-width: 480px) {
  .message-box {
    padding: 2rem 1.25rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  .main-message,
  .details p,
  .closing {
    font-size: 0.95rem;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
