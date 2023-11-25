
<script setup>
import OfficeService from '@/service/office.service'
import useOfficeStore from '@/stores/office.store'


const officeStore = useOfficeStore()
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
      officeStore.resetField()
      form.value = officeStore.getOfficeModel
    },
    openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      form.value = officeStore.getOfficeModel
    },
    close() {
      modalRef.value.close()
      officeStore.resetField()
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await OfficeService.createOffice(form.value)

    if (code == 201) {
      toast.success("Office created successfully")
      modalRef.value.close()
      officeStore.add(response)
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
    const { status: code, data: response } = await OfficeService.updateOffice(form.value.id, form.value)

    if (code == 200) {
      toast.success("Office update successfully")
      modalRef.value.close()
      officeStore.update(response)
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
  <AppDialog ref="modalRef" :max-width="420">
    <template #title>
      Office Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">NAME</span>
            <VTextField
              v-model="form.name"
              :error-messages="errors.name"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">CONTACT NUMBER</span>
            <VTextField
              v-model="form.mobile_number"
              :error-messages="errors.mobile_number"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">COUNTRY</span>
            <SelectCountry
              v-model="form.country"
              label=""
              :error-messages="errors.address"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">ADDRESS & LOCATION</span>
            <VTextarea
              v-model="form.address"
              :rows="2"
              :max-rows="5"
              auto-grow
              :error-messages="errors.address"
            />
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
