<script setup>
import useAuthStore from '@/stores/auth.store'


const authStore = useAuthStore()

onMounted(() => {

})

// 
</script>

<template>
  <section />
</template>

<route lang="yaml">
  meta:
    requiresAuth: true
    subject: admin
    action: read
    redirect: /company
</route>
