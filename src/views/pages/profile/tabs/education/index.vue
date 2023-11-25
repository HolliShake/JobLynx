
<script setup>
import { computed } from 'vue';
import EducationModal from './EducationModal.vue';
import { onMounted } from 'vue';
import useEducationStore from '@/stores/education.store';
import useAuthStore from '@/stores/auth.store';
import EducationService from '@/service/education.service';
import { helpers } from '@/helpers';

const educationService = EducationService;
const authStore = useAuthStore()
const educationStore = useEducationStore()
const modalRef = ref();
const loaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const items = computed(() => {
  return educationStore.getEducation
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(education) {
  educationStore.setField(education)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(education) {
  swal.value.fire({
    question: "Are you sure you want to delete this education?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try
      {
        const { status: code } = await educationService.deleteEducation(education.id)

        if (code >= 200 && code <= 299) {
          educationStore.delete(education)
          toast.success('Successfully deleted.')
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete education.")
      }
    })
}

onMounted(async () => {
  educationStore.setUser(authStore.getUserData.id)

  try
  {
    const { status: code, data: response } = await educationService.getMyEducations()

    if (code == 200) {
      loaded.value = true
      educationStore.initialize(response)
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load educations.")
  }
})

// 
</script>

<template>
  <VCard>
    <template #prepend>
      <div class="d-flex flex-row align-center gap-3">
        <VIcon icon="mdi-school" />
        <h3>EDUCATIONAL BACKGROUND</h3>
      </div>
    </template>
    <template #append>
      <VBtn
        variant="elevated"
        icon=""
        rounded="sm"
        size="x-small"
        @click="onCreate"
      >
        <VIcon icon="tabler-plus" />
        <VTooltip activator="parent">Add Education Details</VTooltip>
      </VBtn>
    </template>
    <VCardText>
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
            v-for="(education, index) in items"
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

              <div class="d-flex flex-row gap-1 align-center">
                <VBtn
                  icon=""
                  variant="text"
                  size="x-small"
                  color="success"
                  @click.stop="$event => onUpdate(education)"
                >
                  <VIcon icon="tabler-edit" />
                </VBtn>
                <VBtn
                  icon=""
                  variant="text"
                  size="x-small"
                  color="error"
                  @click.stop="$event => onDelete(education)"
                >
                  <VIcon icon="tabler-trash" />
                </VBtn>
              </div>
            </div>

            <!-- 👉 Content -->
            <div class="app-timeline-text my-1">
              {{ education.description }}
            </div>
          </VTimelineItem>
        </VTimeline>
      </template>
    </VCardText>
  </VCard>

  <EducationModal ref="modalRef" />
</template>
