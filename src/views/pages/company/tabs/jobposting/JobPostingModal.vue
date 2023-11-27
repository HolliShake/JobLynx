
<script setup>
import { helpers } from '@/helpers'
import AdTypeService from '@/service/adtype.service'
import JobPostingService from '@/service/jobposting.service'
import PositionService from '@/service/position.service'
import useAdTypeStore from '@/stores/adtype.store'
import useJobPostingStore from '@/stores/job-posting.store'
import usePositionStore from '@/stores/position.store'
import { EMPLOYEMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/employment-type.map'
import { PAYMENT_TYPE_ITEMS } from '@/views/pages/company/tabs/position/payment-type.map'
import { inject } from 'vue'
import { watch } from 'vue'

const jobPostingStore = useJobPostingStore()
const positionStore = usePositionStore()
const adtypeStore = useAdTypeStore()
const companyContext = inject('companyContext')
const refVForm = ref()
const submitted = ref(false)
const selectedAdType = ref({})
const selectedPosition = ref(-1)
const positionData = ref({})
const form = ref({})
const bannerFiles = ref([])
const samplePhotos = ref([])
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
])
const modalRef = ref()
const stripeRef = inject('stripeRef')
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
      form.value = jobPostingStore.getJobPostingModel
      await getPosition()
    },
    async openAsUpdateMode() {
      modalRef.value.openAsUpdateMode()
      form.value = jobPostingStore.getJobPostingModel
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
    form.value = {
      ...form.value,
      date_posted: helpers.formater.toPhpDate(form.value.date_posted),
    }

    const formData = new FormData()
    if (bannerFiles.value.length > 0) formData.append('banner', bannerFiles.value.pop())
    if (samplePhotos.value.length > 0) {

      for (let i = 0; i < samplePhotos.value.length; i++) {
        formData.append(`file-${i}`, samplePhotos.value[i])
      }

    }

    const keys = Object.keys(form.value)
    for (let i = 0; i < keys.length; i++) {
      formData.append(keys[i], form.value[keys[i]])
    }

    console.log(formData);

    const { status: code, data: response } = await JobPostingService.createJobPosting(formData)

    if (code == 201) {
      console.log(response);
      jobPostingStore.add(response)
      modalRef.value.close()
      toast.success("Job posting created.")
    }
  } catch (err) {
    console.log(err);
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

  if (step < currentStep) return true

  if (step != currentStep) return false

  switch (currentStep) {
    case 1: {
      return (selectedPosition.value > 0)
    }
    case 2:
      return selectedAdType.value.id > 0
    case 3:
      return false
    default:
      return step <= currentStep
  }  
}

function nextStep() {
  if (currentStep.value >= steps.value.length) {
    return
  }

  currentStep.value += 1
}

function prevStep() {
  if (currentStep.value == 1) {
    return
  }

  currentStep.value -= 1
}

const loadPosition = async (value) => {
  positionData.value = {}
  form.value.position_id = value

  try
  {
    const { status: code, data: response } = await PositionService.getCascadedPositionById(value)

    if (code == 200) {
      positionData.value = response
    }
  } catch (error) {
    console.error(error)
    toast.error("Failed to fetch position entries.")
  }
}

const loadAdTypes = async () => {
  try
  {
    const { status: code, data: response } = await AdTypeService.getAllAdtypes()

    if (code == 200) {
      adtypeStore.initialize(response)
    }
  } catch (err) {
    console.error(err)
    toast.error("Failed to fetch ad types")
  }
}

async function onSelect(adtype) {
  selectedAdType.value = adtype
  form.value.adtype_id = adtype.id
}

watch(selectedPosition, async (value) => {
  if (value <= 0) return

  await loadPosition(value)
  await loadAdTypes()

}, { deep: true })

// 
</script>

<template>
  <AppFullDialog 
    ref="modalRef"
    transition="dialog-bottom-transition"
    fullscreen
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

        <VToolbarTitle>Post A Job</VToolbarTitle>
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
          md="8"
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
          md="8"
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
                            :loading="!positionLoaded"
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
              <VRow>
                <VCol cols=12>
                  <VRow>
                    <VCol 
                      v-for="adtype in adtypeStore.getAdTypes"
                      :key="`adtype-${adtype.id}`"
                      cols="12"
                      md="4"
                    >
                      <VCard
                        :style="`border: 2px solid ${ selectedAdType.id == adtype.id ? 'rgb(var(--v-theme-primary))' : 'transparent' };`"
                      >
                        <template #title>
                          <div class="d-block text-center">
                            {{ adtype.type }}
                          </div>
                        </template>
                        <VCardText>
                          <VRow>
                            <VCol 
                              cols="12"
                              class="my-10"
                            >
                              <span class="font-weight-bold">PRICE</span>
                              <h1 class="text-h1 text-center">₱ {{ helpers.formater.numberToMoney(adtype.price) }}</h1>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  icon="mdi-check-circle"
                                  color="success"  
                                />

                                <span class="font-weight-bold">{{ adtype.duration }} Day(s) posting period</span>
                              </div>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  icon="mdi-check-circle"
                                  color="success"  
                                />

                                <span class="font-weight-bold">{{ adtype.max_skills_matching}} Maximum skill matching</span>
                              </div>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  :icon="(adtype.is_analytics_available) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                  :color="(adtype.is_analytics_available) ? 'success' : 'error'"  
                                />

                                <span class="font-weight-bold">Analytics</span>
                              </div>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  :icon="(adtype.is_search_priority) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                  :color="(adtype.is_search_priority) ? 'success' : 'error'"  
                                />

                                <span class="font-weight-bold">Search Priority</span>
                              </div>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  :icon="(adtype.is_featured) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                  :color="(adtype.is_featured) ? 'success' : 'error'"  
                                />

                                <span class="font-weight-bold">Featured</span>
                              </div>
                            </VCol>
                            <VCol cols="12">
                              <div class="d-flex flex-row flex-nowrap align-center">
                                <VIcon 
                                  start
                                  :icon="(adtype.is_editable) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                  :color="(adtype.is_editable) ? 'success' : 'error'"  
                                />

                                <span class="font-weight-bold">Editable</span>
                              </div>
                            </VCol>
                            <VCol 
                              cols="12"
                              class="mt-5"
                            >
                              <div>
                                <VBtn
                                  block 
                                  @click="onSelect(adtype)"
                                  color="success"
                                >
                                  SELECT
                                </VBtn>
                              </div>
                            </VCol>
                          </VRow>
                        </VCardText>
                      </VCard>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="12">
                  <div class="d-flex flex-row gap-2">
                    <VBtn
                      color="primary"
                      :disabled="!isFinished(2, currentStep)"
                      @click="nextStep"
                    >
                      Continue
                    </VBtn>

                    <VBtn
                      color="info"
                      @click="prevStep"
                    >
                      Back
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VWindowItem>
            <!--  -->
            <VWindowItem :value="3">
              <VRow>
                <VCol cols="12">
                  <VCard>
                    <VCardText>
                      <VRow>

                        <VCol 
                          cols="12"
                        >
                          <VFileInput
                            v-model="bannerFiles"
                            :rules="[fileList => !fileList || !fileList.length || fileList[0].size < 1000000 || 'Avatar size should be less than 1 MB!']"
                            label="Avatar"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Pick a banner"
                            prepend-inner-icon="tabler-camera"
                            prepend-icon=""
                          />
                        </VCol>
                        <VCol 
                          cols="12"
                          md="4"
                        >
                          <h3 class="mb-2">Position Details</h3>
                          <VCard
                            flat
                            border
                          >
                            <VCardText>
                              <VRow no-gutters>
                                <VCol cols="12">
                                  <div class="d-flex flex-row align-center justify-space-between">
                                    <span class="d-block font-weight-bold">Position</span>
                                    <span class="d-block text-sm font-weight-thin">{{ positionData.title }}</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row align-center justify-space-between">
                                    <span class="d-block font-weight-bold">Code</span>
                                    <span class="d-block text-sm font-weight-thin">{{ positionData.salary?.title }}</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row align-center justify-space-between">
                                    <span class="d-block font-weight-bold">Level</span>
                                    <span class="d-block text-sm font-weight-thin">{{ positionData.salary?.level }}</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row align-center justify-space-between">
                                    <span class="d-block font-weight-bold">Salary</span>
                                    <span class="d-block text-sm font-weight-thin">{{ positionData.salary?.currency }} {{ helpers.formater.numberToMoney(positionData.salary?.value) }}</span>
                                  </div>
                                </VCol>
                              </VRow>
                            </VCardText>
                          </VCard>
                        </VCol>
                        <VCol cols="12" class="py-0" /> 
                        <VCol 
                          cols="12"
                          md="4"
                        >
                          <h3 class="mb-2">Skills Required</h3>
                          <div class="py-2 d-flex flex-row flex-wrap gap-1">
                            <VChip
                              v-for="skill in positionData.skills?.split(' ')"
                              :key="`skill-${skill}`"
                              color="primary"
                              variant="tonal"
                            >
                              {{ skill }}
                            </VChip>
                          </div>
                        </VCol>
                        <VCol cols="12" class="py-0" /> 
                        <VCol 
                          cols="12"
                          md="4"
                        >
                          <h3 class="mb-2">Your Ad Details</h3>
                          <VCard 
                            border 
                            flat
                          >
                            <VCardText>
                              <VRow no-gutters>
                                <VCol 
                                  cols="12"
                                >
                                  <span class="d-block font-weight-bold">Type : {{ selectedAdType.type }}</span>
                                </VCol>
                                <VCol 
                                  cols="12"
                                  class="mb-2"
                                >
                                  <span class="d-block font-weight-bold">Price: ₱ {{ helpers.formater.numberToMoney(selectedAdType.price) }}</span>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      icon="mdi-check-circle"
                                      color="success"  
                                    />

                                    <span class="font-weight-bold">{{ selectedAdType.duration }} Day(s) posting period</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      icon="mdi-check-circle"
                                      color="success"  
                                    />

                                    <span class="font-weight-bold">{{ selectedAdType.max_skills_matching}} Maximum skill matching</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      :icon="(selectedAdType.is_analytics_available) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                      :color="(selectedAdType.is_analytics_available) ? 'success' : 'error'"  
                                    />

                                    <span class="font-weight-bold">Analytics</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      :icon="(selectedAdType.is_search_priority) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                      :color="(selectedAdType.is_search_priority) ? 'success' : 'error'"  
                                    />

                                    <span class="font-weight-bold">Search Priority</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      :icon="(selectedAdType.is_featured) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                      :color="(selectedAdType.is_featured) ? 'success' : 'error'"  
                                    />

                                    <span class="font-weight-bold">Featured</span>
                                  </div>
                                </VCol>
                                <VCol cols="12">
                                  <div class="d-flex flex-row flex-nowrap align-center">
                                    <VIcon 
                                      start
                                      :icon="(selectedAdType.is_editable) ? 'mdi-check-circle ': 'mdi-close-circle'"
                                      :color="(selectedAdType.is_editable) ? 'success' : 'error'"  
                                    />

                                    <span class="font-weight-bold">Editable</span>
                                  </div>
                                </VCol>
                              </VRow>
                            </VCardText>
                          </VCard>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
                <VCol cols="12">
                  <div class="d-flex flex-row gap-2">
                    <VBtn
                      color="primary"
                      @click="onSubmit"
                    >
                      Save as draft
                    </VBtn>
                    <VBtn
                      color="info"
                      @click="prevStep"
                    >
                      Back
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
            </VWindowItem>
          </VWindow>
        </VCol>
      </VRow>
    </VForm>
  </AppFullDialog>
</template>
