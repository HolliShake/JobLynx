<script setup>
import { helpers } from '@/helpers';
import JobApplicationService from '@/service/job-application.service';
import { inject } from 'vue';
import { onMounted } from 'vue';

const props = defineProps({
  jobapplicantid: {
    type: String,
    required: true
  }
})

const pageData = ref({})
const loaded = ref(false)
const toast = inject('toast')

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

onMounted(async () => {
  try {
    const { status: code, data: response } = await JobApplicationService.getById(helpers.security.decrypt(props.jobapplicantid))

    if (code == 200) {
      console.log(response);
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
          <VCardText
            class="pa-4 px-6"
          >
            <div class="d-flex flex-row gap-3 align-center">
              <div 
                class="d-inline elevated-3"
                style="border: 3px solid #fff;border-radius: 360px;"
              >
                <VAvatar
                  size="64"
                >
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
                <h3>{{ pageData.user.last_name }}, {{ pageData.user.first_name }}</h3>
                <VChip
                  color="success"
                  rounded="sm"
                >
                  <span class="text-sm">Applicant</span>
                </VChip>
              </div>
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
                      :src="helpers.resolver.getImagePath(pageData.job_posting.sample_photos[index].file_name)"
                      cover
                      :style=" (index < (pageData.job_posting.sample_photos.slice(1, 4).length - 1)) ? 'border-right: 4px solid rgb(var(--v-theme-background));' : ''"
                    />
                  </div>
                </VCard>
              </VCol>             
              <VCol cols="auto">
                <div 
                  v-if="pageData.status == 'pending'"
                  class="d-flex flex-row flex-nowrap gap-3">
                  <VBtn
                    color="success"
                    rounded="sm"
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
  </section>
</template>

<route lang="yaml">
  meta:
    navActiveLink: company-companyid-job-posting
</route>
