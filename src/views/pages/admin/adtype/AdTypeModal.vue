
<script setup>
import AdTypeService from '@/service/adtype.service'
import useAdTypeStore from '@/stores/adtype.store'


const adTypeStore = useAdTypeStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref({})

const errors = ref({
  type: [],
  price: [],
  duration: [],
  max_skills_matching: [],
  is_search_priority: [],
  is_featured: [],
  is_analytics_available: [],
  is_editable: [],
})

const modalRef = ref()
const toast = inject("toast")

defineExpose({
  open() {
    modalRef.value.open()
    adTypeStore.resetField()
    form.value = adTypeStore.getAdTypeModel
  },
  openAsUpdateMode() {
    modalRef.value.openAsUpdateMode()
    form.value = adTypeStore.getAdTypeModel
  },
  close() {
    modalRef.value.close()
    adTypeStore.resetField()
  },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await AdTypeService.createAdtype(form.value)

    if (code == 201) {
      toast.success("AdType created successfully")
      modalRef.value.close()
      adTypeStore.add(response)
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
    const { status: code, data: response } = await AdTypeService.updateAdtype(form.value.id, form.value)

    if (code == 200) {
      toast.success("AdType update successfully")
      modalRef.value.close()
      adTypeStore.update(response)
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
  <AppDialog
    ref="modalRef"
    :max-width="430"
  >
    <template #title>
      Ad Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">TYPE</span>
            <VTextField
              v-model="form.type"
              :error-messages="errors.type"
            />
          </VCol>
          <!--
            <VCol cols="12">
            <span class="text-sm font-weight-bold">PRICE</span>
            <VTextField
            v-model="form.price"
            :error-messages="errors.price"
            />
            </VCol> 
          -->
          <VCol cols="12">
            <span class="text-sm font-weight-bold">MAX SKILLS MATCHING</span>
            <VTextField
              v-model="form.max_skills_matching"
              :error-messages="errors.max_skills_matching"
            />
          </VCol>
          <VCol cols="12">
            <span class="text-sm font-weight-bold">DURATION</span>
            <VRadioGroup
              v-model="form.duration"
              inline
              class="gap-1"
            >
              <VRadio 
                label="1 Day"
                :value="1"
              />
              <VRadio 
                label="7 Days" 
                :value="7"
              />
              <VRadio 
                label="14 Days" 
                :value="14"
              />
              <VRadio 
                label="30 Days" 
                :value="30"
              />
            </VRadioGroup>
          </VCol>
          <VCol 
            cols="12"
            class="py-0"
          >
            <LabeledDivider title="Ad Option" />
          </VCol>
          <VCol cols="12">
            <div class="d-flex flex-row flex-wrap gap-3">
              <VCheckbox 
                v-model="form.is_featured"
                label="Featured"
              />

              <VCheckbox 
                v-model="form.is_search_priority"
                label="Search Priority"
              />

              <VCheckbox 
                v-model="form.is_editable"
                label="Editable"
              />

              <VCheckbox 
                v-model="form.is_analytics_available"
                label="Enable Analytics"
              />
            </div>
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
