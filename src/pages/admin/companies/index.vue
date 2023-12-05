<script setup>
import CompanyService from '@/service/company.service';
import useCompanyStore from '@/stores/company.store';
import CompanyModal from '@/views/pages/company/CompanyModal.vue';
import { computed } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';


const tableHeader = ref([
  {
    title: "COMPANY NAME",
    key: "company_name",
  },
  {
    title: "EMAIL",
    key: "email",
    sortable: false,
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
  {
    title: "ACTION",
    key: "action",
    align: 'center',
  }
])

const companyStore = useCompanyStore()
const search = ref('')
const itemsPerPage = ref(10)
const modalRef = ref()
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

const companies = computed(() => {
  return companyStore.getCompanies
    .filter(company => company.company_name.toLowerCase().includes(search.value.toLowerCase()))
})

function onUpdate(company) {
  companyStore.setField(company.raw)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(company) {
  swal.value.fire({
    question: "Are you sure you want to delete this company?",
    dangerMode: true,
  })
  .then(async result => {
    if (!result) return

    try
    {
      const { status: code } = await CompanyService.deleteCompany(company.id)

      if (code >= 200 && code <= 299) {
        companyStore.delete(company)
        toast.success("Successfully deleted.")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete company.")
    }
  })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await CompanyService.getAllCompanies()

    if (code == 200) {
      companyStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error("Failed to load company data.")
  }
})

// 
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol 
            cols="12"
            md="4"
          >
            <VTextField 
              v-model="search"
              label="Search Company"
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
        </VRow>
      </VCardText>
      <AppTable 
        :headers="tableHeader"
        :items="companies"
        :loading="!loaded"
        @click:row="onUpdate"
      >
        <template #item.status="{ item }">
          <VChip
            :color="item.raw.status == 'active' ? 'success' : 'error'"
            text-color="white"
            rounded="sm"
          >
            {{ item.raw.status }}
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
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">Delete company</VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <CompanyModal 
      ref="modalRef"
    />
  </section>
</template>
