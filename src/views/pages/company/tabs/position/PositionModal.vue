
<script setup>
import { integerValidator } from '@/@core/utils/validators';
import { onMounted } from 'vue';
import SalaryService from '@/service/salary.service';
import { computed } from 'vue';
import PositionService from '@/service/position.service';
import usePositionStore from "@/stores/position.store";
import { EMPLOYEMENT_TYPE_ITEMS } from './employment-type.map';
import OfficeService from '@/service/office.service';
import useSalaryStore from '@/stores/salary.store';
import useOfficeStore from '@/stores/office.store';
import { PAYMENT_TYPE_ITEMS } from './payment-type.map';

const salaryStore = useSalaryStore()
const officeStore = useOfficeStore()
const positionStore = usePositionStore()
const companyContext = inject('companyContext')
const refVForm = ref()
const submitted = ref(false)
const form = ref({
  skills: ''
})
const errors = ref({
  description: [],
  position: [],
  slots: [],
  salary_id: [],
  office_id: [],
  company_id: []
})
const toast = inject("toast")
const modalRef = ref()

const salaryLoaded = ref(false)
const officeLoaded = ref(false)

const mappedSalaryItems = computed(() => {
  return salaryStore.getSalaries
    .map(s => ({
      title: `${s.title} (${s.level})`,
      value: s.id
    }))
})

const mappedOfficeItems = computed(() => {
  return officeStore.getOffices
    .map(o => ({
      title: `${o.name}`,
      value: o.id
    }))
})

const skills = computed(() => {
  return form.value.skills.split(' ')
    .filter(s => s.trim().length > 0)
})


async function loadOnVisible() {
  await getSalary()
  await getOffices()
}


defineExpose({
    async open() {
      modalRef.value.open()
      positionStore.resetField()
      form.value = positionStore.getPositionModel
      await loadOnVisible()
    },
    async openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      form.value = positionStore.getPositionModel
      await loadOnVisible()
    },
    close() {
      modalRef.value.close()
      positionStore.resetField()

    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await PositionService.createPosition(form.value)

    if (code == 201) {
      positionStore.add(response)
      toast.success('Position created successfully')
      modalRef.value.close()
    }
  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

async function update() {
  try
  {
    const { status: code, data: response } = await PositionService.updatePosition(form.value.id, form.value)

    if (code == 200) {
      positionStore.update(response)
      toast.success('Position update successfully')
      modalRef.value.close()
    }
  } catch (err) {
    console.log(err);
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

const getSalary = async () => {
  try
  {
    const { status: code, data: response } = await SalaryService.getSalaryByCompanyId(companyContext.value.id)

    if (code == 200) {
      salaryStore.initialize(response)
      salaryLoaded.value = true

      if (response.length > 0 && !modalRef.value.isUpdateMode()) {
        form.value.salary_id = response[0].id
      }
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load salaries.")
  }
}

const getOffices = async () => {
  try
  {
    const { status: code, data: response } = await OfficeService.getOfficesByCampusId(companyContext.value.id)

    if (code == 200) {
      officeStore.initialize(response)
      officeLoaded.value = true

      if (response.length > 0 && !modalRef.value.isUpdateMode()) {
        form.value.office_id = response[0].id
      }
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to load offices.")
  }
}
// 
</script>

<template>
  <AppDialog ref="modalRef" :max-width="450">
    <template #title>
      Position Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">POSITION</span>
            <VTextField
              v-model="form.title"
              :error-messages="errors.title"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">SKILLS REQUIRED</span>
            <VMenu
              :close-on-content-click="false"
            >
              <template #activator="{ props }">
                <VSelect
                  class="position-modal-skills-select"
                  :error-messages="errors.position"
                  chips
                  multiple
                  :model-value="skills"
                  readonly
                  v-bind="props"
                  append-inner-icon=""
                >
                  <template #append-inner>
                    <VBtn
                      v-bind="props"
                      icon=""
                      variant="plain"
                      rounded="lg"
                      size="x-small"
                    >
                      <VIcon icon="tabler-plus" /> 
                    </VBtn>
                  </template>
                </VSelect>
              </template>
              <VList>
                <VListItem>
                  <VTextField 
                    v-model="form.skills"
                  />
                </VListItem>
              </VList>
            </VMenu>
          </VCol>
          <VCol 
            cols="12"
            md="3"
          >
            <span class="text-sm font-weight-bold">SLOTS</span>
            <VTextField
              v-model="form.slots"
              :rules="[integerValidator]"
              :error-messages="errors.slots"
            />
          </VCol>
          <VCol 
            cols="12"
            md="9"
          >
            <span class="text-sm font-weight-bold">SALARY</span>
            <VSelect
              v-model="form.salary_id"
              :items="mappedSalaryItems"
              :rules="[integerValidator]"
              :error-messages="errors.salary_id"
              :loading="!salaryLoaded"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">DESCRIPTION</span>
            <VTextarea
              v-model="form.description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :error-messages="errors.description"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">OFFICE</span>
            <VSelect
              v-model="form.office_id"
              :items="mappedOfficeItems"
              :error-messages="errors.office_id"
              :loading="!officeLoaded"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">EMPLOYEMENT TYPE</span>
            <VRadioGroup
              v-model="form.employment_type"
              inline
            >
              <VRadio
                v-for="et in EMPLOYEMENT_TYPE_ITEMS"
                :key="et.value"
                :label="et.title"
                :value="et.value"
              />
            </VRadioGroup>
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">PAYMENT TYPE</span>
            <VRadioGroup
              v-model="form.payment_type"
              inline
            >
              <VRadio
                v-for="pt in PAYMENT_TYPE_ITEMS"
                :key="pt.value"
                :label="pt.title"
                :value="pt.value"
              />
            </VRadioGroup>
          </VCol>
        </VRow>
      </VForm>
    </template>

    <template #actions="{ isUpdateMode }">
      <VBtn
        class="mt-3"
        block
        type="submit"
        color="success"
        :prepend-icon="(isUpdateMode)? 'tabler-check' : 'tabler-location-plus'"
        @click="onSubmit"
      >
        {{ isUpdateMode ? 'Update' : 'Create' }}
      </VBtn>
    </template>
  </AppDialog>
</template>

<style lang="scss">
.position-modal-skills-select .v-field__append-inner {
  padding: 5px 0px;
}
</style>
