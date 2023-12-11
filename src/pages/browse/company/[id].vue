<script setup>
import { helpers } from '@/helpers';
import Empty from "@/assets/images/download/empty.png"
import CompanyService from '@/service/company.service';
import JobPostingService from '@/service/jobposting.service';
import useAuthStore from '@/stores/auth.store';
import JobPostingCard from '@/views/pages/global/JobPostingCard.vue';
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const searchQuery = ref('')
const stars = ref(-1)
const featured = ref(false)
const recommended = ref(false)
const companyData = ref({})
const companyLoaded = ref(false)
const jobPostingsRaw = ref([])
const jobPostingLoaded = ref(false)
const toast = inject('toast')



function isRecommended(data) {
  if (!recommended.value) return true

  // Always return true if not logged In
  if (!authStore.isLoggedIn) return true

  // Logged In
  if (!authStore.isAccountsetuped) return true

  const tresh = parseInt(import.meta.env.VITE_APP_RECOMMENDATION_TRESHOLD)

  const myQualification = helpers.resolver.getQualification(
    authStore.getUserData.personal_data.skill.map(s => s.title.toLowerCase()),
    data.position.skills.toLowerCase()
  )

  return myQualification >= tresh
}

const jobPostings = computed(() => {
  return jobPostingsRaw.value
    .filter(jp => jp.position.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
    .filter(jp => (stars.value == -1) ? true : (jp.position.company.average == stars.value))
    .filter(jp => (!featured.value) ? true : (jp.adtype.is_featured == featured.value))
    .filter(jp => isRecommended(jp))
})

const loadCompany = async () => {
  try {
    const { status: code, data: response } = await CompanyService.getCompanyById(helpers.security.decrypt(props.id))

    if (code == 200) {
      companyData.value = response
      companyLoaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load company data.")
  }
}

const loadJobPosting = async () => {
  try {
    const { status: code, data: response } = await JobPostingService.getJobPostingByCompanyId(helpers.security.decrypt(props.id))

    if (code == 200) {
      jobPostingsRaw.value = response
      jobPostingLoaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load company job posts.")
  }
}

onMounted(async () => {
  await loadCompany()
  await loadJobPosting()
})

// 
</script>

<template>
  <section>
    <VSkeletonLoader 
      v-if="!companyLoaded"
      :loading="!companyLoaded"
      type="card"
    />
    <template v-else>
      <PageHeader 
        :title="companyData.company_name"
        subtitle="View company job postings"
      />
      <VCard>
        <VCardText class="pa-4">
          <VRow no-gutters>
            <VCol 
              cols="12"
            >
              <span class="font-weight-thin">Search</span>
              <VTextField 
                v-model="searchQuery"
              />
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
                  inline
                  v-model="stars"
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
                        size="15" color="warning" icon="tabler-star-filled" 
                      />
                      <VIcon 
                        v-for="o in 5 - n"
                        :key="`star-icon-disable-${o}`"
                        size="15" color="warning" icon="tabler-star" />
                    </template>
                  </VRadio>
                </VRadioGroup>
              </div>
            </VCol>
          </VRow>
        </VCardText>
        <VCardText>
          <VRow>
            <!--  -->
            <template v-if="!jobPostingLoaded">
              <VCol 
                v-for="n in 8"
                :key="`job-posting-skeleton-${n}`"
                cols="12"
                sm="6"
                md="3"
              >
                <VSkeletonLoader :loading="!jobPostingLoaded" type="card" />
              </VCol>
            </template>
            <template v-else>
              <VCol
                v-if="jobPostings.length <= 0" 
                cols="12"
              >
                <VImg 
                  :src="Empty" 
                  cover
                  max-width="60%"
                  class="mx-auto"
                />
                <h3 class="text-center text-h3 font-weight-thin">No Result Found</h3>
              </VCol>
              <VCol
                v-else
                v-for="jobPosting in jobPostings"
                :key="jobPosting.id"
                cols="12"
                sm="6"
                md="3"
              >
                <JobPostingCard
                  :data="jobPosting"
                  auto-fit
                  flat
                  border
                />
              </VCol>
            </template>
          </VRow>
        </VCardText>
      </VCard>
    </template>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
</route>
