<template>
  <button @click="goBack" class="back-button">
    <Icon icon="mdi:chevron-left" class="button-icon" />
    <span class="button-label">{{ labels }}</span>
  </button>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const router = useRouter()

const labels = 'Retour'

const goBack = () => {
  const { categoryId, subcategoryId, subsubcategoryId } = route.params
  const from = route.query.from

  const currentPath = route.path

  // If current path is /products/order and from exists, go back to "from"
  if (currentPath.includes('/products/order') && from) {
    router.push(from)
    return
  }

  // 1. First priority: if "from" query exists, use it
  if (from) {
    router.push(from)
    return
  }

  if (route.params.productId && subsubcategoryId) {
    router.push({ name: 'ProductsBySubsubcategory', params: { categoryId, subcategoryId, subsubcategoryId } })
  } else if (subsubcategoryId) {
    router.push({ name: 'ProductsBySubcategory', params: { categoryId, subcategoryId } })
  } else if (subcategoryId) {
    router.push({ name: 'ProductsByCategory', params: { categoryId } })
  } else if (categoryId) {
    router.push({ name: 'Products' })
  }
}
</script>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 2px;
  margin-top: 1px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  border-radius: 50px;
}

.button-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.button-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #1d4ed8; /* blue-700 */
  transition: all 0.3s ease;
}

.button-label {
  color: #1d4ed8; /* blue-700 */
  font-weight: 500;
  opacity: 0;
  width: 0;
  transition: all 0.3s ease;
  margin-left: 0;
  white-space: nowrap;
}

.back-button:hover {
  background-color: #eff6ff; /* blue-50 */
  padding: 0.5rem 1rem;
}

.back-button:hover .button-icon {
  transform: translateX(-2px);
}

.back-button:hover .button-label {
  opacity: 1;
  width: auto;
  margin-left: 0.5rem;
}

.back-button:active {
  background-color: #dbeafe; /* blue-100 */
}

.back-button:focus {
  outline: 2px solid #93c5fd; /* blue-300 */
  outline-offset: 2px;
}
</style>