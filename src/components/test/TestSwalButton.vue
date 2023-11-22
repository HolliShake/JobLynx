<script setup>

// 👉 Swal
const swal = inject("swal")

// 👉 Toast
const toast = inject("toast")

async function click() {
  swal.value.fire({
    question: "Lorem ipsum dolor sit amet consectetur...",
    dangerMode: true,
  })
    .then(async result => {
      if (result)
      {
        toast.success("Yes")
      }
    })
}

// 
</script>

<template>
  <VBtn
    variant="elevated"
    @click="click"
  >
    <div class="px-2">
      <VIcon
        block
        start
        icon="tabler-cards-filled"
      />
      <span>Test Swal</span>
    </div>
  </VBtn>
</template>
