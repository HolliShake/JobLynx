<script setup>
import Empty from "@/assets/images/download/empty.png"
import { helpers } from "@/helpers"
import CompanyService from "@/service/company.service"

const search = ref('')
const itemsPerPage = ref(10)
const currentPage = ref(1)
const companies = ref([])

const data = computed(() => {
  return companies.value
    .sort((a, b) =>  b.average - a.average)
    .filter(c => c.company_name.toLowerCase().includes(search.value.toLowerCase()))
    .slice((currentPage.value - 1) * itemsPerPage.value, currentPage.value * itemsPerPage.value)
})

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await CompanyService.getAllPublicCompanies()

    if (code == 200) {
      companies.value = response
    }
  } catch (error) {
    console.error(error)
  }
})
// 
</script>


<template>
  <VCard>
    <VImg 
      :src="Empty" 
      cover
      max-width="60%"
      class="mx-auto"
    />
    <h3 class="text-center text-h3 font-weight-thin">No Result Found</h3>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <VTextField 
            v-model="search"
            label="Search company"
          />
        </VCol>
        <VCol
          v-if="data.length <= 0" 
          cols="12">
          <VCard
            flat
            border
          >
            <VCardText class="text-center">
              No Data Available
            </VCardText>
          </VCard>
        </VCol>
        <VCol 
          v-else
          v-for="(item, idx) in data"
          :key="item.id"
          cols="12"
          class="py-2"
        >
          <VCard
            :to="{
              name: 'browse-company-id',
              params: {
                id: helpers.security.encrypt(item.id)
              },
              props: true
            }"
          >
            <VCardText class="pa-4">
              <div class="d-flex flex-row w-100 align-center justify-space-between">
                <h4>{{ item.company_name }}</h4>

                <!--  -->
                <div class="d-flex flex-row flex-nowrap gap-1">
                  <VIcon
                    v-for="i in item.average"
                    :key="`rating-${i}`" 
                    icon="tabler-star-filled" 
                    size="15"
                    color="warning"
                  />
                  <VIcon
                    v-for="i in (5 - item.average)"
                    :key="`rating-${i}`" 
                    icon="tabler-star" 
                    size="15"
                    color="warning"
                  />
                </div>
              </div>
            </VCardText>
          </VCard>
        </VCol>
        <VCol cols="12">
          <AppPagination 
            v-model:items-per-page="itemsPerPage"
            v-model:current-page="currentPage"
            :total-items-count="companies.length"
          />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
