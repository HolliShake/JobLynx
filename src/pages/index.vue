<script setup>
import ManSitting from "@/assets/images/download/man-laptop.png"
import CompanyService from "@/service/company.service";
import useCompanyStore from "@/stores/company.store";
import CompanyCard from "@/views/pages/global/CompanyCard.vue";
import { onMounted } from "vue";
import { themeConfig } from '@themeConfig'
import JobPostingService from "@/service/jobposting.service";
import useJobPostingStore from "@/stores/job-posting.store";
import JobPostingCard from "@/views/pages/global/JobPostingCard.vue";
import Footer from "@/layouts/components/Footer.vue";

const companyStore = useCompanyStore()
const jobPostingStore = useJobPostingStore()

const loadSampleCompanies = async () => {
  try
  {
    const { status: code, data: response } = await CompanyService.getSampleCompanies()

    console.log(response);
    if (code == 200) {
      companyStore.initialize(response)
    }
  } catch (error) {
    console.error(error)
  }
}

const loadSampleJobPosting = async () => {
  try
  {
    const { status: code, data: response } = await JobPostingService.getSampleFeaturedJobPosting()

    console.log(response);
    if (code == 200) {
      jobPostingStore.initialize(response)
    }
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await loadSampleCompanies()
  await loadSampleJobPosting()
})
// 
</script>

<template>
  <section
    style="scroll-behavior: smooth !important;"
  >
    <nav>
      <VAppBar
        app
        color="white"
        elevation="0"
      >
        <VToolbarTitle>
          <span class="text-h4 font-weight-bold">
            {{ themeConfig.app.title }}
          </span>
        </VToolbarTitle>
        <VSpacer />
        <VBtn
          variant="text"
          rounded="sm"
          color="mgreen"
          to="/browse"
        >
          Browse
        </VBtn>
        <VBtn
          variant="text"
          rounded="sm"
          color="mgreen"
          to="/login"
        >
          Login
        </VBtn>
        <VBtn
          variant="text"
          rounded="sm"
          color="mgreen"
          to="/register"
        >
          Register
        </VBtn>
      </VAppBar>
    </nav>
    <div 
      id="global-banner-color"
      class="d-block py-16"
    >
      <VContainer>
        <VRow class="align-center">
          <VCol 
            cols="12"
            md="6"
          >
            <VImg 
              :src="ManSitting" 
              cover
              max-width="70%"
              class="mx-auto"
            />

            <span>
              <VCard
                class="mx-auto mt-5"
                max-width="fit-content"
              >
                <VCardText 
                  class="pa-4"
                >
                  <div class="d-flex flex-row flex-nowrap justify-space-evenly align-center gap-10">
                    <a href="#">
                      <VIcon icon="mdi-facebook" />
                    </a>
                    <a href="#">
                      <VIcon icon="mdi-twitter" />
                    </a>
                    <a href="#">
                      <VIcon color="mgreen" icon="mdi-google" />
                    </a>
                    <a href="#">
                      <VIcon color="error" icon="mdi-youtube" />
                    </a>
                  </div>
                </VCardText>
              </VCard>
            </span>
          </VCol>
          <VCol 
            cols="12"
            md="4"
            class="py-16"
          >
            <h2 class="text-h2 font-weight-bold">
              Unleash Opportunities Aligned with Your Interests and Abilities!
            </h2>
            <p class="mt-3">
              Your Gateway to Personalized Career Success, Matching Your Unique Interests and Abilities with the Perfect Job Fit!
            </p>
            <RouterLink :to="{ path: './', hash: '#explore-more' }">
              <VBtn
                rounded="sm"
                size="large"
                color="mgreen"
              >
                Explore
              </VBtn>
            </RouterLink>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div 
      id="explore-more"
      class="d-block py-16"
    >
      <VContainer>
        <VRow>
          <VCol cols="12">
            <div class="d-inline">
              <span class="text-h3 font-weight-bold">Browse by company</span>
              <VIcon end icon="tabler-sparkles" :size="40" />
            </div>
          </VCol>
          <VCol cols="12">
            <VSlideGroup
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
          <VCol 
            cols="12"
            class="text-center"
          >
            <VBtn 
              rounded="pill"
              color="white"
            >
              see more
            </VBtn>
          </VCol>
          <VCol 
            cols="12"
            md="8"
            offset="0"
            offset-md="2"
          >
            <p class="text-center">
              <q>
                Experience the advantage of choice with our job finder platform, where multiple companies converge to enhance your career prospects. By collaborating with a diverse range of employers, {{ themeConfig.app.title }} offers a rich landscape of opportunities, ensuring you find a job that aligns perfectly with your skills and aspirations. Our extensive network of companies spans various industries, providing you with a plethora of options to explore. Whether you are seeking a dynamic startup, an established corporation, or a creative agency, {{ themeConfig.app.title }} connects you with employers eager to discover talent like yours. Elevate your job search experience and unlock doors to a multitude of possibilities through our platform, where the right job for you is just a click away
              </q>
            </p>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <div 
      id="job-post"
      class="d-block"
    >
      <VContainer>
        <VRow>
          <VCol cols="12">
            <h3 class="text-center text-h3 font-weight-bold">Featured Job posts</h3>
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-row flex-wrap w-100 gap-5 justify-space-evenly">
              <JobPostingCard 
                v-for="jobPosting in jobPostingStore.getJobPostings"
                :key="`job-posting-${jobPosting.id}`"
                :data="jobPosting"
              />
            </div>
          </VCol>
        </VRow>
      </VContainer>
    </div>
    <VContainer>
      <Footer />
    </VContainer>
  </section>
</template>

<style lang="scss">
#global-banner-color {
  background-color: rgb(var(--v-theme-surface)) !important;
}
</style>

<route lang="yaml">
  meta:
    layout: blank
</route>
