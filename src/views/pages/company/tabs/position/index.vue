<script setup>
import PositionModal from './PositionModal.vue';


const companyContext = inject("companyContext")
const search = ref('')
const itemsPerPage = ref(10)
const tableHeader = ref([
  {
    title: "POSITION",
    key: "position",
  },
  {
    title: "SLOTS",
    key: "slots",
  },
  {
    title: "SALARY",
    key: "salary.value",
  },
  {
    title: "ACTION",
    key: "action",
    width: '150',
    align: 'center',
  }
])
const modalRef = ref()

async function onCreate() {
  modalRef.value.open()
}

// 
</script>

<template>
  <VCard>
    <VCardText class="pa-4">
      <VRow>
        <VCol 
          cols="12"
          md="4"
        >
          <VTextField
            v-model="search"
            label="Search job position"
          />
        </VCol>
        <VCol cols="12" md="auto">
          <ItemsPerPage 
            v-model="itemsPerPage"
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
            CREATE NEW POSITION
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <AppTable 
      :headers="tableHeader"
      :items-per-page="itemsPerPage"
    />
  </VCard>

  <PositionModal ref="modalRef" />
</template>
