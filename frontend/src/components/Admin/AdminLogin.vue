<template>
  <section class="admin-login">
    <h2>Accès Administrateur</h2>

    <form @submit.prevent="handleLogin">
      <div class="input-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          placeholder="Entrez le mot de passe administrateur"
        />
      </div>

      <button type="submit" class="login-btn">Accéder aux commandes</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>

    <transition name="fade">
      <p v-if="success" class="success">Accès autorisé !</p>
    </transition>
  </section>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import api from '@/api'

const emit = defineEmits(['loginSuccess'])
const password = ref('')
const error = ref('')
const success = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  error.value = '' 
  success.value = false

  try {
    const res = await api.checkAdmin(password.value)
    emit('loginSuccess', res.data)

    success.value = true
    setTimeout(() => {
      success.value = false
    }, 2000)
  } catch (err) {
    error.value = err?.response?.data?.message || 'Mot de passe incorrect ou erreur lors de la récupération des commandes.'  
  }
}
</script>


<style scoped>
.admin-login {
  max-width: 500px;
  width: 90%;
  margin: 12vh auto 30vh;
  padding: 3rem 3rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  box-sizing: border-box;
}

.admin-login h2 {
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #333;
}

.input-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.input-wrapper input {
  flex: 1;
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1.05rem;
  transition: border-color 0.2s ease;
  box-sizing: border-box;
  margin-bottom: 30px;
}

.input-wrapper input:focus {
  border-color: #007bff;
  outline: none;
}

.login-btn {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.05rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
  font-weight: 500;
}

.login-btn:hover {
  background: #0056b3;
}

.admin-login .error,
.admin-login .success {
  min-height: 1.5rem; /* Reserve space to prevent jumpiness */
  margin-top: 1rem;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.admin-login .error {
  color: #e74c3c;
}

.admin-login .success {
  color: #2ecc71;
  animation: glow 0.6s ease-in-out;
}

/* Animated success fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Subtle glow effect */
@keyframes glow {
  0% {
    box-shadow: 0 0 0 rgba(46, 204, 113, 0);
  }
  50% {
    box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
  }
  100% {
    box-shadow: 0 0 0 rgba(46, 204, 113, 0);
  }
}


</style>