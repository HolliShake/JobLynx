
<script setup>
import EducationService from '@/service/education.service';
import useEducationStore from '@/stores/education.store';
import { helpers } from '@/helpers';
import { integerValidator } from '@/@core/utils/validators';

const educationService = EducationService;
const educationStore = useEducationStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref({})
const errors = ref({
  description: [],
  position: [],
  slots: [],
  salary_id: [],
  company_id: []
})
const toast = inject("toast")
const modalRef = ref()

defineExpose({
    open() {
      modalRef.value.open()
    },
    openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
    },
    close() {
      modalRef.value.close()
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    

  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

async function update() {
  try
  {
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
              v-model="form.position"
              label="Position"
              :error-messages="errors.position"
            />
          </VCol>
          <VCol 
            cols="12"
            md="3"
          >
            <VTextField
              v-model="form.slots"
              label="Slots"
              :rules="[integerValidator]"
              :error-messages="errors.slots"
            />
          </VCol>
          <VCol 
            cols="12"
            md="9"
          >
            <VSelect
              v-model="form.salary_id"
              label="Salary"
              :rules="[integerValidator]"
              :error-messages="errors.salary_id"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="form.description"
              label="Description"
              :rows="3"
              :max-rows="6"
              auto-grow
              :error-messages="errors.description"
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
