<script setup>
import JobPostingService from '@/service/jobposting.service';
import JobPostingModal from './JobPostingModal.vue';
import useJobPostingStore from '@/stores/job-posting.store';
import { helpers } from '@/helpers';

const companyContext = inject('companyContext')
const jobPostingStore = useJobPostingStore()
const search = ref('')
const options = ref({
  itemsPerPage: 10,
  page: 1,
})

const modalRef = ref()
const toast = inject('toast')
const swal = inject('swal')

const items = computed(() => {
  return jobPostingStore.getJobPostings
    .filter(jp => jp.position.title.toLowerCase().includes(search.value.toLowerCase()))
    .filter(jp => {
      const date = new Date(Date.parse(jp.date_posted))
      date.setDate(date.getDate() + jp.adtype.duration)

      const now = new Date(Date.now())

      return date.getTime() >= now.getTime()
    })
})

async function onCreate() {
  modalRef.value.open()
}

async function onDelete(jobPosting) {
  swal.value.fire({
    question: 'Are you sure you want to delete this job posting?',
    dangerMode: true,
  })
  .then(async (result) => {
    if (!result) return

    try {
      const { status: code } = await JobPostingService.deleteJobPosting(jobPosting.id)

      if (code == 204) {
        toast.success("Job posting deleted successfully.")
        jobPostingStore.delete(jobPosting)
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to delete job posting.")
    }
  })
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await JobPostingService.getJobPostingByCompanyId(companyContext.value.id)

    if (code == 200) {
      console.log(response);
      jobPostingStore.initialize(response)
    }

  } catch (error) {
    toast.error("Failed to load job posting data.")
  }
})

// 
</script>

<template>
  <VCardText>
    <VRow>
      <VCol 
        cols="12" 
        md="4"
      >
        <VTextField 
          v-model="search"
          label="Search Posted Job"
        />
      </VCol>
      <VCol 
        cols="12" 
        md="auto"
      >
        <ItemsPerPage
          v-model="options.itemsPerPage"
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
          CREATE A JOB AD
        </VBtn>
      </VCol>
      <VCol 
        cols="12"
        class="py-0"
      />
      <VCol 
        v-for="jp in items"
        cols="12"
        md="4"
      >
        <VCard
          flat
          style="background-color: rgb(var(--v-theme-background));"
        >
          <VImg 
            v-if="jp.banner" 
            :src="helpers.resolver.getImagePath(jp.banner.file_name)"
            cover
            :max-height="207.48"
          />
          <VCardText>
            <VRow>
              <VCol cols="12">
                <div class="d-flex flex-row flex-nowrap w-100 align-center justify-space-between">
                  <h3>{{ jp.position.title }}</h3>

                  <VBtn
                    icon=""
                    size="small"
                    rounded="sm"
                    density="compact"
                    color="secondary"
                    variant="text"
                    @click="modalRef.openAsUpdateMode(jp)"
                  >
                    <VIcon  
                      icon="tabler-edit"
                    />
                  </VBtn>
                </div>
                <VChip
                  variant="tonal"
                  color="success"
                  rounded="sm"
                >
                  {{ jp.position.salary.currency }} {{ helpers.formater.numberToMoney(jp.position.salary.value) }}
                </VChip>
                <VChip
                  class="ms-2"
                  variant="tonal"
                  color="primary"
                  rounded="sm"
                >
                  {{ jp.adtype.type }}
                </VChip>
              </VCol>
              <VCol cols="12" class="py-0">
                <VChip
                  :color="jp.paid ? 'success' : 'error'"
                  rounded="pill"
                  size="small"
                >
                  <small class="text-xs">{{ jp.paid ? 'paid' : 'unpaid' }}</small>
                </VChip>
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-row align-center gap-2">
                  <VBtn
                    size="small"
                    color="success"
                    @click="onDelete(jp)"
                  >
                    <VIcon 
                      start 
                      icon="tabler-users-group"
                    />
                    View applicant
                  </VBtn>

                  <VBtn
                    size="small"
                    color="error"
                    @click="onDelete(jp)"
                  >
                    <VIcon 
                      start 
                      icon="tabler-trash"
                    />
                    Delete
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </VCardText>

  <Teleport to="#app">
    <JobPostingModal
      ref="modalRef" 
    />
  </Teleport>
</template>
