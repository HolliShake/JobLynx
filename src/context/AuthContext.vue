<script setup>
import useAuthStore from '@/stores/auth.store';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '@/service/auth.service'
import { computed } from 'vue';

// 👉 Route
const route = useRoute()

// 👉 Router
const router = useRouter()

// 👉 Service
const authService = AuthService

// 👉 Auth Store
const authStore = useAuthStore()

const authContext = computed(() => {
  return authStore.getUserData
})

provide("authContext", authContext)

watch(() => authStore, async() => {
  if (route.fullPath?.toLowerCase() == "/login" ) {
    return console.log("Auth context: Login page, no need to fetch data")
  }

  try
  {
    if (authStore.isLoggedIn) {
      const object = await authService.authenticate()
      if (!object) return

      if (!object.data.personal_data) {
        return router.replace({
          name: 'profile-tab',
          params: { tab: 'profile' },
          props: true,
        })
      }

      const { status: code, data: respose } = object
      if (code == 200) {
        authStore.update(respose)
      }
    }
  } catch (error) {
    // if (authStore.isLoggedIn) {
    //   router.replace("/login")
    //   /** cleanup */
    //   authStore.clearCache()
    // }
  }
}, { deep: true })

// 
</script>

<template>
  <slot />
</template>
