import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { isUserLoggedIn, userCan } from './utils'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

router.beforeEach(async (to, from, next) => {
  try {
    if (!to.meta || (!to.meta.requiresAuth && !(to.meta.subject || to.meta.action))) {
      // Proceed to route if no meta, no auth required, or no role/permission
      return next()
    }

    const isLoggedIn = isUserLoggedIn()

    if (to.meta.requiresAuth && !isLoggedIn) {
      // Redirect to login with redirect path
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    const hasPermission = userCan(to.meta.subject, to.meta.action)

    if (hasPermission) {
      // Proceed to route if authorized
      return next()
    }
    console.log(to.meta.subject, to.meta.action, to.fullPath)

    // Redirect to unauthorized route if permission denied
    return next('unauthorize')
  } catch (error) {
    // Handle any errors during authorization
    console.error('Authorization error:', error)
    next('error') // Redirect to error handling route
  }
})

// Docs: https://router.vuejs.org/guide/advanced/navigation-guards.html#global-before-guards
export default router
