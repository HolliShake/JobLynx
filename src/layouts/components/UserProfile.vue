<script setup>
import { helpers } from '@/helpers'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import useAuthStore from '@/stores/auth.store'
import DefaultProfileImg from '@images/download/default-avatar.png'

const authStore = useAuthStore()
const ability = useAppAbility()

async function onLogout() {
  authStore.clearCache()
}

// 
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg
        cover
        :src="(authStore.getUserData.profile_image) ? helpers.resolver.getImagePath(authStore.getUserData.profile_image.file_name) : DefaultProfileImg"
      />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="330"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg 
                      cover
                      :src="(authStore.getUserData.profile_image) ? helpers.resolver.getImagePath(authStore.getUserData.profile_image.file_name) : DefaultProfileImg" 
                    />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authStore.isLoggedIn ? `${authStore.getUserData.first_name} ${authStore.getUserData.last_name}` : 'Guest' }}
            </VListItemTitle>
            <VListItemSubtitle v-if="authStore.isAdmin">
              Admin
            </VListItemSubtitle>
          </VListItem>

          <!-- 👉 My Application -->
          <VListItem 
            v-if="authStore.isLoggedIn && ability.can('read', 'user')"
            link
            :to="{
              name: 'application',
            }"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-id-badge-2"
                size="22"
              />
            </template>

            <VListItemTitle>My Applications</VListItemTitle>
          </VListItem>

          <!-- 👉 My Companies -->
          <VListItem 
            v-if="authStore.isLoggedIn && ability.can('read', 'company')"
            link
            :to="{
              name: 'company',
            }"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-building"
                size="22"
              />
            </template>

            <VListItemTitle>My Companies</VListItemTitle>
          </VListItem>

          <!-- 👉 Profile -->
          <VListItem 
            v-if="authStore.isLoggedIn"
            link
            :to="{
              name: 'profile-tab',
              params: { tab: 'profile' },
              props: true,
            }"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider
            v-if="authStore.isLoggedIn"
            class="my-2"
          />

          <!-- 👉 Logout -->
          <VListItem 
            v-if="authStore.isLoggedIn"
            to="/login"
            @click="onLogout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
