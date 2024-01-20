
<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import { helpers } from '@/helpers'
import EducationService from '@/service/education.service'
import useEducationStore from '@/stores/education.store'
import { EDUCATION_ITEMS } from './education.map'

const educationService = EducationService
const educationStore = useEducationStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref()

const errors = ref({
  school_name: [],
  status: [],
  location: [],
  description: [],
  start_sy: [],
  end_sy: [],
})

const toast = inject("toast")
const modalRef = ref()

defineExpose({
  open() {
    modalRef.value.open()
    educationStore.resetField()
    form.value = educationStore.getEducationModel
  },
  openAsUpdateMode() {
    modalRef.value.openAsUpdateMode()
    form.value = educationStore.getEducationModel
  },
  close() {
    modalRef.value.close()
    educationStore.resetField()
  },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await educationService.createEducation({
      ...form.value,
      start_sy: helpers.formater.toPhpDate(form.value.start_sy),
      end_sy: helpers.formater.toPhpDate(form.value.end_sy),
    })

    if (code == 201) {
      toast.success("Successfully created.")
      educationStore.add(response)
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
    const { status: code, data: response } = await educationService.updateEducation(form.value.id, {
      ...form.value,
      start_sy: helpers.formater.toPhpDate(form.value.start_sy),
      end_sy: helpers.formater.toPhpDate(form.value.end_sy),
    })

    if (code == 200) {
      toast.success("Successfully updated.")
      educationStore.update(response)
      modalRef.value.close()
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
      Education Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <VTextField 
              v-model="form.school_name"
              label="School"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.school_name"
              class="text-xs text-error"
            >{{ errors.school_name.pop() }}</small>
          </VCol>
          <VCol 
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="form.start_sy"
              label="From"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.start_sy"
              class="text-xs text-error"
            >{{ errors.start_sy.pop() }}</small>
          </VCol>
          <VCol 
            cols="12"
            md="6"
          >
            <AppDateTimePicker
              v-model="form.end_sy"
              label="To"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.end_sy"
              class="text-xs text-error"
            >{{ errors.end_sy.pop() }}</small>
          </VCol>
          <VCol cols="12">
            <AppTextField
              v-model="form.location"
              label="Location"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.location"
              class="text-xs text-error"
            >{{ errors.location.pop() }}</small>
          </VCol>
          <VCol cols="12">
            <AppSelect
              v-model="form.status"
              label="Status"
              :items="EDUCATION_ITEMS"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.status"
              class="text-xs text-error"
            >{{ errors.status.pop() }}</small>
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="form.description"
              label="Description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.description"
              class="text-xs text-error"
            >{{ errors.description.pop() }}</small>
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
