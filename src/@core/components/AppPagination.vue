
<script setup>
import { watch } from 'vue'

const props = defineProps({
  shrink: {
    type: Boolean,
    default: false,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  itemsPerPage: {
    type: Number,
    default: 10, 
  },
  totalItemsCount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits([
  'update:currentPage',
  'update:itemsPerPage',
])

//  👉 Default page meta
const options = ref({
  page: props.currentPage,
  itemsPerPage: props.itemsPerPage,
})


// 👉 Stand alone paginationMeta | extraccted from @fake-db/utils
const paginationMeta = computed(() => {
  return (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    let end = Math.min(options.page * options.itemsPerPage, total)
    
    end = end < 0 ? total : end

    return `Showing ${start} to ${end} of ${total} entries`
  }
})

const rows = computed(() => {
  if (options.value.itemsPerPage == -1) return 1

  return Math.ceil(props.totalItemsCount / options.value.itemsPerPage)
})

watch(options, (value) => {
  emit('update:currentPage', value.page)
  emit('update:itemsPerPage', value.itemsPerPage)
}, { deep: true })

// 
</script>

<template>
  <div :class="`d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 ${props.shrink ? 'pa-0' : 'px-5 py-2'} pt-3`">
    <p class="text-sm text-disabled mb-0">
      {{ paginationMeta(options, props.totalItemsCount) }}
    </p>

    <VPagination
      v-model="options.page"
      :length="rows"
      :total-visible="$vuetify.display.xs ? 1 : 5"
      size="small"
    />
  </div>
</template>
