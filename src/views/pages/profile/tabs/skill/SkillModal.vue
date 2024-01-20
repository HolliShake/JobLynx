
<script setup>
import { requiredValidator } from '@/@core/utils/validators'
import SkillService from '@/service/skill.service'
import useSkillStore from '@/stores/skill.store'

const skillService = SkillService
const skillStore = useSkillStore()
const refVForm = ref()
const submitted = ref(false)
const form = ref()

const errors = ref({
  title: [],
  description: [],
  progress: [],
})

const toast = inject("toast")
const modalRef = ref()

defineExpose({
  open() {
    modalRef.value.open()
    skillStore.resetField()
    form.value = skillStore.getSkillModel
  },
  openAsUpdateMode() {
    modalRef.value.openAsUpdateMode()
    form.value = skillStore.getSkillModel
  },
  close() {
    modalRef.value.close()
    skillStore.resetField()
  },
})


async function onSubmit() {
  (!modalRef.value.isUpdateMode()) ? await create() : await update()
}

async function create() {
  try
  {
    const { status: code, data: response } = await skillService.createSkill({
      ...form.value,
      progress: parseInt(form.value.progress),
    })

    if (code == 201) {
      toast.success("Successfully created.")
      skillStore.add(response)
      modalRef.value.close()
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
    const { status: code, data: response } = await skillService.updateSkill(form.value.id, {
      ...form.value,
      progress: parseInt(form.value.progress),
    })

    if (code == 200) {
      toast.success("Successfully updated.")
      skillStore.update(response)
      modalRef.value.close()
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
      Skill Details
    </template>

    <template #content>
      <VForm
        ref="refVForm"
        v-model="submitted"
      >
        <VRow>
          <VCol cols="12">
            <VTextField 
              v-model="form.title"
              label="Skill"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.title"
              class="text-xs text-error"
            >{{ errors.title.pop() }}</small>
          </VCol>
          <VCol cols="12">
            <VTextarea
              v-model="form.description"
              label="Description"
              :rows="2"
              :max-rows="5"
              auto-grow
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.description"
              class="text-xs text-error"
            >{{ errors.description.pop() }}</small>
          </VCol>
          <VCol cols="12">
            <VSlider
              v-model="form.progress"
              :label="`Progress (${parseInt(form.progress)}%)`"
              :min="0"
              :max="100"
              :rules="[requiredValidator]"
            />
            <small
              v-if="errors.name"
              class="text-xs text-error"
            >{{ errors.name.pop() }}</small>
          </VCol>
        </VRow>
      </VForm>
    </template>

    <template #actions="{ isUpdateMode }">
      <VBtn
        :block="$vuetify.display.mdAndDown"
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
