<template>
  <div class="modal-overlay" v-if="visible" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="modal">
      <div class="modal-header">
        <svg class="icon-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <circle cx="12" cy="17" r="1"/>
        </svg>
        <h3 id="modal-title">{{ title }}</h3>
      </div>
      <p class="modal-message" v-html="message"></p>
      <div class="modal-actions">
        <button @click="cancel" class="btn cancel-btn" type="button">Annuler</button>
        <button @click="confirm" class="btn confirm-btn" type="button">Confirmer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  visible: Boolean,
  title: String,
  message: String,
})

const emit = defineEmits(['confirm', 'cancel'])

function confirm() {
  emit('confirm')
}
function cancel() {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 10px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
  padding: 2rem 2.5rem 2.5rem;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 1rem;
}

.icon-warning {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

h3 {
  font-weight: 700;
  font-size: 1.4rem;
  color: #e53935;
  margin: 0;
}

.modal-message {
  font-size: 1rem;
  line-height: 1.6;
  color: #444;
  margin-bottom: 2rem;
  user-select: none;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.6rem 1.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  user-select: none;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}
.cancel-btn:hover {
  background-color: #c6c6c6;
}

.confirm-btn {
  background-color: #e53935;
  color: white;
  box-shadow: 0 3px 6px rgba(229, 57, 53, 0.5);
}
.confirm-btn:hover {
  background-color: #d32f2f;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.7);
}
</style>
