<script setup>
import { avatarText } from '@/@core/utils/formatters';
import { helpers } from '@/helpers';
import Footer from '@/layouts/components/Footer.vue';
import JobApplicationService from '@/service/job-application.service';
import JobPostingService from '@/service/jobposting.service';
import RatingService from '@/service/rating.service';
import { inject } from 'vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const router = useRouter()
const route = useRoute()
const pageData = ref({})
const comments = ref([])
const myPending = ref([])
const pendingLoaded = ref(false)
const loaded = ref(false)
const toast = inject('toast')


const getMyApplication = async () => {
  try {

    const { status: code, data: response } = await JobApplicationService.myPendingJobApplicationsByJobPostingId(helpers.security.decrypt(props.id))

    if (code == 200) {
      myPending.value = response
      pendingLoaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load application data.")
  }
}

const hasApplied = computed(() => {
  if (!pendingLoaded.value) return true

  return myPending.value.length > 0
})

watch(pageData, async (value) => {
  if (value.is_hide_company_info) return

  try
  {
    const { status: code, data: response } = await RatingService.getSampleRatingByCompanyId(value.position.company_id)

    if (code == 200) {
      comments.value = response
    }
  } catch (error) {
    console.error(error)
  }
}, { deep: true })

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await JobPostingService.getJobPostingById(helpers.security.decrypt(props.id))

    if (code == 200) {
      await getMyApplication()
      pageData.value = response
      loaded.value = true

      console.log(response);
    }
  } catch (error) {
    console.error(error)
  }
})

async function onApply() {
  try
  {
    const data = await JobApplicationService.applyJobPost(pageData.value.id)
    if (!data)
    {
      return  router.push({
        name: 'login',
        query: {
          to: route.fullPath
        }
      })
    }
    const { status: code, data: response } = data

    if (code == 204) {
      toast.success('Successfully applied to this job post.')
    }
  } catch (error) {
    console.error(">>>>>", error)

    if (error.status == 401) {
      router.push({
        name: 'login'
      })
    }
  }
}

async function onVisitApplication() {
  if (myPending.value.length <= 0) return

  router.push({
    name: 'application-jobapplicationid',
    params: {
      jobapplicationid: helpers.security.encrypt(myPending.value[0].id)
    },
    props: true
  })
}

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
            :src="helpers.resolver.getImagePath(pageData.banner.file_name)" 
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
                    <h3 class="text-white">{{ pageData.position.title }}</h3>
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
                  <span class="text-body-1">{{ pageData.position.office.address }}, {{ pageData.position.office.country }} ({{ pageData.position.employment_type }})</span>
                
                  &nbsp; <span v-if="!pageData.is_hide_company_info">Posted by <RouterLink :to="{ name: 'browse-company-id', params: { id: helpers.security.encrypt( pageData.position.company.id) }, props: true }">{{ pageData.position.company.company_name }}</RouterLink></span>
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
                  {{ pageData.description }}
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
                    v-for="item in pageData.position.skills.split(' ')" 
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
                v-if="pageData.sample_photos.length > 0"
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
                    :src="helpers.resolver.getImagePath(pageData.sample_photos[0].file_name)"
                    cover
                  />
                  <div 
                    v-if="pageData.sample_photos.length > 1" 
                    class="d-flex flex-row flex-nowrap w-100"
                    style="border-top: 4px solid rgb(var(--v-theme-background));"
                  >
                    <VImg
                      v-for="(item, index) in pageData.sample_photos.slice(1, 4)"
                      :width="`calc(100% / ${pageData.sample_photos.length - 1})`"
                      :src="helpers.resolver.getImagePath(pageData.sample_photos[index].file_name)"
                      cover
                      :style=" (index < (pageData.sample_photos.slice(1, 4).length - 1)) ? 'border-right: 4px solid rgb(var(--v-theme-background));' : ''"
                    />
                  </div>
                </VCard>
              </VCol>
              <VCol cols="12" class="py-0" />
              <VCol 
                cols="12" 
                md="6"
              >
                <div class="d-inline text-end">
                  <span class="text-h4 font-weight-thin">{{ pageData.position.salary.currency }} {{ helpers.formater.numberToMoney(pageData.position.salary.value) }}</span> / <span>{{ pageData.position.payment_type }}</span>
                </div>
              </VCol>
              <VCol cols="12" class="py-0" />
              <VCol cols="12" md="auto">
                <VBtn
                  v-if="hasApplied"
                  block
                  color="mgreen"
                  rounded="sm"
                  @click="onVisitApplication"
                >
                  View Application Status
                </VBtn>
                <VBtn
                  v-else
                  block
                  color="mgreen"
                  rounded="sm"
                  @click="onApply"
                  :disabled="hasApplied"
                >
                  Apply Now
                </VBtn>
              </VCol>
              <template v-if="comments.length > 0">
                <VCol cols="12" class="mt-10">
                  <h4 class="text-h4 font-weight-thin mb-3">Comments</h4>
                </VCol>
                <VCol 
                  v-if="comments.length <= 0"
                  cols="12"
                >
                  <VCard
                    color="rgb(var(--v-theme-background))"
                    flat
                    border
                  >
                    <VCardText class="text-center">
                      No Rating/Comments Yet.
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
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VContainer>
      <Footer />
    </VContainer>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
</route>
