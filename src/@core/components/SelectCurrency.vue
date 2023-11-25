<script setup>
import axiosIns from '@/plugins/axios'
import { inject, watch, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: "PHP",
  },
  label: {
    type: String,
    default: "Select currency",
  },
})

const emit = defineEmits([
  "update:modelValue",
])

// 👉 Toast
const toast = inject("toast")

// 👉 Selected currency
const currency = ref(props.modelValue)

// 👉 Actual data
const data = ref([])

// 👉 Filtered
const computedData = computed(() => { 
  return Array.from(
    new Set(
      data.value
      .map(d => {
        return Object.keys(d?.currencies ?? { ["[INVALID CURRENCY]"]: null }).pop() ?? "[INVALID CURRENCY]"
      })
      .filter(c => c != "[INVALID CURRENCY]")
      .sort()
    )
  )
})

// 👉 Loaded
const loaded = ref(false)

// 👉 Watch changes
watch(props, props => {
  currency.value = props.modelValue
}, { deep: true, immediate: true })

// 👉 Country
watch(currency, currency => { 
  emit("update:modelValue", currency)
}, { deep: true })

watchEffect(async () => { 
  try {
    const response = await axiosIns.get('https://restcountries.com/v3.1/all?fields=currencies')

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
    v-model="currency"
    :label="props.label"
    :items="computedData"
    :loading="!loaded"
  />
</template>

