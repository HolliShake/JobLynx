<script setup>
const props = defineProps({
  closable: {
    type: Boolean,
    default: true,
  },
  cardClass: {
    type: String,
    default: "",
  },
  style: {
    type: [String, Object],
    default: () => ({}),
  },
  color: {
    type: String,
    default: "",
  },
})

const visibility = ref(false)
const updateMode = ref(false)

async function open() {
  visibility.value = true
  updateMode.value = false
}

async function openAsUpdateMode() {
  visibility.value = true
  updateMode.value = true
}

async function close() {
  visibility.value = false
}

defineExpose({
  open,
  openAsUpdateMode,
  close,
  isUpdateMode() {
    return updateMode.value
  }
})


// 
</script>


<template>
  <VDialog
    :model-value="visibility"
    persistent
  >
    <template #activator>
      <slot name="activator" :isUpdateMode="updateMode" />  
    </template>

    <VCard
      :class="props.cardClass"
      :style="props.style"
      :color="props.color"
    >
      <slot name="header" :isUpdateMode="updateMode" />  
      <VCardText>
        <slot name="content" :isUpdateMode="updateMode" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
