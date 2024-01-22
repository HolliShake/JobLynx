<script setup>
import { helpers } from '@/helpers'
import CompanyService from '@/service/company.service'
import useCompanyStore from '@/stores/company.store'
import CompanyLoader from '@/views/pages/company/CompanyLoader.vue'
import { onMounted, provide } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  companyid: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const authContext = inject("authContext")
const companyStore = useCompanyStore()
const loaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const companyContext = computed(() => {
  return companyStore.getCompanyModelAsContext
})

const isDefault = computed(() => {
  const virtaulcid = import.meta.env.VITE_APP_VIRTUAL_COMPANY_ID
  
  return (props.companyid.toString() === virtaulcid)
})

provide("companyContext", companyContext)

async function showNotVerifiedInfo() {
  swal.value.fire({
    question: "Your company is not verified yet. Please wait for the admin to verify your company.",
    dangerMode: true,
  })
    .then(() => {
      router.push('/company')
    })
}

async function loadDefault() {
  companyStore.setUser(authContext.value.id)

  try {
    const { status: code, data: response } = await CompanyService.getDefaultCompany()

    if (code == 200) {
      companyStore.setField(response)
      loaded.value = true

      if (!response.verified_by_admin) {
        showNotVerifiedInfo()
      }
    } 
  } catch (error) {
    console.error(error)
    toast.error("Failed to load company data")
    router.push('/company')
  }
}

async function loadOther() {
  companyStore.setUser(authContext.value.id)

  try {
    const { status: code, data: response } = await CompanyService.getCompanyById(helpers.security.decrypt(props.companyid))

    if (code == 200) {
      companyStore.setField(response)
      loaded.value = true

      if (!response.verified_by_admin) {
        showNotVerifiedInfo()
      }
    } 
  } catch (error) {
    console.error(error)
    toast.error("Failed to load company data")
    router.push('/company')
  }
}

onMounted(async () => {
  if (isDefault.value) 
  {
    await loadDefault()
  } 
  else 
  {
    await loadOther()
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
