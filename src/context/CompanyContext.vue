<script setup>
import { helpers } from '@/helpers';
import CompanyService from '@/service/company.service';
import useCompanyStore from '@/stores/company.store';
import CompanyLoader from '@/views/pages/company/CompanyLoader.vue';
import { provide } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
  companyid: {
    type: String,
    required: true
  },
})

const authContext = inject("authContext")
const companyStore = useCompanyStore()
const loaded = ref(false)
const toast = inject("toast")

const companyContext = computed(() => {
  return companyStore.getCompanyModelAsContext
})

provide("companyContext", companyContext)

onMounted(async () => {
  companyStore.setUser(authContext.value.id)

  try {
    const { status: code, data: response } = await CompanyService.getCompanyById(helpers.security.decrypt(props.companyid))

    if (code == 200) {
      companyStore.setField(response)
      loaded.value = true
    } 
  } catch (error) {
    console.error(error)
    toast.error("Failed to load company data")
  }
})
// 
</script>

<template>
  <section>
    <template v-if="!loaded">
      <CompanyLoader />
    </template>
    <template v-else>
      <slot />
    </template>
  </section>
</template>
