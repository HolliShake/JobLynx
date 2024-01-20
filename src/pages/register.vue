<script setup>
import AppDateTimePicker from '@/@core/components/app-form-elements/AppDateTimePicker.vue'
import CustomRadios from '@/@core/components/app-form-elements/CustomRadios.vue'
import AuthService from '@/service/auth.service'
import useAuthStore from '@/stores/auth.store'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { VForm } from 'vuetify/components/VForm'

const router = useRouter()
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
  country: [],
  address: [],
  suffix: [],
  birth_date: [],
  mobile_number: [],
  email: [],
  password: [],
  role: [],
})

const toast = inject("toast")

const modalRef = ref()


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
    console.log(err)
    if ((err.response?.data?.error) ?? false) {
      errors.value = err.response?.data?.error
    }
  }
}

async function handleSelectType(type) {
  form.value.role = type
  modalRef.value.close()
}

onMounted(() => {
  modalRef.value.open()
})

// 
</script>

<template>
  <section class="py-0 py-lg-10">
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
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="form.last_name"
                    label="Last Name"
                    type="name"
                    autofocus
                  />
                  <small
                    v-if="errors.last_name"
                    class="text-xs text-error"
                  >{{ errors.last_name.pop() }}</small>
                </VCol>
                <!-- first name -->
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="form.first_name"
                    label="First Name"
                    type="name"
                  />
                  <small
                    v-if="errors.first_name"
                    class="text-xs text-error"
                  >{{ errors.first_name.pop() }}</small>
                </VCol>
                <!-- middle name -->
                <VCol
                  cols="12"
                  md="4"
                >
                  <AppTextField
                    v-model="form.middle_name"
                    label="Middle Name"
                    type="name"
                  />
                  <small
                    v-if="errors.middle_name"
                    class="text-xs text-error"
                  >{{ errors.middle_name.pop() }}</small>
                </VCol>
                <!-- Suffix -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.suffix"
                    label="Suffix (optional)"
                  />
                  <small
                    v-if="errors.suffix"
                    class="text-xs text-error"
                  >{{ errors.suffix.pop() }}</small>
                </VCol>
                <!-- Gender -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppDateTimePicker
                    v-model="form.birth_date"
                    label="Birthdate"
                  />
                  <small
                    v-if="errors.bith_date"
                    class="text-xs text-error"
                  >{{ errors.birth_date.pop() }}</small>
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
                
                <!-- Country -->
                <VCol 
                  cols="12" 
                  md="6"
                >
                  <span class="text-xs font-weight-thin">Country</span>
                  <SelectCountry
                    v-model="form.country"
                    label=""
                  />
                  <small
                    v-if="errors.country"
                    class="text-xs text-error"
                  >{{ errors.country.pop() }}</small>
                </VCol>

                <!-- Address -->
                <VCol 
                  cols="12" 
                  md="6"
                >
                  <span class="text-xs font-weight-thin">Address</span>
                  <VTextField v-model="form.address" />
                  <small
                    v-if="errors.address"
                    class="text-xs text-error"
                  >{{ errors.address.pop() }}</small>
                </VCol>

                <!-- mobile -->
                <VCol cols="12">
                  <AppTextField
                    v-model="form.mobile_number"
                    label="Mobile"
                    type="number"
                  />
                  <small
                    v-if="errors.mobile_number"
                    class="text-xs text-error"
                  >{{ errors.mobile_number.pop() }}</small>
                </VCol>

                <!-- email -->
                <VCol cols="12">
                  <AppTextField
                    v-model="form.email"
                    label="Email"
                    type="email"
                  />
                  <small
                    v-if="errors.email"
                    class="text-xs text-error"
                  >{{ errors.email.pop() }}</small>
                </VCol>

                <!-- password -->
                <VCol
                  cols="12"
                  md="6"
                >
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                  <small
                    v-if="errors.password"
                    class="text-xs text-error"
                  >{{ errors.password.pop() }}</small>
                </VCol>
                <!-- password confirm -->
                <VCol
                  cols="12"
                  md="6"
                >
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

                  <RouterLink
                    :to="{
                      name: 'login'
                    }"
                  >
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

    <AppDialog 
      ref="modalRef" 
      :closable="false"
    >
      <template #title>
        What are you?
      </template>
      <template #content>
        <VRow>
          <VCol 
            cols="12" 
            md="6"
            class="text-center"
          >
            <VBtn
              icon=""
              rounded="lg"
              size="170"
              variant="outlined"
              @click="handleSelectType('company')"
            >
              <VIcon
                icon="mdi-handshake"
                size="100"
              />
            </VBtn>
            <h4 class="mt-3 text-h4 font-weight-thin">
              Business Owner
            </h4>
          </VCol>
          <VCol 
            cols="12" 
            md="6"
            class="text-center"
          >
            <VBtn
              icon=""
              rounded="lg"
              size="170"
              variant="outlined"
              @click="handleSelectType('user')"
            >
              <VIcon
                icon="mdi-worker"
                size="100"
              />
            </VBtn>
            <h4 class="mt-3 text-h4 font-weight-thin">
              Job Seeker
            </h4>
          </VCol>
        </VRow>
      </template>
    </AppDialog>
  </section>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
