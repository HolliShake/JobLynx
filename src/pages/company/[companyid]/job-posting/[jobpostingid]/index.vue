<script setup>
import { avatarText } from '@/@core/utils/formatters';
import { helpers } from '@/helpers';
import JobApplicationService from '@/service/job-application.service';
import useJobApplicationStore from '@/stores/job-application.store';
import { computed } from 'vue';
import { inject } from 'vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  jobpostingid: {
    type: String,
    required: true
  }
})

const tableHeaders = ref([
  {
    title: "APPLICANT",
    key: "user",
  },
  {
    title: "POSITION",
    key: "job_posting.position.title",
  },
  {
    title: "QUALIFIED",
    key: "qualified",
    value:() =>  300
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
const status = ref('all')
const statusFilter = ref([
  {
    title: 'All',
    value: 'all',
  },
  {
    title: 'Pending',
    value: 'pending',
  },
  {
    title: 'Accepted',
    value: 'accepted',
  },
  {
    title: 'Rejected',
    value: 'rejected',
  }
])
const itemsPerPage = ref(10)
const loaded = ref(false)
const toast = inject('toast')

const items = computed(() => {
  return jobApplicationStore.getJobApplications
    .filter(ja => (
      (ja.job_posting.position.title.toLowerCase().includes(search.value.toLowerCase())) ||
      ((`${ja.user.last_name}, ${ja.user.first_name}`).toLowerCase().includes(search.value.toLowerCase()))
    ))
    .filter(ja => (status.value == 'all') ? true : ja.status == status.value)
})

async function onView(data) {
  router.push({
    name: 'company-companyid-job-posting-jobpostingid-job-applicant-jobapplicantid',
    params: {
      jobapplicantid: helpers.security.encrypt(data.raw.id)
    },
    props: true,
  })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.getJobApplicantsByJobPostingId(helpers.security.decrypt(props.jobpostingid))

    if (code == 200) {
      jobApplicationStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error("Failed to load job applicants")
  }
})

// 
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol cols="12" md="4">
            <VTextField 
              v-model="search"
              label="Search position or applicant"
            />
          </VCol>
          <VCol cols="12" md="3">
            <VSelect
              v-model="status"
              label="Filter by status"
              :items="statusFilter"
              outlined
            />
          </VCol>
          <VCol cols="12" md="auto">
            <ItemsPerPage 
              v-model="itemsPerPage"
              style="width: auto;"
            />
          </VCol>
        </VRow>
      </VCardText>
      <!--  -->
      <AppTable 
        :headers="tableHeaders"
        :items="items"
        :loading="!loaded"
        :items-per-page="itemsPerPage"
        @click:row="onView"
      >
        <template #item.user="{ item }">
          <div class="d-flex flex-row flex-nowrap gap-2 align-center">
            <VAvatar
              variant="elevated"
            >
              <span 
                v-if="!item.raw.user.profile_image"
                class="text-uppercase font-weight-bold"
              >
                {{ avatarText(`${item.raw.user.last_name}, ${item.raw.user_first_name}`) }}
              </span>
              <VImg 
                v-else
                :src="helpers.resolver.getImagePath(item.raw.user.profile_image.file_name)"
                alt="Profile"
              />
            </VAvatar>
            <span class="font-weight-bold text-sm">{{ item.raw.user.last_name }}, {{ item.raw.user.first_name }}</span>
          </div>
        </template>

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
    navActiveLink: company-companyid-job-posting
</route>
