<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { helpers } from '@/helpers'
import ApplicationLogService from '@/service/application-log.service'
import JobApplicationService from '@/service/job-application.service'
import EventModal from '@/views/pages/company/EventModal.vue'
import UserResumeModal from '@/views/pages/profile/UserResumeModal.vue'
import { merge } from "lodash"
import { inject, onMounted } from 'vue'

const props = defineProps({
  jobapplicantid: {
    type: String,
    required: true,
  },
})

const modalRef = ref()
const pageData = ref({})
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

async function onApprove() {
  try {
    const { status: code, data: response } = await JobApplicationService.approve(helpers.security.decrypt(props.jobapplicantid))

    if (code == 204) {
      toast.success("Job application approved.")
      pageData.value.status = 'accepted'
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to approve job application.")
  }
}

async function onReject() {
  try {
    const { status: code, data: response } = await JobApplicationService.reject(helpers.security.decrypt(props.jobapplicantid))

    if (code == 204) {
      toast.success("Job application rejected.")
      pageData.value.status = 'rejected'
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to reject job application.")
  }
}

// ========================

async function onCreateEvent() {
  modalRef.value.open(helpers.security.decrypt(props.jobapplicantid))
}

function created(data) {
  pageData.value.application_logs.push(data)
}

async function onUpdateEvent(applicationLog) {
  modalRef.value.openAsUpdateMode(applicationLog)
}

function updated(data) {
  merge(
    pageData.value.application_logs.find(log => log.id == data.id),
    data,
  )
}

async function onDeleteEvent(applicationLog) {
  swal.value.fire({
    question: "Are you sure you want to delete this event?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response } = await ApplicationLogService.deleteLog(applicationLog.id)

        if (code == 204) {
          toast.success("Event deleted.")
          pageData.value.application_logs = pageData.value.application_logs.filter(log => log.id != applicationLog.id)
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete event.")
      }
    })
}

async function submitScore(applicationLog) {
  try {
    const { status: code, data: response } = await ApplicationLogService.score(applicationLog.id, {
      id: applicationLog.id,
      score: applicationLog.score,
    })

    if (code == 200) {
      toast.success("Score updated.")
      merge(
        pageData.value.application_logs.find(log => log.id == applicationLog.id),
        response,
      )
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.getById(helpers.security.decrypt(props.jobapplicantid))

    if (code == 200) {
      console.log(response)
      pageData.value = response
      loaded.value = true
    }
  } catch (error) {
    console.error(error)
  }
})

// 
</script>

<template>
  <template v-if="!loaded">
    <div>
      <VRow>
        <VCol cols="12">
          <VSkeletonLoader 
            type="card"
            :loading="true"
          />
        </VCol>
        <VCol cols="12">
          <VSkeletonLoader 
            type="article"
            :loading="true"
          />
        </VCol>
        <VCol cols="12">
          <VSkeletonLoader 
            type="button"
            :loading="true"
          />
        </VCol>
        <VCol 
          v-for="item in 3"
          :key="`item-${item.id}`"
          cols="12"
          md="4"
        >
          <VSkeletonLoader 
            type="card"
            :loading="true"
          />
        </VCol>
        <VCol cols="12">
          <VSkeletonLoader 
            type="list-item"
            :loading="true"
          />
        </VCol>
      </VRow>
    </div>
  </template>
  <section v-else>
    <VRow>
      <VCol 
        cols="12"
        md="auto"
      >
        <VCard>
          <VCardText class="pa-4 px-6">
            <div class="d-flex flex-row gap-3 align-center">
              <div 
                class="d-inline elevated-3 rounded-circle"
                style="border: 3px solid rgb(var(--v-theme-background));"
              >
                <VAvatar size="64">
                  <h3 v-if="!pageData.user.profile_image">
                    {{ avatarText(`${pageData.user.last_name}, ${pageData.user.first_name}`) }}
                  </h3>
                  <VImg
                    v-else
                    cover
                    :src="helpers.resolver.getImagePath(pageData.user.profile_image.file_name)"
                  />
                </VAvatar>
              </div>
              <div>
                <h2>{{ pageData.user.last_name }}, {{ pageData.user.first_name }}</h2>
                <div class="d-flex flex-row flex-nowrap gap-2">
                  <VChip
                    color="success"
                    rounded="sm"
                  >
                    <span class="text-sm">Applicant</span>
                  </VChip>
                  <!--  -->
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex flex-row gap-2">
              <div class="d-flex flex-row flex-nowrap align-center">
                <VProgressCircular 
                  :model-value="helpers.resolver.getQualification(
                    pageData.user.personal_data.skill.map(s => s.title.toLowerCase()),
                    pageData.job_posting.position.skills.toLowerCase()
                  )"
                  size="30"
                  :color="helpers.resolver.resolveColor(helpers.resolver.getQualification(
                    pageData.user.personal_data.skill.map(s => s.title.toLowerCase()),
                    pageData.job_posting.position.skills.toLowerCase()
                  ))"
                >
                  <small class="text-xs">
                    {{
                      helpers.resolver.getQualification(
                        pageData.user.personal_data.skill.map(s => s.title.toLowerCase()),
                        pageData.job_posting.position.skills.toLowerCase()
                      )
                    }}
                  </small>
                </VProgressCircular>

                <span class="d-block ms-2 font-weight-bold">QUALIFIED</span>
              </div>
              <UserResumeModal :user-id="pageData.user.id" />
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard 
          flat
          rounded="0"
        >
          <VImg 
            :src="helpers.resolver.getImagePath(pageData.job_posting.banner.file_name)" 
            alt="Banner"
            cover
            :max-height="430"
            eager
          />
          <VCardText>
            <VRow>
              <VCol cols="auto">
                <VCard 
                  rounded="0" 
                  flat
                  color="mgreen"
                >
                  <VCardText class="pa-3">
                    <h3 class="text-white">
                      {{ pageData.job_posting.position.title }}
                    </h3>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol
                cols="12"
                class="py-0"
              >
                <div class="d-inline">
                  <VIcon 
                    icon="tabler-map-pin-filled" 
                    size="18" 
                    color="error"
                  />
                  <span class="text-body-1">{{ pageData.job_posting.position.office.address }}, {{ pageData.job_posting.position.office.country }} ({{ pageData.job_posting.position.employment_type }})</span>
                </div>
              </VCol>
              <VCol
                cols="12"
                class="py-0"
              />
              <VCol 
                cols="12" 
                md="6"
                class="mt-10"
              >
                <h4 class="text-h4 font-weight-thin mb-3">
                  Description
                </h4>
                <p>
                  {{ pageData.job_posting.description }}
                </p>
              </VCol>
              <VCol
                cols="12"
                class="py-0"
              />
              <VCol 
                cols="12" 
                md="6"
                class="mt-10"
              >
                <h4 class="text-h4 font-weight-thin mb-3">
                  Skills Required
                </h4>

                <VList>
                  <VListItem
                    v-for="item in pageData.job_posting.position.skills.split(' ')" 
                    :key="`skill-${item.id}`"
                  >
                    <template #prepend>
                      <VIcon
                        icon="mdi-circle"
                        size="9"
                      />
                    </template>
                    <VListItemTitle>{{ item }}</VListItemTitle>
                  </VListItem>
                </VList>
              </VCol>
              <VCol 
                v-if="pageData.job_posting.sample_photos.length > 0"
                cols="12" 
                md="4"
                offset="0"
                offset-md="1"
                class="mt-10"
              >
                <h4 class="text-h4 font-weight-thin mb-3">
                  Sample Photos
                </h4>
                <VCard
                  style="border: 4px solid rgb(var(--v-theme-background));"
                  rounded="xl"
                  border
                >
                  <VImg 
                    :src="helpers.resolver.getImagePath(pageData.job_posting.sample_photos[0].file_name)"
                    cover
                  />
                  <div 
                    v-if="pageData.job_posting.sample_photos.length > 1" 
                    class="d-flex flex-row flex-nowrap w-100"
                    style="border-top: 4px solid rgb(var(--v-theme-background));"
                  >
                    <VImg
                      v-for="(item, index) in pageData.job_posting.sample_photos.slice(1, 4)"
                      :width="`calc(100% / ${pageData.job_posting.sample_photos.length - 1})`"
                      :src="helpers.resolver.getImagePath(pageData.job_posting.sample_photos[index].file_name)"
                      cover
                      :style=" (index < (pageData.job_posting.sample_photos.slice(1, 4).length - 1)) ? 'border-right: 4px solid rgb(var(--v-theme-background));' : ''"
                    />
                  </div>
                </VCard>
              </VCol>          
              <VCol 
                cols="12"
                class="py-0"
              />
              <!-- Timeline -->
              <VCol cols="12">
                <div class="d-flex flex-row flex-nowrap w-100 align-center justify-space-between">
                  <h4 class="text-h3 font-weight-thin mb-4">
                    Events
                  </h4>
                  <VBtn
                    size="small"
                    @click="onCreateEvent"
                  >
                    <VIcon 
                      start
                      icon="tabler-location-plus"
                    />
                    CREATE EVENT
                  </VBtn>
                </div>

                <VCard
                  v-if="pageData.application_logs.length <= 0"
                  flat
                  border
                >
                  <VCardText class="pa-4 text-center">
                    No Events Found.
                  </VCardText>
                </VCard>
                <VTimeline
                  v-else
                  side="end"
                  align="start"
                  line-inset="8"
                  truncate-line="both"
                  density="compact"
                >
                  <!--  -->
                  <VTimelineItem
                    v-for="(log, index) in pageData.application_logs"
                    :key="`item-${index}`"
                    size="x-small"
                    dot-color="success"
                  >
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                      <div>
                        <span class="app-timeline-title text-uppercase">
                          {{ log.event_title }}
                        </span>
                        <i class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(log.event_date) }}</i>  
                      </div>

                      <div class="d-flex flex-row gap-1 align-center">
                        <VBtn
                          icon=""
                          variant="text"
                          size="x-small"
                          color="success"
                          @click.stop="$event => onUpdateEvent(log)"
                        >
                          <VIcon icon="tabler-edit" />
                        </VBtn>
                        <VBtn
                          icon=""
                          variant="text"
                          size="x-small"
                          color="error"
                          @click.stop="$event => onDeleteEvent(log)"
                        >
                          <VIcon icon="tabler-trash" />
                        </VBtn>
                      </div>
                    </div>

                    <!-- 👉 Content -->
                    <div class="app-timeline-text mt-1">
                      {{ log.event_description }}
                    </div>

                    <!--  -->
                    <div 
                      class="d-flex flex-row flex-nowrap align-center gap-2 py-3"
                      style="min-width: 150px !important; width: fit-content;"
                    >
                      <VTextField 
                        v-model="log.score"
                        label="Score"
                      />
                      <VBtn
                        icon=""
                        rounded="lg"
                        size="small"
                        @click="submitScore(log)"
                      >
                        <VIcon icon="mdi-paper-plane" />
                        <VTooltip activator="parent">
                          Update Score
                        </VTooltip>
                      </VBtn>
                    </div>
                  </VTimelineItem>
                </VTimeline>
              </VCol>
              <VCol 
                cols="12" 
                md="auto"
              >
                <div 
                  v-if="pageData.status == 'pending'"
                  class="d-flex flex-column flex-md-row flex-nowrap gap-3"
                >
                  <VBtn
                    color="success"
                    rounded="sm"
                    :block="$vuetify.display.mdAndDown"
                    @click="onApprove"
                  >
                    <VIcon 
                      start
                      icon="mdi-check-circle"
                    />
                    Approve
                  </VBtn>

                  <VBtn
                    rounded="sm"
                    color="error"
                    :block="$vuetify.display.mdAndDown"
                    @click="onReject"
                  >
                    <VIcon 
                      start
                      icon="mdi-close-circle"
                    />
                    Reject
                  </VBtn>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <EventModal 
      ref="modalRef"
      @create="created"
      @update="updated"
    />
  </section>
</template>

<route lang="yaml">
  meta:
    subject: admin
    action: read
    navActiveLink: admin-companyid-companies
    requiresAuth: true
</route>
