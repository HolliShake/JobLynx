<script setup>
import useAuthStore from '@/stores/auth.store';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '@/service/auth.service'

// 👉 Route
const route = useRoute()

// 👉 Router
const router = useRouter()

// 👉 Service
const authService = AuthService

// 👉 Auth Store
const authStore = useAuthStore()

onMounted(async() => {
  if (route.fullPath?.toLowerCase() == "/login" ) {
    return console.log("Auth context: Login page, no need to fetch data")
  }

  try
  {
    if (!authStore.isLoggedIn) {
      const object = await authService.authenticate()
      if (!object) return

      const { status: code, data: respose } = object
      if (code == 200)
      {
        authStore.update(respose)
      }
    }
  } catch (error) {
    if (authStore.isLoggedIn) {
      router.replace("/login")
      /** cleanup */
      authStore.clearCache()
    }
  }
})

// 
</script>

<template>
  <slot />
</template>
