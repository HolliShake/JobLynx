<script setup>
import { avatarText } from '@/@core/utils/formatters'
import CompanyContext from '@/context/CompanyContext.vue'
import { helpers } from '@/helpers'
import EmployeeService from '@/service/employee.service'
import useCompanyStore from '@/stores/company.store'
import useEmployees from '@/stores/employees.store'
import { computed, inject } from 'vue'

const tableHeaders = ref([
  {
    title: "EMPLOYEE",
    key: "employee",
  },
  {
    title: "POSITION",
    key: "job_applicant.job_posting.position.title",
  },
  {
    title: "SALARY",
    key: "job_applicant.job_posting.position.salary.value",
    value: v => `${v.job_applicant.job_posting.position.salary.currency} ${helpers.formater.numberToMoney(v.job_applicant.job_posting.position.salary.value)}`,
  },
  {
    title: "DATE EFFECTIVE",
    key: "hired_date",
    value: v => helpers.formater.dateToWord(v.hired_date),
  },
  {
    title: "ACTIONS",
    key: "actions",
    width: '150',
    align: 'center',
  },
])

const companyStore = useCompanyStore()
const employeeStore = useEmployees()
const search = ref('')
const itemsPerPage = ref(10)
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

const data = computed(() => {
  return employeeStore.getEmployees
    .filter(e => (`${e.job_applicant.user.last_name}, ${e.job_applicant.user.first_name}`).toLowerCase().includes(search.value.toLowerCase()))
})


async function onDelete(employee) {
  swal.value.fire({
    question: `You are about to delete ${employee.raw.job_applicant.user.first_name} ${employee.raw.job_applicant.user.last_name}`,
    dangerMode: true,
  }).then(async result => {
    if (!result) return

    try {
      const { status: code } = await EmployeeService.deleteEmployee(employee.raw.id)

      if (code == 204) {
        employeeStore.delete(employee.raw)
        toast.success("Employee deleted successfully")
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete employee")
    }
  })
}

watch(() => companyStore.companyModel, async company => {
  try
  {
    const { status: code, data: response } = await EmployeeService.getEmployeesByCompanyId(company.id)

    if (code == 200) {
      employeeStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    console.log(error)
    toast.error("Failed to load employees")
  }
}, { deep: true })

// 
</script>

<template>
  <CompanyContext>
    <VCard>
      <VCardText>
        <VRow>
          <VCol 
            cols="12"
            md="4"
          >
            <VTextField 
              v-model="search"
              label="Search employee"
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
        </VRow>
      </VCardText>
      <AppTable
        :headers="tableHeaders"
        :items="data"
        :items-per-page="itemsPerPage"
        :loading="!loaded"
      >
        <template #item.employee="{item}">
          <div class="d-flex flex-nowrap flex-row align-center gap-3">
            <div 
              class="d-inline-block rounded-circle elevation-2"
              style="border: 3px solid rgb(var(--v-theme-background));"
            >
              <VAvatar
                rounded="circle"
                variant="tonal"
              >
                <span v-if="!item.raw.job_applicant.user.profile_image">{{ avatarText(`${item.raw.job_applicant.user.last_name}, ${item.raw.job_applicant.user.first_name}`) }}</span>
                <VImg 
                  cover
                  :src="helpers.resolver.getImagePath(item.raw.job_applicant.user.profile_image.file_name)"
                />
              </VAvatar>
            </div>

            <span class="font-weight-bold text-sm">{{ `${item.raw.job_applicant.user.last_name}, ${item.raw.job_applicant.user.first_name}` }}</span>
          </div>
        </template>

        <template #item.actions="{item}">
          <VBtn
            icon=""
            color="error"
            variant="text"
            size="small"
            @click="onDelete(item)"
          >
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">
              Delete employee
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>
  </CompanyContext>
</template>


<route lang="yaml">
  meta:
    layout: default
    subject: company
    action: read
    requiresAuth: true
</route>
