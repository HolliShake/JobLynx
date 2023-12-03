<script setup>
import PositionModal from '@/views/pages/company/tabs/position/PositionModal.vue';
import usePositionStore from '@/stores/position.store';
import PositionService from '@/service/position.service';
import { mapEmploymentType } from '@/views/pages/company/tabs/position/employment-type.map';
import { inject } from 'vue';
import { mapPaymentType } from '@/views/pages/company/tabs/position/payment-type.map';
import useCompanyStore from '@/stores/company.store';
import CompanyContext from '@/context/CompanyContext.vue';

const positionStore = usePositionStore()
const companyStore = useCompanyStore()
const search = ref('')
const itemsPerPage = ref(10)
const tableHeader = ref([
  {
    title: "POSITION",
    key: "title",
  },
  {
    title: "OFFICE",
    key: "office.name",
  },
  {
    title: "TYPE",
    key: "employment_type",
    value: v => mapEmploymentType(v.employment_type)
  },
  {
    title: "SLOTS",
    key: "slots",
  },
  {
    title: "SALARY TYPE",
    key: "salary.title",
  },
  {
    title: "BASE SALARY",
    key: "salary.value",
  },
  {
    title: "PAYMENT TYPE",
    key: "payment_type",
    value: v => mapPaymentType(v.payment_type)
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
  return positionStore.getPositions
    .filter(s => s.title.toLowerCase().includes(search.value.toLowerCase()))
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(position) {
  positionStore.setField(position.raw)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(position) {
  swal.value.fire({
    question: "Are you sure you want to delete position entry?",
    dangerMode: true,
  }).then(async (result) => {
    if (!result) return

    try
    {
      const { status: code } = await PositionService.deletePosition(position.id)

      if (code == 204) {
        toast.success("Position entry deleted successfully")
        positionStore.delete(position)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete position.")
    }
  })
}

watch(() => companyStore.companyModel, async (company) => {
  positionStore.setCompany(company.id)

  try
  {
    const { status: code, data: response } = await PositionService.getPositionByCompanyId(company.id)

    if (code == 200) {
      loaded.value = true
      positionStore.initialize(response)
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to fetch position entries.")
  }
}, { deep: true })

// 
</script>

<template>
  <CompanyContext>
    <VCard>
      <VCardText class="pa-4">
        <VRow>
          <VCol 
            cols="12"
            md="4"
          >
            <VTextField
              v-model="search"
              label="Search job position"
            />
          </VCol>
          <VCol cols="12" md="auto">
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
              CREATE NEW POSITION
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
        <template #item.title="{ item }">
          <VChip
            color="primary"
            rounded="sm"
          >
            <span class="text-sm text-uppercase">{{ item.title }}</span>
          </VChip>  
        </template>

        <template #item.action="{ item }">
          <VBtn
            icon=""
            variant="text"
            size="small"
            color="error"
            @click.stop="onDelete(item.raw)"
          >
            <VIcon 
              icon="tabler-trash"
            />
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <PositionModal ref="modalRef" />
  </CompanyContext>
</template>

<route lang="yaml">
  meta:
    layout: default
</route>
