<script setup>
import useSkillStore from '@/stores/skill.store';
import SkillModal from './SkillModal.vue';
import useAuthStore from '@/stores/auth.store';
import { onMounted } from 'vue';
import SkillService from '@/service/skill.service';
import { computed } from 'vue';
import { inject } from 'vue';

const authStore = useAuthStore()
const skillStore = useSkillStore()
const search = ref('')
const loaded = ref(false)
const modalRef = ref()
const toast = inject("toast")
const swal = inject("swal")

const data = computed(() => {
  return skillStore.getSkills
    .filter(s => s.title.toLowerCase().includes(search.value.toLowerCase()))
})

async function onCreate() {
  modalRef.value.open()
}

async function onUpdate(skill) {
  skillStore.setField(skill.raw)
  modalRef.value.openAsUpdateMode()
}


async function onDelete(skill) {
  swal.value.fire({
    question: "Are you sure you want to delete this skill?",
    dangerMode: true,
  })
  .then(async (result) => {
    if (!result) return
    
    try
    {
      const { status: code } = await SkillService.deleteSkill(skill.id)

      if (code >= 200 && code <= 299) {
        skillStore.delete(skill)
        toast.success("Successfully deleted.")
      }

    } catch (error) {
      toast.error(error.message)
    }
  })
}

function resolveColor(progress) {
  if (progress >= 0 && progress <= 20) return "error"
  else if (progress >= 21 && progress <= 40) return "warning"
  else if (progress >= 41 && progress <= 60) return "info"
  else if (progress >= 61 && progress <= 80) return "primary"
  else if (progress >= 81 && progress <= 100) return "success"
}

onMounted(async () => {
  skillStore.setUser(authStore.getUserData.id)

  try 
  {
    const { status: code, data: response } = await SkillService.getMySkills()

    if (code == 200) {
      skillStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error(error.message)
  }
})

</script>

<template>
  <VCard>
    <VCardText class="pa-4">
      <VRow>
        <VCol 
          cols="12"
          md="4"
        >
          <VTextField 
            v-model="search"
            label="Search" 
          />
        </VCol>
        <VCol 
          cols="12"
          md="auto"
          class="ms-auto"
        >
          <VBtn
            block
            prepend-icon="tabler-plus"
            @click="onCreate"
          >
            Create
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
    <AppTable :headers="[
        { title: '#', key: 'data-table-expand', align: 'center' },
        {
          title: 'SKILL',
          key: 'title',
          value: v => h('span', { class: 'text-uppercase font-weight-bold' }, v.title),
          width: '100%'
        },
        {
          title: 'ACTION',
          key: 'action',
        }
      ]" 
      :items="data"
      :loading="!loaded"
      @click:row="onUpdate"
    >
      <!-- Expanded Row Data -->
      <template #expanded-row="slotProps">
        <tr class="v-data-table__tr">
          <td :colspan="3">
            <VCardText class="pa-4">
              <VRow>
                <VCol cols="10">
                  <p>{{ slotProps.item.raw.description }}</p>
                </VCol>
                <VCol cols="2">
                  <div class="d-flex flex-row justify-center">
                    <VProgressCircular 
                      :progress="20" 
                      :size="80"
                      :width="8"
                      :model-value="slotProps.item.raw.progress"
                      :color="resolveColor(slotProps.item.raw.progress)"
                    >
                      {{ slotProps.item.raw.progress }}
                    </VProgressCircular>
                  </div>
                </VCol>
              </VRow>
            </VCardText>
          </td>
        </tr>
      </template>

      <template #item.action="{ item }">
        <VBtn
          variant="text" 
          icon=""
          size="small"
          color="error"
          @click.stop="onDelete(item.raw)"
        >
          <VIcon icon="tabler-trash" />
          <VTooltip activator="parent">Delete skill</VTooltip>
        </VBtn>
      </template>
    </AppTable>
  </VCard>

  <SkillModal ref="modalRef" />
</template>
