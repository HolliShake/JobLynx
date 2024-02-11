<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { helpers } from '@/helpers'
import UserService from '@/service/user.service'
import { inject } from 'vue'


const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  isModalMode: {
    type: Boolean,
    default: false,
  },
})

const modalRef = ref()
const pageData = ref({})
const loaded = ref(false)
const toast = inject('toast')

async function onOpen() {
  modalRef.value.open()

  try {
    const { status: code, data: response } = await UserService.getResumeById(props.userId)

    if (code == 200) {
      console.log(response)
      pageData.value = response
      loaded.value = true
    }
  } catch (error) {
    console.log(error)
    toast.error(error.message)
  }
}

defineExpose({
  open: onOpen,
})
</script>

<template>
  <AppFullDialog 
    ref="modalRef"
    fullscreen
    scrollable
  >
    <template
      v-if="!props.isModalMode"
      #activator="{ props }"
    >
      <VBtn
        v-bind="props"
        size="small"
        @click="onOpen"
      >
        VIEW
      </VBtn>
    </template>

    <template #header>
      <div>
        <VToolbar color="primary">
          <VBtn
            icon
            variant="plain"
            @click="$event => modalRef.close()"
          >
            <VIcon
              color="white"
              icon="tabler-x"
            />
          </VBtn>

          <VToolbarTitle>Resume</VToolbarTitle>
        </VToolbar>
      </div>
    </template>

    <template #content>
      <VSkeletonLoader v-if="!loaded" />
      <VCard
        v-else
        class="mx-auto pa-0"
        style="width:796px;height:1123px !important;"
        rounded="0"
        theme="dark"
        border
      >
        <VRow
          class="h-100"
          no-gutters
        >
          <VCol
            cols="4"
            class="h-100"
          >
            <div
              class="w-100 h-100 text-center py-5"
              style="background-color: rgb(16, 7, 49);"
            >
              <div 
                class="d-inline-block rounded-circle elevation-3"
                style="border: 3px solid #1B4242;"
              >
                <VAvatar
                  size="150"
                  variant="tonal"
                >
                  <VImg 
                    v-if="pageData.profile_image"
                    :src="helpers.resolver.getImagePath(pageData.profile_image.file_name)"
                    alt="Profile"
                    cover
                  />
                  <span 
                    v-else
                    class="text-uppercase font-weight-bold"
                  >
                    {{ avatarText(`${pageData.first_name}, ${pageData.last_name}`) }}
                  </span>
                </VAvatar>
              </div>

              <!--  -->
              <h3 class="mt-5 mb-3 text-h3 font-weight-thin text-center">
                SKILLS
              </h3>

              <ul>
                <li 
                  v-for="skill in pageData.personal_data.skill"
                  :key="`skill-${skill.id}`"
                >
                  {{ skill.title }}
                </li>
              </ul>
            </div>
          </VCol>
          <VCol
            cols="8"
            class="h-100"
          >
            <div class="d-block w-100 h-100 py-5">
              <h2 class="text-h2 font-weight-thin text-center">
                {{ pageData.first_name }} {{ pageData.last_name }}
              </h2>
              <p class="text-center text-sm font-weight-thin my-0 py-0">
                {{ pageData.address }}
                {{ pageData.country }}
              </p>
              <p class="text-center text-sm font-weight-thin my-0 py-0">
                {{ pageData.mobile_number }}
              </p>
              <!-- Parent  -->
              <div class="d-block mt-10 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-person" />
                  <h3 class="d-block">
                    PARENT
                  </h3>
                </div>
                <span class="d-block text-sm ps-3 mt-3">Mother</span>
                <span class="d-block ps-3 font-weight-bold">{{ pageData.personal_data.mother_last_name }}, {{ pageData.personal_data.mother_first_name }}, {{ pageData.personal_data.mother_middle_name }}</span>
                <span class="d-block text-sm ps-3 mt-3">Father</span>
                <span class="d-block ps-3 font-weight-bold">{{ pageData.personal_data.father_last_name }}, {{ pageData.personal_data.father_first_name }}, {{ pageData.personal_data.father_middle_name }}</span>
              </div>

              <!-- COUNTRY  -->
              <div class="d-block mt-3 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-flag" />
                  <h3>{{ pageData.personal_data.citizenship }}</h3>
                </div>
              </div>

              <!-- CITIZENT  -->
              <div class="d-block mt-3 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-church" />
                  <h3>{{ pageData.personal_data.religion }}</h3>
                </div>
              </div>
              
              <!-- Education  -->
              <div class="d-block mt-3 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-school" />
                  <h3>EDUCATIONAL BACKGROUND</h3>
                </div>
                <VCard
                  v-if="pageData.personal_data.education.length <= 0"
                  class="mt-2"
                  flat
                  border
                >
                  <VCardText class="pa-3 text-center text-sm">
                    No Education Added Yet!
                  </VCardText>
                </VCard>
                <VTimeline
                  side="end"
                  align="start"
                  line-inset="8"
                  truncate-line="both"
                  density="compact"
                  class="mt-5"
                >
                  <!--  -->
                  <VTimelineItem
                    v-for="(education, index) in pageData.personal_data?.education"
                    :key="`item-${index}`"
                    size="x-small"
                    dot-color="success"
                  >
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                      <div>
                        <span class="app-timeline-title">
                          {{ education.school_name }}
                        </span>
                        <i class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(education.start_sy) }} &nbsp;-&nbsp; {{ education.end_sy ? helpers.formater.dateToWord(education.end_sy) : "Present" }}</i>  
                      </div>
                    </div>

                    <!-- 👉 Content -->
                    <div class="app-timeline-text my-1">
                      {{ education.description }}
                    </div>
                  </VTimelineItem>
                </VTimeline>
              </div>

              <!-- Work -->
              <div class="d-block mt-10 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-account-hard-hat" />
                  <h3>WORK EXPERIENCE</h3>
                </div>
                <VCard
                  v-if="pageData.JobExperience?.length <= 0"
                  class="mt-2"
                  flat
                  border
                >
                  <VCardText class="pa-3 text-center text-sm">
                    No Job Experience Yet!
                  </VCardText>
                </VCard>

                <VTimeline
                  side="end"
                  align="start"
                  line-inset="8"
                  truncate-line="both"
                  density="compact"
                  class="mt-5"
                >
                  <!--  -->
                  <VTimelineItem
                    v-for="(work, index) in pageData.JobExperience"
                    :key="`item-${index}`"
                    size="x-small"
                    dot-color="success"
                  >
                    <!-- 👉 Header -->
                    <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
                      <div>
                        <span class="app-timeline-title">
                          {{ work.job_posting.position.title }}
                        </span>
                        <i class="d-block app-timeline-meta">{{ work.job_posting.position.company.company_name }}, {{ work.job_posting.position.office.address }} {{ work.job_posting.position.office.country }}</i>
                        <!-- <i class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(work.hired_date) }} &nbsp;-&nbsp; {{ (!work.isActive) ? helpers.formater.dateToWord(work.updated_at) : "Present" }}</i>   -->
                      </div>
                    </div>
                  </VTimelineItem>
                </VTimeline>
              </div>

              <div class="d-block mt-3 px-10">
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-gmail" />
                  <span class="text-sm font-weight-thin">{{ pageData.email }}</span>
                </div>
                <div class="d-flex flex-row align-center gap-3">
                  <VIcon icon="mdi-phone" />
                  <span class="text-sm font-weight-thin">{{ pageData.mobile_number }}</span>
                </div>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </template>
  </AppFullDialog>
</template>
