<script setup>
import PageHeader from '@/@core/components/PageHeader.vue';
import JobApplicationService from '@/service/job-application.service';
import useJobApplicationStore from '@/stores/job-application.store';
import { computed } from 'vue';
import { inject, onMounted } from 'vue';

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

const jobApplicationStore = useJobApplicationStore()
const search = ref('')
const loaded = ref(false)
const toast = inject('toast')

const myApplications = computed(() => {
  return jobApplicationStore.getJobApplications
    .filter(ja => ja.job_posting.position.title.toLowerCase().includes(search.value.toLowerCase()))
})

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
        </VRow>
      </VCardText>
      <AppTable 
        :headers="tableHeader"
        :items="myApplications"
        :loading="!loaded"
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
</route>
