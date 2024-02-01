<script setup>
import { helpers } from '@/helpers'
import AdTypeService from '@/service/adtype.service'
import useAdTypeStore from '@/stores/adtype.store'
import AdTypeModal from '@/views/pages/admin/adtype/AdTypeModal.vue'
import { inject } from 'vue'

const adtypeStore = useAdTypeStore()
const search = ref('')
const itemsPerPage = ref(10)

const breadCrumbs = ref([
  {
    title: "Home",
    to: helpers.resolver.resolveRoot(),
  },
  {
    title: "Ad Types",
    disabled: true,
    to: "#",
  },
])

const tableHeader = ref([
  {
    title: "TYPE",
    key: "type",
  },

  // {
  //   title: "PRICE",
  //   key: "price",
  // },
  {
    title: "SKILLS MATCHING",
    key: "max_skills_matching",
  },
  {
    title: "DURATION (Days)",
    key: "duration",
  },
  {
    title: "MORE",
    key: "more",
  },
  {
    title: "ACTION",
    key: "action",
    width: '150',
    align: 'center',
  },
])

const modalRef = ref()
const loaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const items = computed(() => {
  return adtypeStore.getAdTypes
    .filter(item => {
      return item.type.toLowerCase().includes(search.value.toLowerCase())
    })
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(adtype) {
  adtypeStore.setField(adtype.raw)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(adtype) {
  swal.value.fire({
    question: "Are you sure you want to delete this adtype?",
    dangerMode: true,
  }).then(async result => {
    if (!result) return

    try
    {
      const { status: code } = await AdTypeService.deleteAdtype(adtype.id)

      if (code == 204) {
        toast.success("AdType deleted successfully")
        adtypeStore.delete(adtype)
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete adtype")
    }
  })
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await AdTypeService.getAllAdtypes()

    if (code == 200) {
      adtypeStore.initialize(response)
      loaded.value = true
    }
  } catch (err) {
    toast.error("Failed to fetch ad types")
  }
})

// 
</script>

<template>
  <section>
    <PageHeader
      title="Type of Job ads"
      subtitle="list of ad types"
      :breadcrumb="breadCrumbs"
    />
  
    <VCard>
      <VCardText class="pa-4">
        <VRow>
          <VCol 
            cols="12" 
            md="4"
          >
            <VTextField 
              v-model="search"
              label="Search Ad type"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="auto"
          >
            <ItemsPerPage
              v-model="itemsPerPage"
              style="width: auto;"
            />
          </VCol>
          <VCol 
            cols="12"
            md="auto"
            class="ms-auto"
          >
            <VBtn
              block
              @click="onCreate"
            >
              <VIcon
                start
                icon="tabler-location-plus"
              />
              CREATE AD TYPE
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <AppTable
        :headers="tableHeader"
        :items="items"
        :items-per-page="itemsPerPage"
        :loading="!loaded"
        @click:row="onUpdate"
      >
        <template #item.type="{ item }">
          <VChip
            variant="tonal"
            rounded="sm"
            size="small"
            color="primary"
          >
            <span class="text-sm text-uppercase">{{ item.raw.type }}</span>
          </VChip>
        </template>

        <template #item.more="{ item }">
          <VMenu open-on-hover>
            <template #activator="{ props }">
              <VBtn 
                v-bind="props"
                variant="text"
                density="compact"
                @click.stop="$event => null"
              >
                More
              </VBtn>
            </template>

            <VCard>
              <VCardText class="pa-3">
                <div class="d-flex flex-nowrap flex-row align-center">
                  <VIcon 
                    start
                    size="12"
                    :icon="item.raw.is_featured ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :color="item.raw.is_featured ? 'success' : 'error'"
                  />
                  <span class="text-xs">Featured</span>
                </div>
                <div class="d-flex flex-nowrap flex-row align-center">
                  <VIcon 
                    start
                    size="12"
                    :icon="item.raw.is_search_priority ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :color="item.raw.is_search_priority ? 'success' : 'error'"
                  />
                  <span class="text-xs">Search Priority</span>
                </div>
                <div class="d-flex flex-nowrap flex-row align-center">
                  <VIcon 
                    start
                    size="12"
                    :icon="item.raw.is_editable ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :color="item.raw.is_editable ? 'success' : 'error'"
                  />
                  <span class="text-xs">Editable</span>
                </div>
                <div class="d-flex flex-nowrap flex-row align-center">
                  <VIcon 
                    start
                    size="12"
                    :icon="item.raw.is_analytics_available ? 'mdi-check-circle' : 'mdi-close-circle'"
                    :color="item.raw.is_analytics_available ? 'success' : 'error'"
                  />
                  <span class="text-xs">Analytics</span>
                </div>
              </VCardText>
            </VCard>
          </VMenu>
        </template>

        <template #item.action="{ item }">
          <VBtn
            icon=""
            variant="text"
            color="error"
            size="small"
            @click.stop="onDelete(item.raw)"
          >
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">
              Delete adtype
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <AdTypeModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    requiresAuth: true
    subject: admin
    action: read
</route>
