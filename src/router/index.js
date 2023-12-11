import useRawLayout from '@/layouts/useRawLayout'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})


router.beforeEach((to, from, next) => {
  if (to.meta?.requiresAuth) {
    if (isUserLoggedIn()) {
      next()
    }
    else {
      next('/login')
    }
  }
  else {
    next()
  }
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
