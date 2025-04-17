import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../views//products/Products.vue')
  },
  // {
//   path: '/categories',
//   name: 'categories',
//   component: () => import('@/views/products/CategoriesView.vue')
// }
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/products/CategoriesView.vue')
  },
  //  {
    //  path: '/categories/:id',
    //  name: 'CategoryProducts',
    //  component: () => import('@/views/CategoryProductsView.vue')
  //  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router