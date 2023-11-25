<script setup>
import JobPostingModal from './JobPostingModal.vue';


const search = ref('')
const options = ref({
  itemsPerPage: 10,
  page: 1,
})

const modalRef = ref()

async function onCreate() {
  modalRef.value.open()
}

// 
</script>

<template>
  <VCardText>
    <VRow>
      <VCol 
        cols="12" 
        md="4"
      >
        <VTextField 
          v-model="search"
          label="Search Posted Job"
        />
      </VCol>
      <VCol 
        cols="12" 
        md="auto"
      >
        <ItemsPerPage
          v-model="options.itemsPerPage"
          style="width: auto;"
        />
      </VCol>
      <VCol 
        cols="12" 
        md="auto"
        class="ms-auto"
      >
        <VBtn
          block
          @click="onCreate"
        >
          <VIcon 
            start 
            icon="tabler-location-plus"
          />
          CREATE A JOB AD
        </VBtn>
      </VCol>
      <VCol 
        cols="12"
        class="py-0"
      />
    </VRow>
  </VCardText>

  <Teleport to="#app">
    <JobPostingModal
      ref="modalRef" 
    />
  </Teleport>
</template>
