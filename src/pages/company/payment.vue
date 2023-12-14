<script setup>
import JobPostingService from '@/service/jobposting.service';
import useJobPostingStore from '@/stores/job-posting.store';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const jobPostingStore = useJobPostingStore()
const toast = inject('toast')

const computedResult = computed(() => {
  return (route.query.redirect_status == 'succeeded') ? 'Payment successful.' : 'Payment failed.'
})

const jobPosting = computed(() => {
  try {
    return JSON.parse(localStorage.getItem('selectedJobPosting'))
  } catch (error) {
    return {}
  }
})

const companyId = computed(() => {
  return localStorage.getItem('selectedCompany') ?? '[invalid]'
})

onMounted(async () => {
  if (!jobPosting.value.id) {
    return router.push({
      name: 'company-companyid-job-posting',
      params: {
        companyid: companyId.value,
      },
      props: true
    })
  }

  try {
    const { status: code } = await JobPostingService.markAsPaid(jobPosting.value.id)

    if (code == 204) {
      // Success
    }

  } catch (error) {
    console.log(error);
    toast.error('Failed to fetch job postings.')
  }
})

// 
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <h3 class="text-h3">{{ computedResult }}</h3>
        <RouterLink :to="{
          name: 'company-companyid-job-posting',
          params: {
            companyid: companyId,
          },
          props: true
        }">
          <VBtn
            class="mt-2"
            color="success"
          >
            Manage Job Postings
          </VBtn>
        </RouterLink>
      </VCardText>
    </VCard>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    requiresAuth: true
</route>
