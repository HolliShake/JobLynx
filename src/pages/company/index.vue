<script setup>
import { avatarText } from '@/@core/utils/formatters'
import { helpers } from '@/helpers'
import CompanyService from '@/service/company.service'
import useAuthStore from '@/stores/auth.store'
import useCompanyStore from '@/stores/company.store'
import CompanyModal from '@/views/pages/company/CompanyModal.vue'
import EmptyResult from "@images/download/empty.png"
import { computed, inject, onMounted } from 'vue'

const companyService = CompanyService
const authStore = useAuthStore()
const companyStore = useCompanyStore()

const breadCrumbs = ref([
  {
    title: "Home",
    to: "/",
  },
  {
    title: "My Companies",
    disabled: true,
    to: "#",
  },
])

const search = ref('')
const filterValue = ref(-1)

const options = ref({
  page: 1,
  itemsPerPage: 10,
})

const modalRef = ref()
const loaded = ref(false)
const toast = inject("toast")
const swal = inject("swal")

const filterItems = ref([
  {
    title: "All",
    value: -1,
  },
  {
    title: "Pending",
    value: 0,
  },
  {
    title: "Declined",
    value: 1,
  },
  {
    title: "Approved",
    value: 2,
  },
])

const baseItems = computed(() => {
  let companies = companyStore.getCompanies
    .filter(s => s.company_name.toLowerCase().includes(search.value.toLowerCase()))
  
  if (options.value.itemsPerPage == -1) 
    return companies
  else
    return companies
      .slice((options.value.page - 1) * options.value.itemsPerPage, options.value.page * options.value.itemsPerPage)
})

const items = computed(() => {
  return baseItems.value
    .filter(c => {

      switch(filterValue.value) {
      case -1:
        return true
      case 0:
        return (!c.verified_by_admin && !c.is_decliend)
      case 1:
        return (c.verified_by_admin) && c.is_decliend
      case 2:
        return (c.verified_by_admin) && !c.is_decliend
      default:
        return false
      }

    })
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(company) {
  companyStore.setField(company)
  modalRef.value.openAsUpdateMode()
}

async function onDelete(company) {
  swal.value.fire({
    question: "Are you sure you want to delete this company?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try
      {
        const { status: code } = await companyService.deleteCompany(company.id)

        if (code >= 200 && code <= 299) {
          companyStore.delete(company)
          toast.success("Successfully deleted.")
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to delete company.")
      }
    })
}

async function onSelectCompany(company) {
  localStorage.setItem("selectedCompany", helpers.security.encrypt(company.id))
}

onMounted(async () => {
  companyStore.setUser(authStore.getUserData.id)

  try
  {
    const { status: code, data: response } = await companyService.getMyCompanies()

    if (code == 200) {
      companyStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load companies.")
  }
})

// 
</script>


<template>
  <section>
    <PageHeader 
      title="Company"
      subtitle="List of my companies"
      :breadcrumb="breadCrumbs"
    />

    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-4">
            <VRow>
              <VCol 
                cols="12"
                md="4"
              >
                <VTextField 
                  v-model="search"
                  label="Search company" 
                />
              </VCol>
              <VCol 
                cols="12"
                md="3"
              >
                <VSelect
                  v-model="filterValue"
                  label="Filter" 
                  :items="filterItems"
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
                  CREATE COMPANY
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <!--  -->
      <template v-if="!loaded">
        <VCol
          v-for="item in 3"
          :key="`item-${item.id}`"
          cols="12"
          sm="6"
          md="4"
        >
          <VSkeletonLoader
            type="card"
            loading
          />
        </VCol>
      </template>
      <template v-else>
        <VCol 
          v-if="items.length <= 0"
          cols="12"
        >
          <VCard>
            <VCardText>
              <VImg 
                class="d-block mx-auto"
                :src="EmptyResult" 
                alt="Empty" 
                max-width="800"
              />
              <h2 class="text-h2 text-center font-weight-thin">
                Nothing To Show
              </h2>
            </VCardText>
          </VCard>
        </VCol>
        <VCol
          v-for="item in items"
          v-else
          :key="`>> item-${item.id}`"
          cols="12"
          sm="6"
          md="4"
        >
          <VCard>
            <VCardText class="pa-4">
              <div class="d-flex flex-row flex-nowrap gap-3 align-center">
                <VBadge
                  offset-y="55"
                  offset-x="5"
                  dot
                  :color="item.status == 'active' ? 'success' : 'error'"
                >
                  <div 
                    class="d-inline-block rounded-circle"
                    style="border: 3px solid rgb(var(--v-theme-background));"
                  >
                    <VAvatar 
                      rounded="circle" 
                      variant="tonal"
                      size="70"
                    >
                      <span>{{ avatarText(item.company_name) }}</span>
                    </VAvatar>
                  </div>
                </VBadge>
                <div class="overflow-hidden">
                  <h3 class="font-weight-thin text-uppercase text-truncate text-no-wrap">
                    {{ item.company_name }}
                  </h3>
                  <small class="d-block mt-n1 small text-xs text-disabled text-truncate text-no-wrap">{{ item.address }}</small>
                </div>
              </div>
              <VDivider class="my-2" />
              <div class="d-flex flex-row flex-nowrap w-100 gap-2">
                <!-- create -->
                <RouterLink
                  :to="{
                    name: 'company-companyid-dashboard',
                    params: {
                      companyid: helpers.security.encrypt(item.id),
                    },
                  }"
                  @click="onSelectCompany(item)"
                >
                  <VBtn
                    icon=""
                    variant="tonal"
                    rounded="lg"
                    size="x-small"
                    color="primary"
                  >
                    <VIcon icon="tabler-eye" />
                    <VTooltip activator="parent">
                      visit company
                    </VTooltip>
                  </VBtn>
                </RouterLink>
                <!-- update -->
                <VBtn
                  icon=""
                  variant="tonal"
                  rounded="lg"
                  size="x-small"
                  color="success"
                  @click="onUpdate(item)"
                >
                  <VIcon icon="tabler-pencil" />
                  <VTooltip activator="parent">
                    update company
                  </VTooltip>
                </VBtn>
                <!-- delete -->
                <VBtn
                  icon=""
                  variant="tonal"
                  rounded="lg"
                  size="x-small"
                  color="error"
                  @click="onDelete(item)"
                >
                  <VIcon icon="tabler-trash" />
                  <VTooltip activator="parent">
                    delete company
                  </VTooltip>
                </VBtn>
              </div>
            </VCardText>
          </VCard>
        </VCol>
      </template>
      <VCol cols="12">
        <AppPagination 
          v-model:current-page="options.page" 
          v-model:items-per-page="options.itemsPerPage" 
          :total-items-count="companyStore.getCompanies.length"
        />
      </VCol>
    </VRow>

    <CompanyModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    subject: company
    action: read
    requiresAuth: true
</route>
