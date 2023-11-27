<script setup>
import useOfficeStore from '@/stores/office.store';
import OfficeModal from './OfficeModal.vue';
import { inject } from 'vue';
import OfficeService from '@/service/office.service';


const companyContext = inject("companyContext")
const officeStore = useOfficeStore()
const search = ref('')
const itemsPerPage = ref(10)
const tableHeader = ref([
  {
    title: "OFFICE NAME",
    key: "name",
  },
  {
    title: "ADDRESS",
    key: "address",
  },
  {
    title: "CONTACT NUMBER",
    key: "mobile_number",
  },
  {
    title: "ACTION",
    key: "action",
    width: '150',
    align: 'center',
  }
])
const modalRef = ref()
const loaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const items = computed(() => {
  return officeStore.getOffices
    .filter(s => s.name.toLowerCase().includes(search.value.toLowerCase()))
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(office) {
  officeStore.setField(office.raw)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(office) {
  swal.value.fire({
    question: "Are you sure you want to delete office entry?",
    dangerMode: true,
  }).then(async (result) => {
    if (!result) return

    try
    {
      const { status: code } = await OfficeService.deleteOffice(office.id)

      if (code == 204) {
        toast.success("Office deleted successfully")
        officeStore.delete(office)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete office.")
    }
  })
}

watch(companyContext, async (value) => {
  officeStore.setCompany(value.id)  

  try
  {
    const { status: code, data: response } = await OfficeService.getOfficesByCampusId(value.id)

    if (code == 200) {
      officeStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load offices.")
  }

}, { deep: true, immediate: true })

// 
</script>

<template>
  <VCard
    rounded="0"
    flat
  >
    <VCardText
      class="pa-4"
    >
      <VRow>
        <VCol
          cols="12"
          md="4"
        >
          <VTextField 
            v-model="search"
            label="Office Name"
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
            @click="onCreate"
          >
            <VIcon 
              start  
              icon="tabler-location-plus"
            />
            CREATE NEW OFFICE
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
      <template #item.name="{ item }">
        <VChip
          rounded="sm"
          color="success"
        >
          <span class="text-uppercase">{{ item.raw.name }}</span>
        </VChip>
      </template>

      <template #item.address="{ item }">
        <div class="d-flex flex-row flex-nowrap align-center">
          <VIcon
            size="18"
            start
            color="error"
            icon="tabler-map-pin-filled"
          />
          <div>
            <span class="d-block text-sm font-weight-bold">{{ item.raw.country }}</span>
            <span class="d-block mt-n1 text-xs">{{ (item.raw.address.length >= 50) ? item.raw.address.substring(0, 47) + '...' : item.raw.address }}</span>
          </div>
        </div>
      </template>

      <template #item.action="{ item }">
        <VBtn
          icon=""
          variant="text"
          color="error"
          size="small"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon
            icon="tabler-trash"
          />
          <VTooltip activator="parent">Delete office</VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <OfficeModal ref="modalRef" />
</template>
