
<script setup>
import UserService from '@/service/user.service';
import useAuthStore from '@/stores/auth.store'

const userService = UserService;
const auth = useAuthStore()
const isPasswordVisible = ref(false)
const refVForm = ref()
const submitted = ref(false)
const form = ref({})
const errors = ref({
  last_name: [],
  first_name: [],
  middle_name: [],
  gender: [],
  suffix: [],
  birth_date: [],
  mobile_number: [],
  address: [],
  country: [],
  email: [],
  password: [],
})
const toast = inject("toast")
const modalRef = ref()

defineExpose({
    openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      form.value = auth.getUserData
    },
    close() {
      modalRef.value.close()
    },
})

async function onSubmit() {
  try
  {
    const { status: code, data: response } = await userService.updateUser(form.value.id, form.value)
    modalRef.value.close()

    if (code == 200) {
      toast.success("Successfully updated.")
      auth.update(response)
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
      Profile Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
        @submit.prevent="onSubmit"
      >
        <VRow>
          <VCol cols="12" class="py-0">
            <LabeledDivider title="Basic Information" />
          </VCol>
          <!-- last name -->
          <VCol cols="12" md="4">
            <AppTextField
              v-model="form.last_name"
              label="Last Name"
              type="name"
              autofocus
            />
            <small v-if="errors.last_name" class="text-xs text-error">{{ errors.last_name.pop() }}</small>
          </VCol>
          <!-- first name -->
          <VCol cols="12" md="4">
            <AppTextField
              v-model="form.first_name"
              label="First Name"
              type="name"
            />
            <small v-if="errors.first_name" class="text-xs text-error">{{ errors.first_name.pop() }}</small>
          </VCol>
          <!-- middle name -->
          <VCol cols="12" md="4">
            <AppTextField
              v-model="form.middle_name"
              label="Middle Name"
              type="name"
            />
            <small v-if="errors.middle_name" class="text-xs text-error">{{ errors.middle_name.pop() }}</small>
          </VCol>
          <!-- Suffix -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.suffix"
              label="Suffix (optional)"
            />
            <small v-if="errors.suffix" class="text-xs text-error">{{ errors.suffix.pop() }}</small>
          </VCol>
          <!-- Birth date -->
          <VCol cols="12" md="6">
            <AppDateTimePicker
              v-model="form.birth_date"
              label="Birthdate"
            />
            <small v-if="errors.bith_date" class="text-xs text-error">{{ errors.birth_date.pop() }}</small>
          </VCol>
          <!-- Gender -->
          <VCol cols="12">
            <CustomRadios
              v-model="form.gender"
              :selected-radio="form.gender"
              :grid-column="!!false"
              :radio-content="[
                { title: 'Male', value: 'male' },
                { title: 'Female', value: 'female' },
                { title: 'LGBTQ+', value: 'lgbtq+' },
              ]" 
            />
              
          </VCol>

          <!-- mobile -->
          <VCol cols="12">
            <AppTextField
              v-model="form.mobile_number"
              label="Mobile"
              type="number"
            />
            <small v-if="errors.mobile_number" class="text-xs text-error">{{ errors.mobile_number.pop() }}</small>
          </VCol>

          <!-- address -->
          <VCol cols="12">
            <AppTextField
              v-model="form.address"
              label="Address"
            />
            <small v-if="errors.address" class="text-xs text-error">{{ errors.address.pop() }}</small>
          </VCol>

          <!-- country -->
          <VCol cols="12">
            <SelectCountry
              v-model="form.country"
              label="Country"
            />
            <small v-if="errors.country" class="text-xs text-error">{{ errors.country.pop() }}</small>
          </VCol>

          <VCol cols="12" class="py-0">
            <LabeledDivider title="Authentication & Security" />
          </VCol>

          <!-- email -->
          <VCol cols="12">
            <AppTextField
              v-model="form.email"
              label="Email"
              type="email"
              readonly
              autocomplete="new-password"
            />
            <small v-if="errors.email" class="text-xs text-error">{{ errors.email.pop() }}</small>
          </VCol>

          <!-- password -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.password"
              label="Password"
              :type="isPasswordVisible ? 'text' : 'password'"
              :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
              @click:append-inner="isPasswordVisible = !isPasswordVisible"
              autocomplete="new-password"
            />
            <small v-if="errors.password" class="text-xs text-error">{{ errors.password.pop() }}</small>
          </VCol>
          <!-- password confirm -->
          <VCol cols="12" md="6">
            <AppTextField
              v-model="form.password_confirmation"
              label="Confirm Password"
              :type="isPasswordVisible ? 'text' : 'password'"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="auto" 
            class="mx-auto"
          >
            <VBtn
              :block="$vuetify.display.mdAndDown"
              type="submit"
              color="success"
              prepend-icon="tabler-location"
            >
              Update
            </VBtn>
          </VCol>
        </VRow>
      </VForm>
    </template>
  </AppDialog>
</template>
