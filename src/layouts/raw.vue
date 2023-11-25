<script setup>
import { useThemeConfig } from '@/@core/composable/useThemeConfig';
import { useSkins } from '@core/composable/useSkins'
import UserProfile from './components/UserProfile.vue';
import { VNodeRenderer } from '@/@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig'
import NavbarThemeSwitcher from './components/NavbarThemeSwitcher.vue';
import useAuthStore from '@/stores/auth.store';
import useRawLayout from './useRawLayout';

const rawLayoutStore = useRawLayout()
const { injectSkinClasses } = useSkins()
const { appRouteTransition } = useThemeConfig()


// ℹ️ This will inject classes in body tag for accurate styling
injectSkinClasses()

const resolveRoot = computed(() => {
  return useAuthStore().isAdmin ? '/admin/companies' : '/'
})
</script>

<template>
  <div class="layout-wrapper layout-blank" style="padding-top: 69.97px;"> 
    <VCard rounded="0" style="position: fixed; top: 0; width: 100%; z-index: 999;">
      <VCardText class="pa-4">
        <div class="d-flex flex-row flex-nowrap align-center justify-end">
          <RouterLink
            :to="resolveRoot"
            class="app-logo d-flex align-center gap-x-3"
          >
            <VNodeRenderer :nodes="themeConfig.app.logo" />

            <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
              {{ themeConfig.app.title }}
            </h1>
          </RouterLink>
          <VSpacer />
          
          <NavbarThemeSwitcher class="me-2" />
          <UserProfile />
        </div>
      </VCardText>
    </VCard>
    
    <VContainer 
      :fluid="rawLayoutStore.isLayoutFluid" 
      class="pa-0"
    >
      <VCol 
        cols="12"
        :lg="rawLayoutStore.isLayoutFluid ? '*' : 10"
        :xl="rawLayoutStore.isLayoutFluid ? '*' :  8"
        offset="0"
        :offset-lg="rawLayoutStore.isLayoutFluid ? 0 : 1"
        :offset-xl="rawLayoutStore.isLayoutFluid ? 0 : 2"
      >
        <RouterView v-slot="{ Component }">
          <Transition
            :name="appRouteTransition"
            mode="out-in"
          >
            <Component :is="Component" />
          </Transition>
        </RouterView>
      </VCol>
    </VContainer>
  </div>
</template>

<style>
:root {
  --raw-layout-nav: 69.97px;
}

.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
