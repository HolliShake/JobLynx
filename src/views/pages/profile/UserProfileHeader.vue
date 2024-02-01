<script setup>
import { helpers } from '@/helpers'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import FileCoverService from '@/service/file-cover.service'
import FileProfileService from '@/service/file-profile.service'
import useAuthStore from '@/stores/auth.store'
import DefaultProfileImg from '@images/download/default-avatar.png'
import DefaultCoverImg from '@images/download/default-cover.jpg'
import { watch } from 'vue'
import UserResumeModal from './UserResumeModal.vue'
import ProfileModal from './tabs/profile/ProfileModal.vue'

const data = useAuthStore()
const ability = useAppAbility()
const modalRef = ref()
const inputRef1 = ref()
const inputRef2 = ref()
const dpImage = ref([])
const cvImage = ref([])
const resumeRef = ref()

async function onChangeDp() {
  inputRef1.value.click()
}

async function onFileDpChange() {
  dpImage.value = inputRef1.value.files[0]
}

async function onChangeCover() {
  inputRef2.value.click()
}

async function onFileCoverChange() {
  cvImage.value = inputRef2.value.files[0]
}

async function onEdit() {
  modalRef.value.openAsUpdateMode()
}

async function onResume() {
  resumeRef.value.open()
}


watch(dpImage, async image => {
  const formData = new FormData()

  formData.append('profile', image)
  formData.append('user_id', data.getUserData.id)

  try
  {

    const { status: code, data: response } = await FileProfileService.changeProfileImage(formData)

    if (code == 200) {
      data.patch({
        profile_image: response,
      })
    }

  } catch (error) {
    console.log(error)
  }
})

watch(cvImage, async image => {
  const formData = new FormData()

  formData.append('cover', image)
  formData.append('user_id', data.getUserData.id)

  try
  {

    const { status: code, data: response } = await FileCoverService.changeCoverImage(formData)

    if (code == 200) {
      data.patch({
        cover_image: response,
      })
    }

  } catch (error) {
    console.log(error)
  }
})

// 
</script>

<template>
  <VCard style="position: relative;">
    <VImg
      :src="(data.getUserData.cover_image) ? helpers.resolver.getImagePath(data.getUserData.cover_image.file_name) : DefaultCoverImg"
      min-height="125"
      max-height="250"
      cover
    />

    <VBtn
      variant="text"
      style="position: absolute;right: 15px; bottom: 140px;"
      @click="onChangeCover"
    >
      <VIcon
        icon="tabler-camera"
        size="20"
        start
        class="text-white"
      />
      <span class="text-white">Change Cover</span>
    </VBtn>

    <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-5">
      <div class="d-flex h-0">
        <VAvatar
          rounded="circle"
          size="120"
          :image="(data.getUserData.profile_image) ? helpers.resolver.getImagePath(data.getUserData.profile_image.file_name) : DefaultProfileImg"
          class="user-profile-avatar mx-auto"
          variant="elevated"
        />

        <VBtn
          icon=""
          variant="elevated"
          size="x-small"
          class="mt-5 ms-n5"
          @click="onChangeDp"
        >
          <VIcon
            icon="tabler-camera"
            size="20"
            class="text-white"
          />
        </VBtn>
      </div>

      <div class="d-none">
        <input
          ref="inputRef1"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          @change="onFileDpChange"
        >
      </div>

      <div class="d-none">
        <input
          ref="inputRef2"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          @change="onFileCoverChange"
        >
      </div>

      <div class="user-profile-info w-100 mt-16 pt-6 pt-sm-0 mt-sm-0">
        <h4 class="text-h4 text-center text-sm-start font-weight-medium mb-3">
          {{ data.getUserData.first_name }} {{ data.getUserData.last_name }}
        </h4>

        <div class="d-flex align-center justify-center justify-sm-space-between flex-wrap gap-4">
          <div class="d-flex flex-wrap justify-center justify-sm-start flex-grow-1 gap-2">
            <span class="d-flex align-center">
              <VIcon
                size="20"
                icon="tabler-map-pin"
                class="me-2"
              />
              <span class="text-body-1">
                {{ data.getUserData.address ?? 'not set' }}
              </span>
            </span>

            <span class="d-flex align-center">
              <VIcon
                size="20"
                icon="tabler-calendar"
                class="me-2"
              />
              <span class="text-body-1">
                {{ helpers.formater.dateToWord(data.getUserData.birth_date) }}
              </span>
            </span>
          </div>

          <VBtn 
            prepend-icon="tabler-edit"
            color="success"
            @click="onEdit"
          >
            Edit
          </VBtn>

          <VBtn 
            v-if="ability.can('update', 'admin') || ability.can('update', 'user')"
            prepend-icon="tabler-file"
            color="primary"
            @click="onResume"
          >
            View Resume
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>

  <ProfileModal ref="modalRef" />
  <UserResumeModal
    ref="resumeRef"
    :is-modal-mode="!!true"
    :user-id="data.getUserData.id"
  />
</template>

<style lang="scss">
.user-profile-avatar {
  border: 5px solid rgb(var(--v-theme-background));
  background-color: rgb(var(--v-theme-surface)) !important;
  inset-block-start: -3rem;

  .v-img__img {
    border-radius: 0.125rem;
  }
}
</style>
