import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ServicesView from '@/views/ServicesView.vue'
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
    path: '/products/product/:productId',
    name: 'ProductDetails',
    component: ProductsView
  },
  {
    path: '/',
    name: 'Services',
    component: ServicesView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router