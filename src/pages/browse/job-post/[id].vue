<script setup>
import { helpers } from '@/helpers';
import JobPostingService from '@/service/jobposting.service';
import { onMounted } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})

const loaded = ref(false)
const pageData = ref({})

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await JobPostingService.getJobPostingById(helpers.security.decrypt(props.id))

    if (code == 200) {
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
    
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
</route>
