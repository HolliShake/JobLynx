
<script setup>
import PositionService from '@/service/position.service'
import usePositionStore from '@/stores/position.store'
import { EMPLOYEMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/employment-type.map'
import { PAYMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/payment-type.map'
import { watch } from 'vue'

const positionStore = usePositionStore()
const companyContext = inject('companyContext')
const refVForm = ref()
const submitted = ref(false)
const selectedPosition = ref(-1)
const positionData = ref({})
const form = ref({})
const errors = ref({
  
})
const currentStep = ref(1)
const steps = ref([
  {
    title: "Classify",
    step: 1,
  },
  {
    title: "Ad Type",
    step: 2,
  },
  {
    title: "Write",
    step: 3,
  },
  {
    title: "Manage",
    step: 4,
  },
])
const modalRef = ref()
const positionLoaded = ref(false)
const toast = inject("toast")

const positionItems = computed(() => {
  return [
    {
      title: "-- Select Position --",
      value: -1
    },
    ...(
      positionStore.getPositions
      .map(p => ({
        title: `${p.title}`,
        value: p.id
      }))
    )
  ]
})

const getPosition = async () => {
  try
  {
    const { status: code, data: response } = await PositionService.getPositionByCompanyId(companyContext.value.id)

    if (code == 200) {
      positionStore.initialize(response)
      positionLoaded.value = true
    }
  } catch (err) {
    console.error(error)
    toast.error("Failed to load positions.")
  }
}

defineExpose({
    async open() {
      modalRef.value.open()
      await getPosition()
    },
    async openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      await getPosition()
    },
    close() {
      modalRef.value.close()
    },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    // 
  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}

async function update() {
  try
  {
    //
  } catch (err) {
    if ((err.response?.data?.errors) ?? false) {
      errors.value = err.response?.data?.errors
    }
  }
}


function isFinished(step, currentStep) {
  if (step != currentStep) {
    return false
  }

  switch (currentStep) {
    case 1: {
      return (selectedPosition.value > 0)
    }
    case 2:
      return false
    case 3:
      return false
    default:
      return false
  }  
}

function nextStep() {
  if (currentStep.value >= steps.value.length) {
    return
  }

  currentStep.value += 1
}

watch(selectedPosition, async (value) => {
  positionData.value = {}

  if (value <= 0) return

  form.value.position_id = value

  try
  {
    const { status: code, data: response } = await PositionService.getCascadedPositionById(value)

    if (code == 200) {
      console.log(response);
      positionData.value = response
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to fetch position entries.")
  }

}, { deep: true })

// 
</script>

<template>
  <AppFullDialog 
    ref="modalRef"
    transition="dialog-bottom-transition"
    max-width="80%"
    style="background-color: rgb(var(--v-theme-background));"
  >

  <template #header>
    <div>
      <VToolbar color="primary">
        <VBtn
          icon
          variant="plain"
          @click="$event => modalRef.close()"
        >
          <VIcon
            color="white"
            icon="tabler-x"
          />
        </VBtn>

        <VToolbarTitle>Settings</VToolbarTitle>

        <VSpacer />

        <VToolbarItems>
          <VBtn
            variant="text"
          >
            Save
          </VBtn>
        </VToolbarItems>
      </VToolbar>
    </div>
  </template>

    <VForm
      ref="refVForm"
      v-model="submitted"
    >
      <VRow>
        <VCol 
          cols="12"
          md="10"
          class="mx-auto"
        >
          <VCard>
            <VCardText class="px-0 py-2">
              <VTimeline
                direction="horizontal"
                truncate-line="both"
                side="end"
                
              >
                <VTimelineItem
                  v-for="step in steps"
                  :key="step.title"
                  size="sm"
                  :dot-color="currentStep >= step.step ? 'primary' : 'info'"
                  :icon="isFinished(step.step, currentStep) ?'mdi-check' : 'mdi-circle-outline'"
                >
                  <span class="font-weight-bold">{{ step.title }}</span>
                </VTimelineItem>
              </VTimeline>
            </VCardText>
          </VCard>
        </VCol>
        <!--  -->
        <VCol 
          cols="12"
          md="10"
          class="mx-auto"
        >
          <VWindow 
            v-model="currentStep"
            class="disable-tab-transition"
          >
            <VWindowItem :value="1">
              <VRow>
                <VCol cols="12" md="5">
                  <VCard flat>
                    <template #prepend>
                      <span class="font-weight-bold">Role information</span>
                    </template>
                    <VCardText>
                      <VRow>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Position</span>
                          <VSelect 
                            v-model="selectedPosition"
                            :items="positionItems"
                          />
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Country</span>
                          <VTextField 
                            :model-value="positionData.office?.country"
                            readonly
                          />
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Address & Location</span>
                          <VTextField 
                            :model-value="positionData.office?.address"
                            readonly
                          />
                        </VCol>
                        <VCol cols="12">
                          <div class="d-flex flex-row flex-nowrap w-100 justify-space-between align-center">
                            <span class="text-sm font-weight-bold">EMPLOYEMENT TYPE</span>
                            <VBtn
                              icon=""
                              variant="text"
                              size="x-small"
                              class="pa-0"
                              color="error"
                            >
                              <VIcon
                                size="21"
                                icon="tabler-question-circle"
                              />
                              <VTooltip activator="parent">
                                <span class="text-xs">This employment type will be based on selected position</span>
                              </VTooltip>
                            </VBtn>
                          </div>
                          <VRadioGroup
                            v-model="positionData.employment_type"
                          >
                            <VRadio
                              v-for="et in EMPLOYEMENT_TYPE_ITEMS"
                              :key="et.value"
                              :label="et.title"
                              :value="et.value"
                              readonly
                            />
                          </VRadioGroup>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol 
                  cols="12"
                  class="py-0"
                />
                <!--  -->
                <VCol 
                  cols="12" 
                  md="5"
                >
                  <VCard flat>
                    <template #prepend>
                      <span class="font-weight-bold">Pay details</span>
                    </template>
                    <VCardText>
                      <VRow>
                        <VCol cols="12">
                          <div class="d-flex flex-row flex-nowrap w-100 justify-space-between align-center">
                            <span class="text-sm font-weight-bold">PAYMENT TYPE</span>
                            <VBtn
                              icon=""
                              variant="text"
                              size="x-small"
                              class="pa-0"
                              color="error"
                            >
                              <VIcon
                                size="21"
                                icon="tabler-question-circle"
                              />
                              <VTooltip activator="parent">
                                <span class="text-xs">This payment type will be based on selected position</span>
                              </VTooltip>
                            </VBtn>
                          </div>
                          <VRadioGroup
                            v-model="positionData.payment_type"
                          >
                            <VRadio
                              v-for="pt in PAYMENT_TYPE_ITEMS"
                              :key="pt.value"
                              :label="pt.title"
                              :value="pt.value"
                              readonly
                            />
                          </VRadioGroup>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol 
                  cols="12"
                  class="py-0"
                />
                <VCol 
                  cols="12"
                  md="5"
                >
                  <VCard flat>
                    <template #prepend>
                      <span class="font-weight-bold">Advertise privately</span>
                    </template>
                    <VCardText>
                      <VRow>
                        <VCol cols="12">
                          <VSwitch 
                            v-model="form.is_hide_company_info"
                            label="Hide company rating/review, and comments" 
                            class="text-xs text-disabled"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol 
                  cols="12"
                  class="py-0"
                />
                <VCol cols="12">
                  <div class="d-flex flex-row gap-2">
                    <VBtn
                      color="primary"
                      :disabled="!isFinished(1, currentStep)"
                      @click="nextStep"
                    >
                      Continue
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VWindowItem>
            <!--  -->
            <VWindowItem 
              :value="2"
            >
              asdasd
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
    </VForm>
  </AppFullDialog>
</template>
