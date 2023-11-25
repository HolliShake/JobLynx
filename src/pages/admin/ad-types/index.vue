<script setup>

const search = ref('')
const itemsPerPage = ref(10)

const tableHeader = ref([
  {
    title: "TYPE",
    key: "type",
  },
  {
    title: "PRICE",
    key: "price",
  },
  {
    title: "ACTION",
    key: "action",
    width: '150',
    align: 'center',
  }
])

// 
</script>

<template>
  <section>
    <VCard>
      <VCardText class="pa-4">
        <VRow>
          <VCol 
            cols="12" 
            md="4"
          >
            <VTextField 
              v-model="search"
              label="Search Ad type"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="auto"
          >
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
            >
              <VIcon
                start
                icon="tabler-location-plus"
              />
              CREATE AD TYPE
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
      <AppTable
        :headers="tableHeader"
        :items-per-page="itemsPerPage"
      />
    </VCard>
  </section>
</template>
