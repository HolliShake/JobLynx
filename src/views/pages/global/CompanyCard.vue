<script setup>
import { avatarText } from '@/@core/utils/formatters';
import ManSitting from "@/assets/images/download/man-laptop.png"
import { helpers } from '@/helpers';

const props = defineProps({
  data: {
    type: Object,
    required: true,
  }
})

// 
</script>


<template>
  <VCard
    style="background-color: rgb(var(--v-theme-background));"
    width="300"
  >
    <div style="background-color: #F3EEEA; width: 100%; height: 160px;" />
    
    <div class="d-block text-center" style="margin-top: -55px;">
      <div class="d-inline-block elevation-2" style="border-radius: 360px; border: 2px solid #fff;">
      <VAvatar
        rounded="circle"
        variant="flat"
        color="#F3EEEA"
        size="110"
      >
        <h3 
          v-if="!props.data.user.profile_image"
          class="font-weight-thin"
        >
          {{ avatarText(props.data.company_name) }}
        </h3>
        <VImg 
          v-else 
          cover
          :src="helpers.resolver.getImagePath(props.data.user.profile_image)" alt="company profile" 
        />
      </VAvatar>
    </div>
    </div>
    <VCardText>
      <VRow>
        <VCol cols="12">
          <h3 class="text-center text-truncate text-no-wrap">{{ props.data.company_name }}</h3>
        </VCol>
        <VCol cols="12">
          <VBtn
            block
            color="mblack"
          >
            <span>Visit</span>
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
