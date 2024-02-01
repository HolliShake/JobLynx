<script setup>
import EmployeesTab from '@/views/pages/partner/tabs/EmployeesTab.vue'
import JobPostingTab from '@/views/pages/partner/tabs/JobPostingTab.vue'
import { computed } from 'vue'

const props = defineProps({
  partnerid: {
    type: String,
    required: true,
  },
})

const breadCrumb = ref([
  {
    text: 'Admin',
    disabled: false,
    href: '/admin',
  },
  {
    text: 'Companies',
    disabled: false,
    href: '/admin/starboardmanpowerservicesinc/companies',
  },
  {
    text: 'Company',
    disabled: true,
    href: '#',
  },
])

const selectedTab = ref('JobPosting')

const computedPartner = computed(() => {
  const data = JSON.parse(localStorage.getItem('selectedPartner'))

  if (!data.company_name || !data.id) {
    return router.back()
  }

  return data
})

const tabs = ref([
  {
    title: 'JobPosting',
    component: h(JobPostingTab, { partnerid: props.partnerid }),
  },
  {
    title: 'Employees',
    component: h(EmployeesTab, { partnerid: props.partnerid }),
  },
])

// 
</script>

<template>
  <section>
    <PageHeader
      :title="computedPartner.company_name"
      :subtitle="computedPartner.description?.substring(0, 25)"
      :breadcrumb="breadCrumb"
    />
    <!--  -->
    <VRow>
      <VCol cols="12">
        <VCard
          class="pa-0"
          rounded="sm"
          density="compact"
        >
          <VTabs
            v-model="selectedTab"
            height="50"
          >
            <VTab
              v-for="tab in tabs"
              :key="tab.title"
              :value="tab.title"
            >
              {{ tab.title }}
            </VTab>
          </VTabs>
        </VCard>
      </VCol>
      <!--  -->
      <VCol cols="12">
        <VWindow
          v-model="selectedTab"
          style="overflow: visible !important;"
        >
          <VWindowItem
            v-for="tab in tabs"
            :key="tab.title"
            :value="tab.title"
          >
            <Component :is="tab.component" />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: default
    subject: admin
    action: read
    navActiveLink: admin-companyid-companies
    requiresAuth: true
</route>
