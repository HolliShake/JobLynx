<script setup>
import PersonalDataService from '@/service/personal-data.service'
import usePersonalDataStore from '@/stores/personal-data.store'
import { inject } from 'vue'

const personalDataService = PersonalDataService
const personalDataStore = usePersonalDataStore()
const form = ref({})
const errors = ref({

})
const allowEdit = ref(false)
const toast = inject('toast')

async function onClick() {
  allowEdit.value = true
}

async function onUpdate() {
  console.log(form.value);
  try
  {
    const { status: code, data: response } = await personalDataService.updatePersonalData(form.value.id, form.value);

    if (code == 200) {
      personalDataStore.update(response)
      toast.success('Successfully updated.')
    }

  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

onMounted(async () => {
  try
  {
    const { status: code, data: response } = await personalDataService.getMyPersonalData()

    if (code == 200) {
      personalDataStore.initialize(response)
      form.value = response
    }

  } catch (error) {
    console.error(error)
    toast.error("Failed to load personal data.")
  }
})

// 
</script>

<template>
  <VCard>

    <template #prepend>
      <h3>Personal Information</h3>
    </template>

    <VCardText>
      <VRow>
        <VCol cols="12">
          <VAlert
            v-if="!allowEdit"
            variant="tonal"
            type="warning"
            closable
          >
            This fields are readonly by default. To edit, click <span type="button" @click="onClick" class="text-error">here</span>.
          </VAlert>
        </VCol>
        <!--  -->
        <VCol 
          cols="12" 
          class="py-0"
        >
          <LabeledDivider title="Basic Information" />
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppTextField 
            v-model="form.religion"
            label="Religion"
          />
          <small v-if="errors.religion" class="text-xs text-error">{{ errors.religion.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppSelect
            v-model="form.civil_status"
            label="Civil Status"
            :items="[
              'Single',
              'Married',
              'Divorced/Separated',
            ]"
          />
          <small v-if="errors.civil_status" class="text-xs text-error">{{ errors.civil_status.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppTextField 
            v-model="form.citizenship"
            label="Citizenship"
          />
          <small v-if="errors.citizenship" class="text-xs text-error">{{ errors.citizenship.pop() }}</small>
        </VCol>
        <VCol 
          cols="12" 
        >
          <LabeledDivider title="Address & Location" />
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppTextField 
            v-model="form.address"
            label="Address"
          />
          <small v-if="errors.address" class="text-xs text-error">{{ errors.address.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="3"
        >
          <AppTextField 
            v-model="form.municipality"
            label="Municipality"
          />
          <small v-if="errors.municipality" class="text-xs text-error">{{ errors.municipality.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="3"
        >
          <AppTextField 
            v-model="form.city"
            label="City"
          />
          <small v-if="errors.city" class="text-xs text-error">{{ errors.city.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="2"
        >
          <AppTextField 
            v-model="form.postal"
            label="Postal"
          />
          <small v-if="errors.postal" class="text-xs text-error">{{ errors.postal.pop() }}</small>
        </VCol>
        <VCol 
          cols="12" 
        >
          <LabeledDivider title="Mother Information" />
        </VCol>
        <VCol 
          cols="12"
          md="5"
        >
          <AppTextField 
            v-model="form.mother_last_name"
            label="Last Name"
          />
          <small v-if="errors.mother_last_name" class="text-xs text-error">{{ errors.mother_last_name.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppTextField 
            v-model="form.mother_first_name"
            label="First Name"
          />
          <small v-if="errors.mother_first_name" class="text-xs text-error">{{ errors.mother_first_name.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="3"
        >
          <AppTextField 
            v-model="form.mother_middle_name"
            label="Middle Name"
          />
          <small v-if="errors.mother_middle_name" class="text-xs text-error">{{ errors.mother_middle_name.pop() }}</small>
        </VCol>
        <VCol 
          cols="12" 
        >
          <LabeledDivider title="Father Information" />
        </VCol>
        <VCol 
          cols="12"
          md="5"
        >
          <AppTextField 
            v-model="form.father_last_name"
            label="Last Name"
          />
          <small v-if="errors.father_last_name" class="text-xs text-error">{{ errors.father_last_name.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="4"
        >
          <AppTextField 
            v-model="form.father_first_name"
            label="First Name"
          />
          <small v-if="errors.father_first_name" class="text-xs text-error">{{ errors.father_first_name.pop() }}</small>
        </VCol>
        <VCol 
          cols="12"
          md="3"
        >
          <AppTextField 
            v-model="form.father_middle_name"
            label="Middle Name"
          />
          <small v-if="errors.father_middle_name" class="text-xs text-error">{{ errors.father_middle_name.pop() }}</small>
        </VCol>
        <VCol 
          v-if="allowEdit"
          cols="12" 
          md="auto"
          class="mx-auto"
        >
          <VBtn
            block
            @click="onUpdate"
            color="success"
          >
          <VIcon start icon="tabler-edit" />
            UPDATE
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
