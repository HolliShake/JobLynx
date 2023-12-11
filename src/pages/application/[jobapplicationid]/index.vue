<script setup>
import { helpers } from '@/helpers';
import JobApplicationService from '@/service/job-application.service';
import RatingService from '@/service/rating.service';
import { inject } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
  jobapplicationid: {
    type: String,
    required: true
  }
})

const pageData = ref({})
const comments = ref([])
const loaded = ref(false)
const commentLoaded = ref(false)
const commentForm = ref({
  rating: 1,
  comment: ""
})

const toast = inject('toast')

const loadComments = async () => {
  try {
    const { status: code, data: response } = await RatingService.getMyRatingByCompanyId(pageData.value.job_posting.position.company_id)

    if (code == 200) {
      console.log(">>", response);
      comments.value = response
      commentLoaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load comments.")
  }
}

async function onComment() {
  try {
    const { status: code, data: response } = await RatingService.submitMyComment({
      ...commentForm.value,
      company_id: pageData.value.job_posting.position.company_id
    })

    if (code == 201) {
      toast.success("Comment submitted.")
      await loadComments()
      commentForm.value = {
        rating: 1,
        comment: ""
      }
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to comment.")
  }
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.getById(helpers.security.decrypt(props.jobapplicationid))

    if (code == 200) {
      console.log(response);
      pageData.value = response
      loaded.value = true
      await loadComments()
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load application data.")
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
                    <h3 class="text-white">{{ pageData.job_posting.position.title }}</h3>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12" class="py-0">
                <div class="d-inline">
                  <VIcon 
                    icon="tabler-map-pin-filled" 
                    size="18" 
                    color="error"
                  />
                  <span class="text-body-1">{{ pageData.job_posting.position.office.address }}, {{ pageData.job_posting.position.office.country }} ({{ pageData.job_posting.position.employment_type }})</span>

                  &nbsp; <span v-if="!pageData.job_posting.is_hide_company_info">Posted by {{ pageData.job_posting.position.company.company_name }}</span>
                </div>
              </VCol>
              <VCol cols="12" class="py-0" />
              <VCol 
                cols="12" 
                md="6"
                class="mt-10"
              >
                <h4 class="text-h4 font-weight-thin mb-3">Description</h4>
                <p>
                  {{ pageData.job_posting.description }}
                </p>
              </VCol>
              <VCol cols="12" class="py-0" />
              <VCol 
                cols="12" 
                md="6"
                class="mt-10"
              >
                <h4 class="text-h4 font-weight-thin mb-3">Skills Required</h4>

                <VList>
                  <VListItem
                    v-for="item in pageData.job_posting.position.skills.split(' ')" 
                    :key="`skill-${item.id}`"
                  >
                    <template #prepend>
                      <VIcon icon="mdi-circle" size="9" />
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
                <h4 class="text-h4 font-weight-thin mb-3">Sample Photos</h4>
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
                      :src="helpers.resolver.getImagePath(item.file_name)"
                      cover
                      :style=" (index < (pageData.job_posting.sample_photos.slice(1, 4).length - 1)) ? 'border-right: 4px solid rgb(var(--v-theme-background));' : ''"
                    />
                  </div>
                </VCard>
              </VCol>
              <VCol cols="12" class="py-0" />
              <!-- Timeline -->
              <VCol cols="12">
                <h4 class="text-h3 font-weight-thin mb-4">Events</h4>

                <VCard
                  v-if="pageData.application_logs.length <= 0"
                  flat
                  border
                >
                  <VCardText 
                    class="pa-4 text-center"
                  >
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
                    </div>

                    <!-- 👉 Content -->
                    <div class="app-timeline-text mt-1">
                      {{ log.event_description }}
                    </div>
                  </VTimelineItem>
                </VTimeline>
              </VCol>
              <!--  -->
              <template v-if="!commentLoaded">
                <VCol cols="12" class="mt-10">
                  <h4 class="text-h4 font-weight-thin mb-3">Comments</h4>
                </VCol>
                <VCol 
                  v-for="item in 3"
                  :key="`item-${item.id}`"
                  cols="12"
                  md="4"
                >
                  <VSkeletonLoader 
                    type="card"
                    :loading="!commentLoaded"
                  />
                </VCol>
              </template>
              <template v-else>
                <VCol cols="12" class="mt-10">
                  <h4 class="text-h4 font-weight-thin mb-3">Comments</h4>
                </VCol>
                <VCol 
                  v-if="comments.length <= 0"
                  cols="12"
                >
                  <VCard
                    color="rgb(var(--v-theme-background))"
                    border
                    flat
                  >
                    <VCardText class="text-center">
                        <VIcon 
                          icon="mdi-ghost"
                          size="90"
                        />
                      <span class="d-block mt-10 font-weight-bold text-h4">
                        No Review Or Comments Yet.
                      </span>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol
                  v-else
                  v-for="item in comments"
                  :key="`comment-${item.id}`"
                  cols="12"
                  md="4"
                >
                  <VCard border flat>
                    <VCardText class="pa-4">
                      <div class="d-flex flex-row flex-nowrap gap-2 align-center">
                        <div class="d-inline elevation-2"
                          style="border: 2px solid #fff;border-radius: 360px;"
                        >
                          <VAvatar
                            variant="tonal"
                            color="mgreen"
                          >
                            <span v-if="!item.user.profile_image">{{ avatarText(`${item.user.last_name}, ${item.user.first_name}`) }}</span>
                            <VImg
                              v-else
                              cover
                              :src="helpers.resolver.getImagePath(item.user.profile_image.file_name)"
                            />
                          </VAvatar>
                        </div>
                        
                        <div>
                          <span class="d-block font-weight-bold">{{ item.user.last_name }}, {{ item.user.first_name }}</span>
                          <div class="d-flex flex-row flex-nowrap gap-1 mt-n1">
                            <VIcon
                              v-for="i in item.rating"
                              :key="`rating-${i}`" 
                              icon="tabler-star-filled" 
                              size="12"
                              color="warning"
                            />
                            <VIcon
                              v-for="i in (5 - item.rating)"
                              :key="`rating-${i}`" 
                              icon="tabler-star" 
                              size="12"
                              color="warning"
                            />
                          </div>
                        </div>
                      </div>
                      <p class="mt-3">
                        {{ item.comment }}
                      </p>
                    </VCardText>
                  </VCard>
                </VCol>
              </template>
              <!--  -->
              <VCol cols="12"
              >
                <VDivider />
              </VCol>
              <!--  -->
              <VCol 
                cols="12"
                md="6"
                offset="0"
                offset-md="3"
              >
                <VCard
                  color="rgb(var(--v-theme-background))"
                >
                  <template #title>
                    <h4 class="text-h4 font-weight-thin mb-3">Leave a comment</h4>
                  </template>
                  <VCardText>
                    <VTextarea
                      v-model="commentForm.comment"
                      label="Description"
                      :rows="4"
                      :max-rows="8"
                      auto-grow
                    />
                    <VRadioGroup
                      inline
                      class="mt-5"
                      v-model="commentForm.rating"
                    >
                      <VRadio 
                        v-for="item in 5"
                        :key="`rating-${item}`"
                        density="compact"
                        :value="item"
                      >
                        <template #label>
                          <VIcon 
                            v-for="i in item"
                            icon="tabler-star-filled"
                            size="12"
                            color="warning"
                          />

                          <VIcon 
                            v-for="i in (5 - item)"
                            icon="tabler-star"
                            size="12"
                          />
                        </template>
                      </VRadio>
                    </VRadioGroup>

                    <div class="mt-5">
                      <VBtn
                        variant="elevated"
                        block
                        color="success"
                        @click="onComment"
                      >
                        COMMENT
                      </VBtn>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    navActiveLink: application
    requiresAuth: true
</route>
