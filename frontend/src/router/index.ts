import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ProductsView from '@/views/ProductsView.vue'
import OrderView from '@/views/OrderView.vue'
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
    path: '/products/order',
    name: 'Order',
    component: OrderView,
    meta: { requiresCart: true }
  },
  {
    path: '/',
    name: 'Services',
    component: ServicesView
  },
  {
    path: '/',
    name: 'Contact',
    component: ContactView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on route change
    return { top: 0 }
  }
})

export default router