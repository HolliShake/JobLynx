<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "TITLE",
  },
})

// 
</script>

<template>
  <div class="d-flex v-flex flex-row flex-nowrap w-100 align-center">
    <VDivider />
    <span class="mx-2 text-sm text-no-wrap">
      <slot name="title">
        {{ props.title }}
      </slot>
    </span>
    <VDivider />
  </div>
</template>
