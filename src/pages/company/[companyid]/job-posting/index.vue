<script setup>
import CompanyContext from "@/context/CompanyContext.vue"
import StripeContext from "@/context/StripeContext.vue"
import ActiveTab from "@/views/pages/company/tabs/jobposting/ActiveTab.vue"
import AllTab from "@/views/pages/company/tabs/jobposting/AllTab.vue"
import HistoryTab from "@/views/pages/company/tabs/jobposting/HistoryTab.vue"
import { provide } from "vue"

const currentTab = ref("active")
const stripeRef = ref()

provide("stripeRef", stripeRef)

// 
</script>

<template>
  <CompanyContext>
    <StripeContext ref="stripeRef">
      <VCard>
        <VTabs v-model="currentTab">
          <VTab value="active">
            ACTIVE
          </VTab>
          <VTab value="history">
            JOB POSTING HISTORY
          </VTab>
          <VTab value="all">
            ALL JOB POSTING
          </VTab>
        </VTabs>
        <VWindow v-model="currentTab">
          <VWindowItem value="active">
            <ActiveTab />
          </VWindowItem>
          <VWindowItem value="history">
            <HistoryTab />
          </VWindowItem>
          <VWindowItem value="all">
            <AllTab />
          </VWindowItem>
        </VWindow>
      </VCard>
    </StripeContext>
  </CompanyContext>
</template>

<route lang="yaml">
  meta:
    layout: default
    subject: company
    action: read
    requiresAuth: true
</route>
