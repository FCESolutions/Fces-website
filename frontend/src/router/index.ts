import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import ServicesView from '@/views/ServicesView.vue'
import ProductsView from '@/views/ProductsView.vue'
import OrderView from '@/views/OrderView.vue'
import AdminView from '@/views/AdminView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import ThankYouNotice from '@/components/products/ThankYouNotice.vue'
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
    name: 'Projects',
    component: ProjectsView
  },
  {
    path: '/merci',
    name: 'ThankYou',
    component: ThankYouNotice
  },
  {
    path: '/',
    name: 'Contact',
    component: ContactView
  },
  {
    path: '/admin/admin-access',
    name: 'Admin',
    component: AdminView,    
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const token = localStorage.getItem('adminToken')
      // Allow access if route is exactly admin login page:
      if (to.path === '/admin/admin-access') {
        return next();
      }

      // Otherwise, if path includes /admin and no token, block access
      if (to.path.includes('/admin') && !token) {
        return next('/login'); // or your chosen fallback route
      }

      // Otherwise, proceed normally
      next();
    },
    meta: { requiresAuth: true }
  }
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