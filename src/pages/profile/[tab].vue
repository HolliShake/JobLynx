<script setup>
import UserProfileHeader from '@/views/pages/profile/UserProfileHeader.vue';
import ProfileTab from "@/views/pages/profile/tabs/profile/index.vue";
import SkillTab from "@/views/pages/profile/tabs/skill/index.vue";
import EducationTab from "@/views/pages/profile/tabs/education/index.vue";
import OtherTab from "@/views/pages/profile/tabs/other/index.vue";
import WorkTab from "@/views/pages/profile/tabs/work/index.vue";
import { h } from 'vue';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
import useAuthStore from '@/stores/auth.store';

const props = defineProps({
  tab: {
    type: String,
    required: true,
  },
})

const router = useRouter()
const currentTab = ref(props.tab)
const authStore = useAuthStore()

const tabs = ref([
  {
    title: 'Profile',
    key: 'profile',
    icon: 'mdi-account-check-outline'
  },
  {
    title: 'Other Information',
    key: 'other',
    icon: 'mdi-information-outline'
  },
  {
    title: 'Skills',
    key: 'skills',
    icon: 'mdi-arm-flex-outline'
  },
  {
    title: 'Education',
    key: 'education',
    icon: 'mdi-school-outline'
  },
  {
    title: 'Work Experience',
    key: 'work',
    icon: 'mdi-briefcase-outline'
  }
])

function getTab(tab) {
  switch (tab) {
    case 'profile':
      return h(ProfileTab)
    case 'other':
      return h(OtherTab)
    case 'skills':
      return h(SkillTab)
    case 'education':
      return h(EducationTab)
    case 'work':
      return h(WorkTab)
    default:
      return h('h1', 'Invalid Tab!!!')
  }
}

watch(currentTab, (val) => {
  router.push({
    name: 'profile-tab',
    params: {
      tab: val
    }
  })
}, { deep: true })

// 
</script>

<template>
  <section>
    <VRow>
      <VCol 
        v-if="!authStore.isAccountsetuped"
        cols="12"
      >
        <VAlert
          variant="tonal"
          type="warning"
        >
          Add Addtional Information to your profile to get more job opportunities. example: Skills, Education, Work Experience, etc.
        </VAlert>
      </VCol>
      <VCol cols="12">
        <UserProfileHeader />
      </VCol>
      <VCol cols="12">
        <VTabs 
          v-model="currentTab"
          class="v-tabs-pill"
        >
          <VTab 
            v-for="t in tabs" 
            :key="t.key"
            :value="t.key"
          >
            <VIcon 
              start 
              :icon="t.icon" 
            />
            <span>{{ t.title }}</span>
          </VTab>
        </VTabs>
      </VCol>
      <!--  -->
      <VCol cols="12">
        <VWindow
          v-model="currentTab"
          class="disable-tab-transition"
        >
          <VWindowItem 
            v-for="t in tabs" 
            :key="t.key" 
            :value="t.key"
          >
            <Component :is="getTab(t.key)" />
          </VWindowItem>
        </VWindow>
      </VCol>
    </VRow>
  </section>
</template>

<route lang="yaml">
  meta:
    layout: raw
    requiresAuth: true
</route>
