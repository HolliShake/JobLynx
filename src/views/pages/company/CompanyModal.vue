
<script setup>
import { emailValidator, requiredValidator } from '@/@core/utils/validators';
import CompanyService from '@/service/company.service';
import useCompanyStore from '@/stores/company.store';

const companyService = CompanyService
const companyStore = useCompanyStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref({})
const errors = ref({
  company_name: [],
  email : [],
  description: [],
  address: [],
  status: [],
  user_Id: [],
})
const toast = inject("toast")
const modalRef = ref()

defineExpose({
    open() {
      modalRef.value.open()
      companyStore.resetField()
      form.value = companyStore.getCompanyModel
    },
    openAsUpdateMode() {
      form.value = companyStore.getCompanyModel
      modalRef.value.openAsUpdateMode()
    },
    close() {
      modalRef.value.close()
      companyStore.resetField()
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await companyService.createCompany(form.value)

    if (code == 201) {
      toast.success("Successfully created.")
      modalRef.value.close()
      companyStore.add(response)
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
    const { status: code, data: response } = await companyService.updateCompany(form.value.id, form.value)

    if (code == 200) {
      toast.success("Successfully updated.")
      modalRef.value.close()
      companyStore.update(response)
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
              v-model="form.company_name"
              label="Company"
              :error-messages="errors.company_name"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.email"
              label="Email"
              :rules="[emailValidator]"
              :error-messages="errors.email"
            />
          </VCol>
          <VCol cols="12">
            <VTextField
              v-model="form.address"
              label="Address"
              :rules="[requiredValidator]"
              :error-messages="errors.address"
            />
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="form.description"
              label="Description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :error-messages="errors.description"
            />
          </VCol>
          <VCol cols="auto">
            <VRadioGroup
              v-model="form.status"
              inline
            >
              <VRadio label="active" value="active" />
              <VRadio label="inactive" value="inactive" />
            </VRadioGroup>
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
        @click="onSubmit"
      >
        {{ isUpdateMode ? 'Update' : 'Create' }}
      </VBtn>
    </template>
  </AppDialog>
</template>
