<script setup>
import ScrollToTop from '@core/components/ScrollToTop.vue'
import { useThemeConfig } from '@core/composable/useThemeConfig'
import { hexToRgb } from '@layouts/utils'
import { toast } from 'vue3-toastify'
import { useTheme } from 'vuetify'
import Loader from './components/Loader.vue'
import AuthContext from './context/AuthContext.vue'

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
  handleSkinChanges,
} = useThemeConfig()

const { global } = useTheme()
const swal = ref()

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
handleSkinChanges()

//👉 Pass to children
provide("toast", toast)

//👉 Pass to children
provide("swal", swal)

console.log(import.meta.env.VITE_APP_API_URL);
console.log(import.meta.env.VITE_APP_LOCAL_STRIPE_SERVER);

// 
</script>

<template>
  <AuthContext>
    <VLocaleProvider :rtl="isAppRtl">
      <!-- Loading screen -->
      <Loader />
      <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
      <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
        <QuestionDialog ref="swal" />
        <RouterView />
        <ScrollToTop />
      </VApp>
    </VLocaleProvider>
  </AuthContext>
</template>
