<script>
import TestInterceptorButton from '@/components/test/TestInterceptorButton.vue'
import TestSwalButton from '@/components/test/TestSwalButton.vue'
import TestToastButton from '@/components/test/TestToastButton.vue'

// 
</script>

<template>
  <div>
    
    <VCard
      class="mb-6"
      title="Kick start your project 🚀"
    >
      <VCardText>All the best for your new project.</VCardText>
      <VCardText>
        Please make sure to read our <a
          href="https://demos.pixinvent.com/vuexy-vuejs-admin-template/documentation/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          Template Documentation
        </a> to understand where to go from here and how to use our template.
      </VCardText>
    </VCard>

    <VCard title="Want to integrate JWT? 🔒">
      <VCardText>We carefully crafted JWT flow so you can implement JWT with ease and with minimum efforts.</VCardText>
      <VCardText>Please read our  JWT Documentation to get more out of JWT authentication.</VCardText>
      <VCardActions>
        <div class="demo-space-x">
          <TestInterceptorButton />
          <TestToastButton />
          <TestSwalButton />
        </div>
      </VCardActions>
    </VCard>
  </div>
</template>

<route lang="yaml">
  meta:
    layout: raw
</route>
