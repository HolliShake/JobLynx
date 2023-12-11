<script setup>
import { helpers } from '@/helpers';
import EmployeeService from '@/service/employee.service';

const items = ref([])
const loaded = ref(false)
const toast = inject("toast")

onMounted(async () => {
  try {
    const { status: code, data: response } = await EmployeeService.getMyWork()

    if (code == 200) {
      console.log(response);
      items.value = response
      loaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load work experience.")
  }

})

// 
</script>

<template>
  <VCard>
    <template #prepend>
      <div class="d-flex flex-row align-center gap-3">
        <VIcon icon="mdi-account-hard-hat" />
        <h3>WORK EXPERIENCE</h3>
      </div>
    </template>
    <VCardText class="pa-4">
      <VSkeletonLoader 
        v-if="!loaded" 
        :loading="!loaded" 
        type="list-item@4"
      />
      <template
        v-else
      >
        <div 
          v-if="items.length <= 0"
          class="d-block text-center"
        >
          No Previous Educational Background
        </div>
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
            v-for="(work, index) in items"
            :key="`item-${index}`"
            size="x-small"
            dot-color="success"
          >
            <!-- 👉 Header -->
            <div class="d-flex justify-space-between align-center gap-2 flex-wrap">
              <div>
                <span class="app-timeline-title">
                  {{ work.job_applicant.job_posting.position.title }}
                </span>
                <i class="d-block app-timeline-meta">{{ work.job_applicant.job_posting.position.company.company_name }}, {{ work.job_applicant.job_posting.position.office.address }} {{ work.job_applicant.job_posting.position.office.country }}</i>
                <i class="d-block app-timeline-meta">{{ helpers.formater.dateToWord(work.hired_date) }} &nbsp;-&nbsp; {{ (!work.isActive) ? helpers.formater.dateToWord(work.updated_at) : "Present" }}</i>  
              </div>
            </div>

         
          </VTimelineItem>
        </VTimeline>
      </template>
    </VCardText>
  </VCard>
</template>
