<script setup>
import { watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits([
  'update:modelValue',
])

const items = ref([
  10, // default
  25,
  50,
  100,
  { title: "All", value: -1 },
])

const value = ref(props.modelValue)

watch(value, v => {
  emit('update:modelValue', v)
}, { deep: true, immediate: true })
</script>


<template>
  <AppSelect
    v-model="value"
    :items="items"
    style="width: 4rem;"
    :dense="!!true"
  >
    <template
      v-for="(_, slot) in $slots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope || {}"
      />
    </template>
  </AppSelect>
</template>
