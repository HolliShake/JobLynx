
<script setup>
import { cloneDeep } from "lodash"
import { requiredValidator } from '@/@core/utils/validators';
import { helpers } from '@/helpers';
import ApplicationLogService from '@/service/application-log.service';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import useLoading from "@/components/useLoading";

const emit = defineEmits([
  'create',
  'update',
])

const loading = useLoading()
const refVForm = ref()
const submitted = ref(false)
const form = ref({
  event_date: new Date(Date.now()),
  event_title: '',
  event_description: '',
  score: 0,
  job_applicant_id: null,
})
const errors = ref({
  event_date: [],
  event_title: [],
  event_description: [],
  score: [],
  job_applicant_id: [],
})
const toast = inject("toast")
const modalRef = ref()

defineExpose({
    open(job_application_id) {
      form.value = {
        event_date: new Date(Date.now()),
        event_title: '',
        event_description: '',
        score: 0,
        job_applicant_id: job_application_id,
      }
      modalRef.value.open()
    },
    openAsUpdateMode(data) {
      form.value = cloneDeep(data)
      modalRef.value.openAsUpdateMode()
    },
    close() {
      modalRef.value.close()
      form.value = {
        event_date: new Date(Date.now()),
        event_title: '',
        event_description: '',
        score: 0,
        job_applicant_id: null,
      }
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await ApplicationLogService.createLog({
      ...form.value,
      event_date: helpers.formater.toPhpDate(form.value.event_date),
    })

    if (code == 201) {
      toast.success("Successfully created.")
      modalRef.value.close()
      emit('create', response)
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
    const { status: code, data: response } = await ApplicationLogService.updateLog(form.value.id, {
      ...form.value,
      event_date: helpers.formater.toPhpDate(form.value.event_date),
    })

    if (code == 200) {
      toast.success("Successfully updated.")
      modalRef.value.close()
      emit('update', response)
    }

  } catch (err) {
    console.log(err);
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

// 
</script>

<template>
  <AppDialog ref="modalRef" :max-width="420">
    <template #title>
      Company Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <VTextField
              v-model="form.event_title"
              label="Title"
              :rules="[requiredValidator]"
              :error-messages="errors.event_title"
            />
          </VCol>
          <VCol cols="12">
            <VueDatePicker 
              v-model="form.event_date"
              :teleport="true"
              :teleport-center="true"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="form.event_description"
              label="Description"
              :rows="3"
              :max-rows="10"
              :error-messages="errors.event_description"
              :rules="[requiredValidator]"
            />
          </VCol>
        </VRow>
      </VForm>
    </template>

    <template #actions="{ isUpdateMode }">
      <VBtn
        block
        type="submit"
        color="success"
        :prepend-icon="(isUpdateMode)? 'tabler-check' : 'tabler-location-plus'"
        :disabled="loading.isLoading"
        @click="onSubmit"
      >
        {{ isUpdateMode ? 'Update' : 'Create' }}
      </VBtn>
    </template>
  </AppDialog>
</template>
