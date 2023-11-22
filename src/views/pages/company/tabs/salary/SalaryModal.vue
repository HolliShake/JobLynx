
<script setup>
import EducationService from '@/service/education.service';
import useEducationStore from '@/stores/education.store';
import { integerValidator, moneyValidator } from '@/@core/utils/validators';
import SalaryService from '@/service/salary.service';
import useSalaryStore from '@/stores/salary.store';

const salaryStore = useSalaryStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref({})
const errors = ref({
  title: [],
  level: [],
  value: []
})
const modalRef = ref()
const toast = inject("toast")

defineExpose({
    open() {
      modalRef.value.open()
      salaryStore.resetModel()
      form.value = salaryStore.getSalaryModel
    },
    openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      form.value = salaryStore.getSalaryModel
    },
    close() {
      modalRef.value.close()
      salaryStore.resetModel()
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await SalaryService.createSalary(form.value)   

    if (code == 201) {
      toast.success("Salary created successfully")
      modalRef.value.close()
      salaryStore.add(response)
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
    const { status: code, data: response } = await SalaryService.updateSalary(form.value.id, form.value)   

    if (code == 200) {
      toast.success("Salary updated successfully")
      modalRef.value.close()
      salaryStore.update(response)
    }

  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

// 
</script>

<template>
  <AppDialog ref="modalRef">
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
            <VTextField
              v-model="form.title"
              label="Title"
              :error-messages="errors.title"
            />
          </VCol>
          <VCol 
            cols="12"
            md="6"
          >
            <VTextField
              v-model="form.level"
              label="Level"
              :error-messages="errors.level"
            />
          </VCol>
          <VCol 
            cols="12"
            md="6"
          >
            <VTextField
              v-model="form.value"
              label="Amount"
              :rules="[moneyValidator]"
              :error-messages="errors.value"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>

    <template #actions="{ isUpdateMode }">
      <VBtn
        :block="$vuetify.display.mdAndDown"
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
