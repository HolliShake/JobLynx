<script setup>
import SalaryModal from '@/views/pages/company/tabs/salary/SalaryModal.vue';
import useSalaryStore from '@/stores/salary.store';
import { inject } from 'vue';
import { watch } from 'vue';
import SalaryService from '@/service/salary.service';
import useCompanyStore from '@/stores/company.store';
import CompanyContext from '@/context/CompanyContext.vue';
import { helpers } from '@/helpers';

const salaryStore = useSalaryStore()
const companyStore = useCompanyStore()
const search = ref('')
const itemsPerPage = ref(10)
const tableHeader = ref([
  {
    title: "TITLE",
    key: "title",
  },
  {
    title: "LEVEL",
    key: "level",
  },
  {
    title: "AMOUNT",
    key: "value",
    value: v => `${v.currency} ${helpers.formater.numberToMoney(v.value)}`
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
  return salaryStore.getSalaries
    .filter(s => s.title.toLowerCase().includes(search.value.toLowerCase()))
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(salary) {
  salaryStore.setField(salary.raw)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(salary) {
  swal.value.fire({
    question: "Are you sure you want to delete salary entry?",
    dangerMode: true,
  }).then(async (result) => {
    if (!result) return

    try
    {
      const { status: code } = await SalaryService.deleteSalary(salary.id)

      if (code == 204) {
        toast.success("Salary deleted successfully")
        salaryStore.delete(salary)
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete salary.")
    }
  })
}

watch(() => companyStore.companyModel, async (company) => {
  salaryStore.setCompany(company.id)

  try
  {
    const { status: code, data: response } = await SalaryService.getSalaryByCompanyId(company.id)

    if (code == 200) {
      salaryStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load salaries.")
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
              label="Search salary by title"
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
              <span>New Salary</span>
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
        <template #item.level="{ item }">
          <VChip
            variant="tonal"
            color="success"
            rounded="sm"
          >
            {{ item.raw.level }}
          </VChip>
        </template>
        <template #item.action="{ item }">
          <VBtn
            icon=""
            variant="text"
            color="error"
            size="x-small"
            @click.stop="onDelete(item.raw)"
          >
            <VTooltip activator="parent">Delete salary</VTooltip>
            <VIcon
              icon="tabler-trash"
            />
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <SalaryModal ref="modalRef" />
  </CompanyContext>
</template>

<route lang="yaml">
  meta:
    layout: default
</route>
