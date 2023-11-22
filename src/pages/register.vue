<script setup>
import { VForm } from 'vuetify/components/VForm'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import AuthService from '@/service/auth.service'
import useAuthStore from '@/stores/auth.store'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import CustomRadios from '@/@core/components/app-form-elements/CustomRadios.vue'
import { watch } from 'vue'

const router = useRouter()
const ability = useAppAbility()
const authService = AuthService
const authStore = useAuthStore()
const isPasswordVisible = ref(false)
const refVForm = ref()
const submitted = ref(false)
const form = ref(authStore.getUserModel)
const errors = ref({
  last_name: [],
  first_name: [],
  middle_name: [],
  gender: [],
  suffix: [],
  birth_date: [],
  mobile_number: [],
  email: [],
  password: [],
})
const toast = inject("toast")

async function onSubmit() {

  if (submitted.valued) {
    return
  }

  submitted.value = true

  try
  {
    const { status: code, data: respose } = await authService.register(form.value)

    if (code >= 200 & code <= 299) {
      toast.success("Successfully registered.")
      router.push("/login")
    }
  } catch (err) {
    console.log(err);
    if ((err.response?.data?.error) ?? false) {
      errors.value = err.response?.data?.error
    }
  }
}
// 
</script>

<template>
  <section class="py-10">
    <VRow
      no-gutters
      :class="`auth-wrapper ${$vuetify.display.smAndDown ? 'bg-surface' : ''}`"
    >
      <VCol
        cols="12"
        lg="4"
        offset="0"
        offset-lg="4"
        class="auth-card-v2 d-flex align-center justify-center"
      >
        <VCard
          :flat="$vuetify.display.smAndDown"
          
          class="mt-12 mt-sm-0 pa-4"
        >
          <VCardText>
            <VNodeRenderer
              :nodes="themeConfig.app.logo"
              class="mb-6"
            />

            <h5 class="text-h5 mb-1">
              Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
            </h5>

            <p class="mb-0">
              Please sign-in to your account and start the adventure
            </p>
          </VCardText>

          <VCardText>
            <VForm
              ref="refVForm"
              v-model="submitted"
              @submit.prevent="onSubmit"
            >
              <VRow>
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
                <!-- Gender -->
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

                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="form.email"
                    label="Email"
                    type="email"
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
                <VCol cols="12">
                  <VBtn
                    block
                    type="submit"
                  >
                    Signup
                  </VBtn>
                </VCol>

                <!-- alread have an account -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <span>Already have an account?</span>

                  <RouterLink :to="{
                    name: 'login'
                  }">
                    <span class="text-primary ms-2">
                      Sign-in
                    </span>
                  </RouterLink>
                </VCol>

                <VCol
                  cols="12"
                  class="d-flex align-center"
                >
                  <VDivider />

                  <span class="mx-4">or</span>

                  <VDivider />
                </VCol>

                <!-- auth providers -->
                <VCol
                  cols="12"
                  class="text-center"
                >
                  <AuthProvider />
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
