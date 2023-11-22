<script setup>
import { helpers } from '@/helpers';
import useAuthStore from '@/stores/auth.store';
import { computed } from 'vue';

const data = useAuthStore()

const computedCardData = computed(() => {
  return [
  {
      title: "ADDRESS",
      icon: "mdi-home",
      color: "success",
      value: data.getUserData.address ?? "Not Set",
    },
    {
      title: "GENDER",
      icon: "mdi-gender-male-female",
      color: "success",
      value: data.getUserData.gender ?? "Not Set",
    },
    {
      title: "MOBILE",
      icon: "mdi-cellphone",
      color: "success",
      value: data.getUserData.mobile_number ?? "Not Set",
    },
    {
      title: "EMAL",
      icon: "mdi-email",
      color: "success",
      value: data.getUserData.email ?? "Not Set",
    },
    {
      title: "COUNTRY",
      icon: "mdi-earth",
      color: "success",
      value: data.getUserData.country ?? "Not Set",
    },
    {
      title: "BIRTHDATE",
      icon: "mdi-calendar",
      color: "success",
      value: (data.getUserData.birth_date && helpers.formater.dateToWord(data.getUserData.birth_date)) ?? "Not Set",
    },
  ];
})

// 
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          v-for="cardData in computedCardData"
          :key="cardData.title"
          cols="12"
          sm="6"
          md="4"
          
        >
          <VCard style="border: 2px solid rgb(var(--v-theme-surface)); background-color: rgb(var(--v-theme-background));">
            <VCardText class="pa-3">
              <VRow>
                <VCol cols="12">
                  <div class="d-flex flex-row gap-2 align-center">
                    <VIcon
                      size="30"
                      :icon="cardData.icon"
                      color="success"
                    />

                    <span class="d-block text-md font-weight-bold">{{ cardData.title }}</span>
                  </div>  
                </VCol>  
                <VCol
                  cols="12"
                  class="py-0"
                >
                  <VDivider />  
                </VCol>
                <VCol cols="12">
                  <h6 class="text-h6 font-weight-bold text-center text-dark">
                    {{ cardData.value }}
                  </h6>  
                </VCol>
              </VRow>
            </VCardText>  
          </VCard>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
