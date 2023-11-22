<script setup>
import useAuthStore from '@/stores/auth.store';
import avatar1 from '@images/avatars/avatar-1.png'

const authStore = useAuthStore()

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
      <VImg :src="avatar1" />

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
                    <VImg :src="avatar1" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ authStore.getUserData.first_name }} {{ authStore.getUserData.last_name }}
            </VListItemTitle>
            <VListItemSubtitle v-if="authStore.isAdmin">Admin</VListItemSubtitle>
          </VListItem>

          <!-- 👉 My Companies -->
          <VListItem link :to="{
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
          <VListItem link :to="{
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
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login" @click="onLogout">
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
