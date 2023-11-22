<script setup>
import { watch } from "vue"
import { VDataTableServer } from "vuetify/labs/VDataTable"

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
  border: {
    type: [Boolean, String, Number],
    default: false,
  },
  rounded: {
    type: [String, Number],
    default: 0,
  },
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
  loading: {
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
  shrink: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'update:modelValue',
  'update:items-per-page',
  'click:row',
])

//  👉 Default page meta
const options = ref({
  page: props.currentPage,
  itemsPerPage: props.itemsPerPage,
})

// 👉 Selected item
const selected = ref([])

// 👉 Stand alone paginationMeta | extraccted from @fake-db/utils
const paginationMeta = computed(() => {
  return (options, total) => {
    const start = (options.page - 1) * options.itemsPerPage + 1
    let end = Math.min(options.page * options.itemsPerPage, total)
    
    end = end < 0 ? total : end

    return `Showing ${start} to ${end} of ${total} entries`
  }
})

// 👉 Table paged data
const pagedData = computed(() => {
  if (options.value.itemsPerPage == -1) return props.items

  // Slice per page
  return Array.from(props.items)
    .slice((options.value.page - 1) * options.value.itemsPerPage, options.value.page * options.value.itemsPerPage)
})

// 👉 Computed number of rows
const rows = computed(() => {
  if (options.value.itemsPerPage == -1) return 1

  return Math.ceil(props.items.length / options.value.itemsPerPage)
})

watch(props, value => {
  options.value.itemsPerPage = value.itemsPerPage
}, { deep: true, immediate: true })

watch(selected, value => {
  emit('update:modelValue', value)
}, { deep: true })

async function onRowClick($event, { item: params }) {
  emit('click:row', params)
}

//
</script>


<template>
  <VDataTableServer
    v-model="selected"
    :items-per-page="options.itemsPerPage"
    :border="props.border"
    :rounded="props.rounded"
    :headers="props.headers"
    :items="pagedData"
    :items-length="pagedData.length"
    :loading="props.loading"
    sticky
    class="custom-v-data-table bordered rounded-0 m|b-4"
    @update:options="options = $event"
    @click:row="onRowClick"
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
    <!-- 👉 Bottom -->
    <template #bottom>
      <div :class="`d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 ${props.shrink ? 'pa-0' : 'px-5 py-2'} pt-3`">
        <p class="text-sm text-disabled mb-0">
          {{ paginationMeta(options, items.length) }}
        </p>

        <VPagination
          v-model="options.page"
          :length="rows"
          :total-visible="$vuetify.display.xs ? 1 : 5"
          size="small"
        />
      </div>
    </template>
  </VDataTableServer>
</template>

<style lang="scss">
.custom-v-data-table.v-table > .v-table__wrapper > table {
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.custom-v-data-table.v-table > .v-table__wrapper {
  overflow-y: visible !important;
  padding-block-end: 2px;
}

.custom-v-data-table.v-table > .v-table__wrapper > table > thead tr > th > .v-data-table-header__content > span {
  white-space: nowrap;
  word-wrap: normal;
}
</style>

