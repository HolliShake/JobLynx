<script setup>
import StripeContext from "@/context/StripeContext.vue";
import ActiveTab from "./ActiveTab.vue"
import { provide } from "vue";

const currentTab = ref("active")
const stripeRef = ref()

provide("stripeRef", stripeRef)

// 
</script>

<template>
  <StripeContext ref="stripeRef">
    <VCard
      rounded="0"
      flat
    >
      <VTabs
        v-model="currentTab"
      >
        <VTab
          value="active"
        >
          ACTIVE
        </VTab>
        <VTab
          value="history"
        >
          JOB POSTING HISTORY
        </VTab>
      </VTabs>
      <VWindow
        v-model="currentTab"
      >
        <VWindowItem value="active">
          <ActiveTab />
        </VWindowItem>
        <VWindowItem value="history">
          b
        </VWindowItem>
      </VWindow>
    </VCard>
  </StripeContext>
</template>
