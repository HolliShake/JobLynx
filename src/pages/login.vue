<script setup>
import { VForm } from 'vuetify/components/VForm'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import AuthService from '@/service/auth.service'
import useAuthStore from '@/stores/auth.store'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import { useRouter } from 'vue-router'

const router = useRouter()
const ability = useAppAbility()
const authService = AuthService
const authStore = useAuthStore()
const isPasswordVisible = ref(false)
const refVForm = ref()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const submitted = ref(false)
const error = ref(null)
const errors = ref([])

async function onSubmit() {

  if (submitted.valued) {
    return
  }

  submitted.value = true

  try
  {
    const data = await authService.login({ email: email.value, password: password.value })

    if (!data) {
      error.value = "Invalid username or password"
      return
    }

    const { status: code, data: respose } = data
    if (!respose.user_access) return (submitted.value = false)

    if (code == 200) {
      ability.update(respose.user_access.map(ua => ({ subject: ua.subject, action: ua.action })))
      authStore.save(respose)
      if (authStore.isAdmin) {
        router.push("/admin")
      } else {
        router.push("/")
      }
    }
  } catch (err) {
    console.log(err);
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    } else {
      error.value = err.response?.data?.error ?? err.message
    }
  }
}

// 
</script>

<template>
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
        :max-width="500"
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

        <VCardText v-if="error">
          <VAlert>
            {{ error }}
          </VAlert>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            v-model="submitted"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  label="Email"
                  type="email"
                  autofocus
                />
                <small v-if="errors.email" class="text-xs text-error">{{ errors.email.pop() }}</small>
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="password"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <a
                    class="text-primary ms-2 mb-1"
                    href="#"
                  >
                    Forgot Password?
                  </a>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>

                <RouterLink :to="{
                  name: 'register'
                }">
                  <span class="text-primary ms-2">
                    Create an account
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
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
</route>
