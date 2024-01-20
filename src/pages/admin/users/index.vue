<script setup>
import UserService from '@/service/user.service'
import useUserStore from '@/stores/user.store'
import CompanyModal from '@/views/pages/company/CompanyModal.vue'
import { computed, inject, onMounted } from 'vue'


const tableHeader = ref([
  {
    title: "FULL NAME",
    key: "FullName",
  },
  {
    title: "EMAIL",
    key: "email",
    sortable: false,
  },
  {
    title: "ROLE",
    key: "role",
  },
  {
    title: "STATUS",
    key: "status",
    sortable: false,
  },
  {
    title: "ACTION",
    key: "action",
    align: 'center',
    sortable: false,
  },
])

const userStore = useUserStore()
const search = ref('')
const filterUser = ref(-1)
const itemsPerPage = ref(10)
const modalRef = ref()
const loaded = ref(false)
const toast = inject('toast')
const swal = inject('swal')

const filterItems = ref([
  {
    title: "All",
    value: -1,
  },
  {
    title: "Pending",
    value: 0,
  },
  {
    title: "Accepted",
    value: 1,
  },
])

const users = computed(() => {
  return userStore.getUsers
    .filter(user => {
      return user.FullName.toLowerCase().includes(search.value.toLowerCase())
    })
    .filter(u => {
      switch (filterUser.value) {
      case -1:
        return true
      case 0:
        return !u.verified_by_admin
      case 1:
        return u.verified_by_admin
      default:
        return false
      }
    })
})

function onView(user) {
  
}

async function onAccept(user) {
  swal.value.fire({
    question: "Are you sure you want to accept this user?",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code, data: response } = await UserService.acceptUser(user.id)

        if (code == 200) {
          toast.success("User accepted successfully.")
          userStore.update(response)
        }

      } catch (err) {
        if (err.response?.data.message) {
          toast.error(err.response.data.message)
        } else {
          toast.error("Failed to accept user.")
        }
      }
    })
}

async function onDelete(user) {
  swal.value.fire({
    question: "Are you sure you want to delete this user",
    dangerMode: true,
  })
    .then(async result => {
      if (!result) return

      try {
        const { status: code } = await UserService.deleteuser(user.id)

        if (code == 204) {
          toast.success("User deleted successfully.")
          userStore.delete(user)
        }

      } catch (err) {
        if (err.response?.data.message) {
          toast.error(err.response.data.message)
        } else {
          toast.error("Failed to delete user.")
        }
      }

    })
}

onMounted(async () => {
  try {
    const { status: code, data: response } = await UserService.getAllExceptCurrent()

    if (code == 200) {
      userStore.initialize(response)
      loaded.value = true
    }
  } catch (error) {
    toast.error("Failed to load company data.")
  }
})

// 
</script>

<template>
  <section>
    <VCard>
      <VCardText>
        <VRow>
          <VCol 
            cols="12"
            md="4"
          >
            <VTextField 
              v-model="search"
              label="Search user"
            />
          </VCol>
          <VCol 
            cols="12"
            md="3"
          >
            <VSelect
              v-model="filterUser"
              label="Filter user"
              :items="filterItems"
            />
          </VCol>
          <VCol 
            cols="12" 
            md="auto"
          >
            <ItemsPerPage
              v-model="itemsPerPage"
              style="width: auto;"
            />
          </VCol>
        </VRow>
      </VCardText>
      <AppTable 
        :headers="tableHeader"
        :items="users"
        :loading="!loaded"
        @click:row="onView"
      >
        <template #item.status="{ item }">
          <VChip
            :color="item.raw.verified_by_admin ? 'success' : 'error'"
            text-color="white"
            rounded="sm"
          >
            {{ item.raw.verified_by_admin ? `accepted (${(item.raw.role == 'user') ? 'auto' : 'manually'})` : 'pending' }} 
          </VChip>
        </template>

        <template #item.action="{ item }">
          <VBtn
            v-if="!item.raw.verified_by_admin"
            icon=""
            variant="text"
            size="small"
            color="success"
            @click.stop="onAccept(item.raw)"
          >
            <VIcon icon="tabler-check" />
            <VTooltip activator="parent">
              Accept user
            </VTooltip>
          </VBtn>
          <!--  -->
          <VBtn
            icon=""
            variant="text"
            size="small"
            color="error"
            @click.stop="onDelete(item.raw)"
          >
            <VIcon icon="tabler-trash" />
            <VTooltip activator="parent">
              Delete user
            </VTooltip>
          </VBtn>
        </template>
      </AppTable>
    </VCard>

    <CompanyModal ref="modalRef" />
  </section>
</template>

<route lang="yaml">
  meta:
    requiresAuth: true
    subject: admin
    action: read
</route>
