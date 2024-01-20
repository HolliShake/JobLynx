<script setup>
import { helpers } from "@/helpers"
import Footer from "@/layouts/components/Footer.vue"
import CompanyService from "@/service/company.service"
import JobPostingService from "@/service/jobposting.service"
import useAuthStore from "@/stores/auth.store"
import useCompanyStore from "@/stores/company.store"
import useJobPostingStore from "@/stores/job-posting.store"
import CompanyCard from "@/views/pages/global/CompanyCard.vue"
import EmptyJobPost from "@/views/pages/global/EmptyJobPost.vue"
import JobPostingCard from "@/views/pages/global/JobPostingCard.vue"
import Design from "@images/download/Design.jpg"
import Writer from "@images/download/Writer.png"
import Meeting from "@images/download/meeting.jpg"
import { inject, onMounted } from "vue"


const authStore = useAuthStore()
const jobPostingStore = useJobPostingStore()
const companyStore = useCompanyStore()
const searchQuery = ref('')
const stars = ref(-1)
const featured = ref(false)
const recommended = ref(false)

const slides = ref([
  Meeting,
  Design,
  Writer,
])

const jobPostingLoaded = ref(false)
const toast = inject('toast')




// 

function isRecommended(data) {
  if (!recommended.value) return true

  // Always return true if not logged In
  if (!authStore.isLoggedIn) return true

  // Logged In
  if (!authStore.isAccountsetuped) return true

  const tresh = parseInt(import.meta.env.VITE_APP_RECOMMENDATION_TRESHOLD)

  const myQualification = helpers.resolver.getQualification(
    authStore.getUserData.personal_data.skill.map(s => s.title.toLowerCase()),
    data.position.skills.toLowerCase(),
  )

  return myQualification >= tresh
}

const jobPostings = computed(() => {
  return jobPostingStore.getJobPostings
    .filter(jp => jp.position.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(jp => (stars.value == -1) ? true : (jp.position.company.average == stars.value))
    .filter(jp => (!featured.value) ? true : (jp.adtype.is_featured == featured.value))
    .filter(jp => isRecommended(jp))
})

const loadSampleJobPosting = async () => {
  try
  {
    const { status: code, data: response } = await JobPostingService.getAllJobPosting()

    console.log(">>", response)
    if (code == 200) {
      jobPostingStore.initialize(response)
      jobPostingLoaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load sample job posting")
  }
}

const loadSampleCompanies = async () => {
  try
  {
    const { status: code, data: response } = await CompanyService.getSampleCompanies()

    if (code == 200) {
      companyStore.initialize(response)
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await loadSampleJobPosting()
  await loadSampleCompanies()
})

//
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard
          flat
          rounded="0"
        >
          <VCarousel
            cycle
            height="400"
            show-arrows-on-hover
            continuous
          >
            <VCarouselItem
              v-for="(slide, i) in slides"
              :key="i"
            >
              <VImg
                :src="slide"
                class="fill-height"
                :lazy-src="slide"
                cover
              >
                <template #placeholder>
                  <VRow
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <VProgressCircular
                      indeterminate
                      color="grey lighten-5"
                    />
                  </VRow>
                </template>
              </VImg>
            </VCarouselItem>
          </VCarousel>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText>
            <VRow no-gutters>
              <VCol cols="12">
                <span class="font-weight-thin">Search</span>
                <VTextField v-model="searchQuery" />
              </VCol>
              <VCol cols="12">
                <div class="d-flex flex-row gap-2 w-100 align-center">
                  <VCheckbox 
                    v-model="featured"
                    label="Featured"
                  />
                  <VCheckbox 
                    v-model="recommended"
                    label="Recommended For My Skills"
                  />
                  <VRadioGroup
                    v-model="stars"
                    inline
                  >
                    <VRadio 
                      label="All"
                      :value="-1"
                    />
                    <VRadio
                      v-for="n in 5"
                      :key="`star-${n}`"
                      :value="n"
                    >
                      <template #label>
                        <VIcon 
                          v-for="m in n"
                          :key="`star-icon-enable-${m}`"
                          size="15"
                          color="warning"
                          icon="tabler-star-filled" 
                        />
                        <VIcon 
                          v-for="o in 5 - n"
                          :key="`star-icon-disable-${o}`"
                          size="15"
                          color="warning"
                          icon="tabler-star"
                        />
                      </template>
                    </VRadio>
                  </VRadioGroup>
                </div>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <!--  -->
      <template v-if="!jobPostingLoaded">
        <VCol 
          v-for="n in 8"
          :key="`job-posting-skeleton-${n}`"
          cols="12"
          sm="6"
          md="3"
        >
          <VSkeletonLoader
            :loading="!jobPostingLoaded"
            type="card"
          />
        </VCol>
      </template>
      <template v-else>
        <VCol
          v-if="jobPostings.length <= 0" 
          cols="12"
        >
          <EmptyJobPost />
        </VCol>
        <VCol
          v-for="jobPosting in jobPostings"
          v-else
          :key="jobPosting.id"
          cols="12"
          sm="6"
          md="3"
        >
          <JobPostingCard
            :data="jobPosting"
            auto-fit
          />
        </VCol>
      </template>
      <!--  -->
      <VCol cols="12">
        <span class="text-h3 font-weight-bold">Top Companies</span>
        <VCard 
          v-if="companyStore.getCompanies <= 0"
          flat
          border
        >
          <VCardText class="text-center">
            No companies available.
          </VCardText>
        </VCard>
        <VSlideGroup
          v-else
          show-arrows
          class="pa-5"
        >
          <VSlideGroupItem
            v-for="company in companyStore.getCompanies"
            :key="`company-${company.id}`"
          >
            <CompanyCard
              :data="company"
              class="ma-10"
            />
          </VSlideGroupItem>
        </VSlideGroup>
      </VCol>
    </VRow>
    <VContainer>
      <Footer />
    </VContainer>
  </section>
</template>

<route lang="yaml">
  meta:
    subject: auth
    action: read
    requiresAuth: true
    layout: raw
</route>
