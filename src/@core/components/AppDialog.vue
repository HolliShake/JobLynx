<script setup>

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
    class="v-dialog-sm"
    persistent
  >
    <DialogCloseBtn @click="close" />
  
    <template #activator>
      <slot name="activator" :isUpdateMode="updateMode" />  
    </template>

    <VCard>
      <VCardTitle class="text-center">
        <slot name="title" :isUpdateMode="updateMode">
          Dialog Title
        </slot>
      </VCardTitle>
      <VCardText>
        <slot name="content" :isUpdateMode="updateMode" />
      </VCardText>
      <VCardText class="pa-5 text-center">
        <slot name="actions" :isUpdateMode="updateMode" />
      </VCardText>
    </VCard>
  </VDialog>
</template>
