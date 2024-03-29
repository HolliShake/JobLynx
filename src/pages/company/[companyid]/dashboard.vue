<script setup>
import { avatarText } from '@/@core/utils/formatters'
import CompanyContext from '@/context/CompanyContext.vue'
import { helpers } from '@/helpers'
import ApplicationLogService from '@/service/application-log.service'
import JobApplicationService from '@/service/job-application.service'
import useAuthStore from '@/stores/auth.store'
import useCompanyStore from '@/stores/company.store'
import useJobApplicationStore from '@/stores/job-application.store'
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const eventTableHeaders = ref([
  {
    title: "EVENT",
    key: "event_title",
  },
  {
    title: "WHEN",
    key: "when",
    value: v => helpers.formater.dateToWord(v.event_date),
  },
  {
    title: "DESCRIPTION",
    key: "event_description",
  },
])

const applicantTableHeaders = ref([
  {
    title: "APPLICANT",
    key: "user",
  },
  {
    title: "POSITION",
    key: "job_posting.position.title",
  },
  {
    title: "SKILL QUALIFICATION",
    key: "qualification",
    align: 'center',
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
])

const router = useRouter()
const companyStore = useCompanyStore()
const authStore = useAuthStore()
const jobApplicationStore = useJobApplicationStore()
const loaded = ref(false)
const events = ref([])
const eventLoaded = ref(false)
const toast = inject('toast')

const items = computed(() => {
  return jobApplicationStore.getJobApplications
})

const computedQualification = item => {
  return helpers.resolver.getQualification(
    item.raw.user.personal_data.skill.map(s => s.title.toLowerCase()),
    item.raw.job_posting.position.skills.toLowerCase(),
  )
}

const loadUpcomingEvents = async company => {
  try
  {
    const { status: code, data: response } = await ApplicationLogService.getDashboardLogsByCompanyId(company.id)

    if (code == 200) {
      console.log(response)
      events.value = response
      eventLoaded.value = true
    }
  } catch (error) {
    console.log(error)
    toast.error("Failed to load events")
  }
}

const loadApplications = async company => {
  try
  {
    const { status: code, data: response } = await JobApplicationService.getJobApplicantsByCompanyId(company.id)

    if (code == 200) {
      jobApplicationStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    console.log(error)
    toast.error("Failed to load applicants")
  }
}

async function onClickEvent(applicantRaw) {
  router.push({
    name: 'company-companyid-job-posting-jobpostingid-job-applicant-jobapplicantid',
    params: {
      jobpostingid: helpers.security.encrypt(applicantRaw.raw.job_applicant.job_posting_id),
      jobapplicantid: helpers.security.encrypt(applicantRaw.raw.job_applicant_id),
    },
    props: true,
  })
}

async function onClickApplicant(applicantRaw) {
  router.push({
    name: 'company-companyid-job-posting-jobpostingid-job-applicant-jobapplicantid',
    params: {
      jobpostingid: helpers.security.encrypt(applicantRaw.raw.job_posting_id),
      jobapplicantid: helpers.security.encrypt(applicantRaw.raw.id),
    },
    props: true,
  })
}

watch(() => companyStore.companyModel, async company => {
  await loadUpcomingEvents(company)
  await loadApplications(company)
}, { deep: true })

// 
</script>

<template>
  <CompanyContext>
    <VRow>
      <VCol cols="12">
        <VCard>
          <template #title>
            <h2 class="text-center text-md-start text-h2 font-weight-thin text-wrap">
              Welcome back to {{ companyStore.getCompanyModel.company_name }} 👋
            </h2>
          </template>
          <VCardText>
            <div class="d-flex flex-column flex-md-row flex-nowrap gap-3 align-center">
              <div 
                class="d-inline-block elevated-3 rounded-circle"
                style="border: 4px solid rgb(var(--v-theme-background));"
              >
                <VAvatar :size="$vuetify.display.mdAndDown ? 110 : 75">
                  <VImg 
                    v-if="authStore.getUserData.profile_image"
                    :src="helpers.resolver.getImagePath(authStore.getUserData.profile_image.file_name)"
                    cover
                    alt="Profile"
                  />
                  <span v-else>{{ avatarText(authStore.getUserData.FullName) }}</span>
                </VAvatar>
              </div>
              <div class="d-block text-center text-md-start">
                <h2 class="text-h2 font-weight-thin">
                  {{ authStore.getUserData.last_name }}, {{ authStore.getUserData.first_name }}
                </h2>
                <VChip
                  variant="tonal"
                  rounded="sm"
                  color="success"
                >
                  <span class="text-xs text-uppercase">{{ authStore.getUserData.gender }}</span>
                </VChip>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <template #title>
            <h4 class="text-h4 card-title">
              Upcoming Events
            </h4>
          </template>
          <AppTable 
            :headers="eventTableHeaders"
            :items="events"
            :loading="!eventLoaded"
            @click:row="onClickEvent"
          >
            <template #item.when="{ item }">
              <VChip
                color="success"
                text-color="white"
                rounded="sm"
              >
                {{ helpers.formater.dateToWord(item.raw.event_date) }}
              </VChip>
            </template>
          </AppTable>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <template #title>
            <h4 class="text-h4 card-title">
              Applicants
            </h4>
          </template>
          <AppTable 
            :headers="applicantTableHeaders"
            :items="items"
            :loading="!loaded"
            @click:row="onClickApplicant"
          >
            <template #item.user="{ item }">
              <div class="d-flex flex-row flex-nowrap gap-2 align-center">
                <div 
                  class="d-inline-block rounded-circle elevation-3"
                  style="border: 3px solid rgb(var(--v-theme-background));"
                >
                  <VAvatar
                    variant="tonal"
                    color="success"
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
                      cover
                      alt="Profile"
                    />
                  </VAvatar>
                </div>
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

            <template #item.qualification="{ item }">
              <VProgressCircular
                :model-value="computedQualification(item)"
                :color="helpers.resolver.resolveColor(computedQualification(item))"
                size="40"
              >
                <span class="text-xs">
                  {{ computedQualification(item) }}
                </span>
              </VProgressCircular>
            </template>
          </AppTable>
        </VCard>
      </VCol>
    </VRow>
  </CompanyContext>
</template>


<route lang="yaml">
  meta:
    layout: default
    subject: company
    action: read
    requiresAuth: true
</route>
