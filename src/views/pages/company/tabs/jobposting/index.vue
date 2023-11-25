<script setup>
import ActiveTab from "./ActiveTab.vue"

const currentTab = ref("active")

// 
</script>

<template>
  <VCard>
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
</template>
