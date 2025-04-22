import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import ProductsView from '@/views/products/ProductsView.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsView,
  },
  {
    path: '/products/category/:categoryId',
    name: 'ProductsByCategory',
    component: ProductsView
  },
  {
    path: '/products/category/:categoryId/subcategory/:subcategoryId',
    name: 'ProductsBySubcategory',
    component: ProductsView
  },
  {
    path: '/products/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId',
    name: 'ProductsBySubsubcategory',
    component: ProductsView
  },
  {
    path: '/products/category/:categoryId/subcategory/:subcategoryId/subsubcategory/:subsubcategoryId/product/:productId',
    name: 'FinalProducts',
    component: ProductsView
  },
  {
    path: '/',
    name: 'About',
    component: AboutView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router