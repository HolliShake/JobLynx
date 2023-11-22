<script setup>
import { onMounted } from 'vue';
import SalaryModal from './SalaryModal.vue';
import useSalaryStore from '@/stores/salary.store';
import { inject } from 'vue';
import { watch } from 'vue';
import SalaryService from '@/service/salary.service';

const salaryStore = useSalaryStore()
const companyContext = inject('companyContext')
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

async function onCreate() {
  modalRef.value.open()
}

watch(companyContext, async (value) => {
  salaryStore.setCompany(value.id)

  try
  {
    const { status: code, data: response } = await SalaryService.getSalaryByCompanyId(value.id)

    if (code == 200) {
      salaryStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error(error.message)
  }
}, { deep: true, immediate: true })

// 
</script>

<template>
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
      :items-per-page="itemsPerPage"
    />
  </VCard>

  <SalaryModal ref="modalRef" />
</template>
