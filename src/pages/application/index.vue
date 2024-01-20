<script setup>
import PageHeader from '@/@core/components/PageHeader.vue'
import { helpers } from '@/helpers'
import JobApplicationService from '@/service/job-application.service'
import useJobApplicationStore from '@/stores/job-application.store'
import { computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const breadCrumb = ref([
  {
    text: 'Dashboard',
    active: false,
    href: '/dashboard',
  },
  {
    text: 'My Applications',
    active: true,
    href: '#',
  },
])

const tableHeader = ref([
  {
    title: "POSITION",
    key: "job_posting.position.title",
    width: '100%',
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
  {
    title: "ACTION",
    key: "action",
    sortable: false,
  },
])

const router = useRouter()
const jobApplicationStore = useJobApplicationStore()
const search = ref('')
const itemsPerPage = ref(10)
const loaded = ref(false)
const toast = inject('toast')

const myApplications = computed(() => {
  return jobApplicationStore.getJobApplications
    .filter(ja => ja.job_posting.position.title.toLowerCase().includes(search.value.toLowerCase()))
})

async function onCancel(application) {
  try {
    const { status: code } = await JobApplicationService.cancel(application.id)

    if (code == 204) {
      toast.success("Application cancelled.")
      jobApplicationStore.delete(application)
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to cancel application.")
  }
}

async function onVisit(application) {
  router.push({
    name: 'application-jobapplicationid',
    params: {
      jobapplicationid: helpers.security.encrypt(application.raw.id),
    },
    props: true,
  })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.myJobApplications()

    if (code == 200) {
      console.log(response)
      jobApplicationStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error("Failed to load application data.")
  }
})

// 
</script>

<template>
  <section>
    <PageHeader 
      title="My Applications" 
      subtitle="Manage your applications here."
      :breadcrumb="breadCrumb"
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
              label="Search"
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
        :items="myApplications"
        :loading="!loaded"
        :items-per-page="itemsPerPage"
        @click:row="onVisit"
      >
        <template #item.status="{ item }">
          <VChip
            :color="item.raw.status == 'pending' ? 'warning' : item.raw.status == 'accepted' ? 'success' : 'error'"
            text-color="white"
            rounded="sm"
          >
            {{ item.raw.status.toUpperCase() }}
          </VChip>
        </template>

        <template #item.action="{ item }">
          <VBtn
            icon=""
            :color="(item.raw.status == 'pending') ? 'success' : 'error'"
            variant="text"
            size="small"
            @click.stop="() => (item.raw.status == 'pending') ? onCancel(item.raw) : onVisit(item)"
          >
            <VIcon :icon="(item.raw.status == 'pending') ? 'tabler-location-cancel' : 'tabler-eye'" />
            <VTooltip activator="parent">
              {{ (item.raw.status == 'pending') ? 'Cancel' : 'View' }}
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    subject: user
    action: read
    requiresAuth: true
</route>
