<script setup>
import PageHeader from '@/@core/components/PageHeader.vue';
import { helpers } from '@/helpers';
import JobApplicationService from '@/service/job-application.service';
import useJobApplicationStore from '@/stores/job-application.store';
import { computed } from 'vue';
import { inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const breadCrumb = ref([
  {
    text: 'Dashboard',
    active: false,
    href: '/dashboard'
  },
  {
    text: 'My Applications',
    active: true,
    href: '#'
  }
])

const tableHeader = ref([
  {
    title: "POSITION",
    key: "job_posting.position.title",
    width: '100%'
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  }
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

async function onVisit(application) {
  router.push({
    name: 'application-jobapplicationid',
    params: {
      jobapplicationid: helpers.security.encrypt(application.raw.id)
    },
    props: true
  })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.myJobApplications()

    if (code == 200) {
      console.log(response);
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
      </AppTable>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    requiresAuth: true
</route>
