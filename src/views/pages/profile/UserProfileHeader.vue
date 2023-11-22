<script setup>
import useAuthStore from '@/stores/auth.store';
import DefaultProfileImg from '@/assets/images/download/default-avatar.png';
import DefaultCoverImg from '@/assets/images/download/default-cover.jpg';
import { helpers } from '@/helpers';
import { useAppAbility } from '@/plugins/casl/useAppAbility';
import ProfileModal from './tabs/profile/ProfileModal.vue';

const data = useAuthStore()
const ability = useAppAbility()
const modalRef = ref()

async function onEdit() {
  modalRef.value.openAsUpdateMode()
}

// 
</script>

<template>
  <VCard>
    <VImg
      :src="DefaultCoverImg"
      min-height="125"
      max-height="250"
      cover
    />

    <VCardText class="d-flex align-bottom flex-sm-row flex-column justify-center gap-x-5">
      <div class="d-flex h-0">
        <VAvatar
          rounded="circle"
          size="120"
          :image="DefaultProfileImg"
          class="user-profile-avatar mx-auto"
          variant="elevated"
        />
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
            v-if="ability.can('update', 'admin') || ability.can('update', 'user')"
            prepend-icon="tabler-edit"
            color="success"
            @click="onEdit"
          >
            Edit
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>

  <ProfileModal ref="modalRef" />
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
