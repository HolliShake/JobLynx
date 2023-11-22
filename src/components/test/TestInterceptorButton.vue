
<script setup>
import axiosIns from '@axios'

async function click() {
  axiosIns.post('https://testapi.com/post')
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
        icon="tabler-test-pipe"
      />
      <span>Test Interceptor</span>
    </div>
  </VBtn>
</template>
