
<script setup>
import PositionService from '@/service/position.service'
import usePositionStore from '@/stores/position.store'
import { EMPLOYEMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/employment-type.map'
import { PAYMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/payment-type.map'

const positionStore = usePositionStore()
const companyContext = inject('companyContext')
const refVForm = ref()
const submitted = ref(false)
const form = ref({
  position_id: -1,
})
const errors = ref({
  title: [],
  level: [],
  value: []
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
                  icon="mdi-check"
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
                            v-model="form.position_id"
                            :items="positionItems"
                          />
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Location</span>
                          <VTextField 
                            :model-value="form.address"
                            readonly
                          />
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">EMPLOYEMENT TYPE</span>
                          <VRadioGroup
                            v-model="form.employment_type"
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
                          <span class="text-sm font-weight-bold">PAYMENT TYPE</span>
                          <VRadioGroup
                            v-model="form.payment_type"
                          >
                            <VRadio
                              v-for="pt in PAYMENT_TYPE_ITEMS"
                              :key="pt.value"
                              :label="pt.title"
                              :value="pt.value"
                            />
                          </VRadioGroup>
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Position</span>
                          <VTextField />
                        </VCol>
                        <VCol cols="12">
                          <span class="text-sm font-weight-bold">Location</span>
                          <VTextField />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
    </VForm>
  </AppFullDialog>
</template>
