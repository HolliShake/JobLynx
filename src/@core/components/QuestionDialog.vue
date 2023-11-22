<script>
// Credits to sir Jevy Ababa
import { useThemeConfig } from "@core/composable/useThemeConfig"
import { reactive, ref } from "vue"

const { theme } = useThemeConfig()

export default {
  name: "SwalDialog",
  setup() {
    const isDialogVisible = ref(false)

    const params = reactive({
      question: "",
      dangerMode: false,
      trueBtn: "Yes",
      trueBtnColor: "primary",
      falseBtn: "No",
      falseBtnColor: "secondary",
    })

    const fire = async dataParams => {
      return new Promise((resolve, reject) => {
        isDialogVisible.value = true
        params.question = dataParams.question || "Are you sure?"
        params.dangerMode = dataParams.dangerMode || false
        params.trueBtn = dataParams.trueBtn || "Yes"
        params.trueBtnColor = dataParams.trueBtnColor || "primary"
        params.falseBtn = dataParams.falseBtn || "No"
        params.falseBtnColor = dataParams.falseBtnColor || "secondary"
        fire.resolve = resolve
      })
    }

    const agreeDialog = () => {
      isDialogVisible.value = false
      fire.resolve(true)
    }

    const closeDialog = () => {
      isDialogVisible.value = false
      fire.resolve(false)
    }

    
    return { theme, isDialogVisible, params, fire, agreeDialog, closeDialog }
  },
}
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? '100%' : 400"
    :model-value="isDialogVisible"
    persistent
    class="pa-0"
  >
    <!-- Dialog Content -->
    <VCard class="pa-0">
      <VCardText
        class="text-center"
        :class="{
          'text-white': theme === 'dark',
          'text-black': theme === 'light',
        }"
      >
        {{ params.question }}
      </VCardText>
      <div class="d-flex border-t">
        <div class="w-50">
          <VCardActions class="pa-0">
            <VBtn
              :color="params.dangerMode ? 'error' : 'primary'"
              block
              class="py-6"
              @click="agreeDialog"
            >
              {{ params.trueBtn }}
            </VBtn>
          </VCardActions>
        </div>
        <div class="w-50 border-s">
          <VCardActions class="pa-0">
            <VBtn
              color="secondary"
              block
              class="py-6"
              @click="closeDialog"
            >
              {{ params.falseBtn }}
            </VBtn>
          </VCardActions>
        </div>
      </div>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.v-dialog .v-overlay__content > .v-card {
  padding: 0 !important;
}
</style>
