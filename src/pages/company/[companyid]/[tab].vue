<script setup>
import CompanyContext from '@/context/CompanyContext.vue';
import useRawLayout from '@/layouts/useRawLayout';
import { h } from 'vue';
import { onMounted } from 'vue';
import DashboardTab from "@/views/pages/company/tabs/dashboard/index.vue"
import OfficeTab from "@/views/pages/company/tabs/office/index.vue"
import JobPostingCardTab from "@/views/pages/company/tabs/jobposting/index.vue"
import PositionTab from "@/views/pages/company/tabs/position/index.vue"
import SalaryTab from "@/views/pages/company/tabs/salary/index.vue"
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  tab: {
    type: String,
    required: true
  },
})

const router = useRouter()
const route = useRoute()
const rawLayout = useRawLayout()
const tabs = ref([
  {
    title: "Dashboard",
    key: "dashboard",
    icon: "mdi-view-dashboard",
  },
  {
    title: "Offices",
    key: "offices",
    icon: "mdi-office-building",
  },
  {
    title: "Employees",
    key: "employees",
    icon: "mdi-user-group",
  },
  {
    title: "Job Posting",
    key: "jobPosting",
    icon: "mdi-toolbox",
  },
  {
    title: "Position",
    key: "position",
    icon: "mdi-briefcase",
  },
  {
    title: "Salary",
    key: "salary",
    icon: "mdi-cash-multiple",
  }
])
const currentTab = ref((() => props.tab)())

function getComponent(key) {
  switch (key) {
    case "dashboard":
      return h(DashboardTab)
    case "offices":
      return h(OfficeTab)
    case "jobPosting":
      return h(JobPostingCardTab)
    case "position":
      return h(PositionTab)
    case "salary":
      return h(SalaryTab)
    default:
      return h('span', key)
  }
}

watch(currentTab, tab => {
  router.push({
    name: 'company-companyid-tab',
    params: {
      companyid: route.params.companyid,
      tab: tab
    },
    props: true,
  })
}, { deep: true })

onMounted(async () => {
  rawLayout.setLayoutFluid(true) 
})

// 
</script>


<template>
  <CompanyContext>
    <VRow>
      <!--  -->
      <VCol 
        cols="12"
        :lg="rawLayout.isLayoutFluid ? 2 : 'auto'"
        class="h-100"
      >
        <VCard
          rounded="0"
          flat
          class="company-nav-card"
        >
          <VCardText class="pa-4">
            <VTabs
              v-model="currentTab"
              :direction="$vuetify.display.lgAndUp ? 'vertical' : 'horizontal'"
              class="v-tabs-vertical v-tabs-pill"
            >
              <VTab
                v-for="t in tabs"
                :key="t.key"
                :value="t.key"
              >
                <VIcon 
                  start
                  :icon="t.icon"
                />
                <span>{{ t.title }}</span>
              </VTab>
            </VTabs>
          </VCardText>
        </VCard>
      </VCol>
      <!--  -->
      <VCol 
        cols="12"
        lg="10"
      >
        <VWindow 
          v-model="currentTab"
          class="disable-tab-transition"
        >
          <VWindowItem 
            v-for="t in tabs"
            :key="t.key"
            :value="t.key"
          >
            <Component :is="getComponent(t.key)" />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </CompanyContext>
</template>

<style lang="scss">
.company-nav-card {
  height: auto !important;
  // on Lg and Up
  @media screen and (min-width: 1280px) {
    min-height: calc(100vh - calc( 69.97px + 24px ));
  }
}
</style>

<route lang="yaml">
  meta:
    layout: raw
</route>
