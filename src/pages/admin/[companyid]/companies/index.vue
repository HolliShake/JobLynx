<script setup>
import { helpers } from '@/helpers'
import CompanyService from '@/service/company.service'
import useCompanyStore from '@/stores/company.store'
import CompanyModal from '@/views/pages/company/CompanyModal.vue'
import { computed, inject, onMounted } from 'vue'

const breadCrumbs = ref([
  {
    title: "Home",
    to: helpers.resolver.resolveRoot(),
  },
  {
    title: "Companies",
    disabled: true,
    to: "#",
  },
])

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
    title: "OPERATION",
    key: "operation",
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
  },
])

const filterItems = ref([
  {
    title: "All",
    value: -1,
  },
  {
    title: "Pending",
    value: 0,
  },
  {
    title: "Accepted",
    value: 1,
  },
  {
    title: "Rejected",
    value: 2,
  },
])

const companyStore = useCompanyStore()
const search = ref('')
const filterValue = ref(-1)
const itemsPerPage = ref(10)
const modalRef = ref()
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

const companies = computed(() => {
  return companyStore.getCompanies
    .filter(company => company.company_name.toLowerCase().includes(search.value.toLowerCase()))
    .filter(company => {
      switch (filterValue.value) {
      case -1:
        return true
      case 0:
        return !(company.verified_by_admin && company.is_declined)
      case 1:
        return company.verified_by_admin && !company.is_declined
      case 2:
        return company.verified_by_admin && company.is_declined
      default:
        return true
      }
    })
})

const computedStatus = computed(() => {
  return function(company) {
    if (company.verified_by_admin && company.is_declined) {
      return 'error'
    } else if (company.verified_by_admin && !company.is_declined) {
      return 'success'
    } else {
      return 'secondary'
    }
  }
})

const computedStatusText = computed(() => {
  return function(company) {
    if (company.verified_by_admin && company.is_declined) {
      return 'rejected'
    } else if (company.verified_by_admin && !company.is_declined) {
      return 'accepted'
    } else {
      return 'pending'
    }
  }
})

function onUpdate(company) {
  companyStore.setField(company.raw)
  modalRef.value.openAsUpdateMode()
}

async function onAccept(company) {
  swal.value.fire({
    question: "Are you sure you want to accept this company?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try
      {
        const { status: code, data: response } = await CompanyService.accept(company.id)

        if (code >= 200 && code <= 299) {
          companyStore.update(response)
          toast.success("Successfully accepted.")
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to accept company.")
      }
    })
}

async function onReject(company) {
  swal.value.fire({
    question: "Are you sure you want to reject this company?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try
      {
        const { status: code, data: response } = await CompanyService.reject(company.id)

        if (code >= 200 && code <= 299) {
          companyStore.update(response)
          toast.success("Successfully rejected")
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to reject company.")
      }
    })
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

async function onViewPartner(data) {
  localStorage.setItem('selectedPartner', JSON.stringify(data))
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await CompanyService.getAllPartnerCompanies()

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
    <PageHeader
      title="Companies"
      subtitle="List of partner companies"
      :breadcrumb="breadCrumbs"
    />
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
            md="3"
          >
            <VSelect
              v-model="filterValue"
              label="Filter"
              :items="filterItems"
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
        <template #item.operation="{ item }">
          <VChip
            :color="item.raw.status == 'active' ? 'success' : 'error'"
            text-color="white"
            rounded="sm"
          >
            {{ item.raw.status }}
          </VChip>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="computedStatus(item.raw)"
            text-color="white"
            rounded="sm"
          >
            {{ computedStatusText(item.raw) }}
          </VChip>
        </template>

        <template #item.action="{ item }">
          <RouterLink
            :to="{
              name: 'admin-companyid-companies-partnerid',
              params: {
                partnerid: helpers.security.encrypt(item.raw.id),
              },
            }"
            @click.stop="onViewPartner(item.raw)"
          >
            <VBtn
              v-if="item.raw.verified_by_admin && !item.raw.is_declined"
              icon=""
              variant="text"
              size="small"
              color="primary"
            >
              <VIcon icon="tabler-eye" />
              <VTooltip activator="parent">
                View company Job post(s)
              </VTooltip>
            </VBtn>
          </RouterLink>
          <VBtn
            v-if="!item.raw.verified_by_admin"
            icon=""
            variant="text"
            size="small"
            color="success"
            @click.stop="onAccept(item.raw)"
          >
            <VIcon icon="tabler-check" />
            <VTooltip activator="parent">
              Accept company
            </VTooltip>
          </VBtn>
          <!--  -->
          <VBtn
            v-if="!item.raw.verified_by_admin"
            icon=""
            variant="text"
            size="small"
            color="secondary"
            @click.stop="onReject(item.raw)"
          >
            <VIcon icon="tabler-x" />
            <VTooltip activator="parent">
              Reject company
            </VTooltip>
          </VBtn>
          <!--  -->
          <VBtn
            icon=""
            variant="text"
            size="small"
            color="error"
            @click.stop="onDelete(item.raw)"
          >
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">
              Delete company
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <CompanyModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    requiresAuth: true
    subject: admin
    action: read
</route>
