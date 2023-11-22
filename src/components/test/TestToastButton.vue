<script setup>

// 👉 Toast
const toast = inject("toast")

async function click() {
  toast.success("Toast working!")
}

// 
</script>

<template>
  <VBtn
    variant="elevated"
    @click="click"
  >
    <div class="px-2">
      <VIcon
        block
        start
        icon="tabler-layout-cards"
      />
      <span>Test Toast Success</span>
    </div>
  </VBtn>
</template>
