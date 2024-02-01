<script setup>
import { helpers } from '@/helpers'
import JobPostingService from '@/service/jobposting.service'
import useJobPostingStore from '@/stores/job-posting.store'
import { computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  partnerid: {
    type: String,
    required: true,
  },
})

const tableHeaders = ref([
  {
    title: 'JOB TITLE',
    key: 'position.title',
  },
  {
    title: 'DESCRIPTION',
    key: 'description', 
  },
  {
    title: 'EMPLOYMENT TYPE',
    key: 'position.employment_type',
  },
  {
    title: 'PAID',
    key: 'paid',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'ACTION',
    key: 'action',
    align: 'center',
    sortable: false,
  },
])

const filterOptions = ref([
  {
    title: 'All',
    value: -1,
  },
  {
    title: 'approved',
    value: 'approved',
  },
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Rejected',
    value: 'rejected',
  },
])

const jobPostingStore = useJobPostingStore()
const router = useRouter()
const search = ref('')
const status = ref(-1)
const itemsPerPage = ref(10)
const loaded = ref(false)
const toast = inject('toast')

const computedPartner = computed(() => {
  const data = JSON.parse(localStorage.getItem('selectedPartner'))

  if (!data.company_name || !data.id) {
    return router.back()
  }

  return data
})

const data = computed(() => {
  return jobPostingStore.getJobPostings
    .filter(item => item.position.title.toLowerCase().includes(search.value.toLowerCase()))
    .filter(item => (status.value == -1) ? true : (status.value == item.status))
})

async function onAccept(data) {
  try {
    const { status: code } = await JobPostingService.acceptJobPosting(data.id)

    if (code >= 200 && code <= 299) {
      toast.success("Successfully approved job posting.")
      jobPostingStore.update({ ...data, status: 'approved' })
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message ?? "Failed to accept job posting.")
  }
}

async function onReject(data) {
  try {
    const { status: code } = await JobPostingService.rejectJobPosting(data.id)

    if (code >= 200 && code <= 299) {
      toast.success("Successfully rejected job posting.")
      jobPostingStore.update({ ...data, status: 'rejected' })
    }

  } catch (error) {
    toast.error(error.message ?? "Failed to reject job posting.")
  }
}

async function onDelete(data) {
  try {
    const { status: code, data: response } = await JobPostingService.deleteJobPosting(data.id)

    if (code == 204) {
      toast.success("Successfully deleted job posting.")
      jobPostingStore.delete(data)
    }
  } catch (error) {
    toast.error(error.message ?? "Failed to delete job posting.")
  }
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobPostingService.getJobPostingByCompanyId(helpers.security.decrypt(props.partnerid))

    if (code == 200) {
      jobPostingStore.initialize(response)
      loaded.value = true
    }
  } catch (err) {
    toast.error(err.message ?? "Failed to fetch data.")
  }
})

// 
</script>

<template>
  <!--  -->
  <VCard>
    <VCardText class="pa-4">
      <VRow>
        <VCol
          cols="12"
          md="3"
        >
          <VTextField
            v-model="search"
            label="Search Job Post"
          />
        </VCol>
        <VCol
          cols="12"
          md="3"
        >
          <VSelect
            v-model="status"
            label="Filter Status"
            :items="filterOptions"
          />
        </VCol>
        <VCol
          cols="12"
          md="auto"
        >
          <ItemsPerPage 
            v-model="itemsPerPage"
            style="width: auto !important;"
          />
        </VCol>
      </VRow>
    </VCardText>
    <AppTable
      :headers="tableHeaders"
      :items="data"
      :items-per-page="itemsPerPage"
      :loading="!loaded"
    >
      <template #item.paid="{ item }">
        <VChip
          rounded="sm"
          :color="(item.raw.paid) ? 'success' : 'error'"
        >
          {{ item.raw.paid ? 'PAID' : 'UNPAID' }}
        </VChip>
      </template>
      <!--  -->
      <template #item.status="{ item }">
        <VChip
          rounded="sm"
          :color="(item.raw.status == 'approved') ? 'success' : (item.raw.status == 'pending') ? 'secondary' : 'error'"
        >
          {{ item.raw.status.toUpperCase() }}
        </VChip>
      </template>
      <!--  -->
      <template #item.action="{ item }">
        <RouterLink 
          v-if="item.raw.status == 'approved'"
          :to="{
            name: 'admin-companyid-companies-partnerid-applicants-jobpostingid',
            params: {
              companyid: helpers.security.encrypt(computedPartner.id),
              partnerid: helpers.security.encrypt(item.raw.id),
              jobpostingid: helpers.security.encrypt(item.raw.id),
            },
          }"
        >
          <VBtn
            icon=""
            size="small"
            variant="text"
            color="primary"
          >
            <VIcon icon="tabler-eye" />
            <VTooltip activator="parent">
              View applicants
            </VTooltip>
          </VBtn>
        </RouterLink>
        <VBtn
          v-if="item.raw.status == 'pending'"
          icon=""
          size="small"
          variant="text"
          color="success"
          @click.stop="onAccept(item.raw)"
        >
          <VIcon icon="tabler-check" />
          <VTooltip activator="parent">
            Accept JobPost
          </VTooltip>
        </VBtn>
        <VBtn
          v-if="item.raw.status == 'pending'"
          icon=""
          size="small"
          variant="text"
          color="secondary"
          @click.stop="onReject(item.raw)"
        >
          <VIcon icon="tabler-x" />
          <VTooltip activator="parent">
            Reject JobPost
          </VTooltip>
        </VBtn>
        <VBtn
          icon=""
          size="small"
          variant="text"
          color="error"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon icon="tabler-trash" />
          <VTooltip activator="parent">
            Delete JobPost
          </VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>
</template>

<route lang="yaml">
  meta:
    layout: default
    subject: admin
    action: read
    navActiveLink: admin-companyid-companies
    requiresAuth: true
</route>
