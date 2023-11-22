import useRawLayout from '@/layouts/useRawLayout'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

const COMPANY_PATTERN = new RegExp('/company/.*/.*')

router.beforeEach((to, from, next) => {
  if (COMPANY_PATTERN.test(to.fullPath)) {
    setTimeout(() => {
      useRawLayout().setLayoutFluid(true);
    }, 300)
  } else {
    setTimeout(() => {
      useRawLayout().setLayoutFluid(false);
    }, 300)
  }
  next()
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router