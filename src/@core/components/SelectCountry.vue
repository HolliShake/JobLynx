<script setup>
import axiosIns from '@/plugins/axios'
import { inject, watch, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: "Philippines",
  },
  label: {
    type: String,
    default: "Select country",
  },
})

const emit = defineEmits([
  "update:modelValue",
])

// 👉 Toast
const toast = inject("toast")

// 👉 Selected country
const country = ref(props.modelValue)

// 👉 Actual data
const data = ref([])

// 👉 Filtered
const computedData = computed(() => { 
  return data.value
    .map(d => d.name.common)
})

// 👉 Loaded
const loaded = ref(false)

// 👉 Watch changes
watch(props, props => {
  country.value = props.modelValue
}, { deep: true, immediate: true })

// 👉 Country
watch(country, country => { 
  emit("update:modelValue", country)
}, { deep: true })

watchEffect(async () => { 
  try {
    const response = await axiosIns.get('https://restcountries.com/v3.1/all?fields=name')

    if (response.status === 200)
    {
      data.value = response.data
      loaded.value = true
    } else 
    {
      toast.error(response.message)
    }
  } catch (err) {
    toast.error(err.message)
  }
})

// 
</script>

<template>
  <VSelect
    v-model="country"
    :label="props.label"
    :items="computedData"
    :loading="!loaded"
  />
</template>

