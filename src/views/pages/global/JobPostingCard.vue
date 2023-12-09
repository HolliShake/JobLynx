<script setup>
import { helpers } from '@/helpers';

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  autoFit: {
    type: Boolean,
    default: false
  }
})

const formatDescription = (description) => {
  const TRUNCATE = 100

  if (description.length > TRUNCATE) {
    return description.substring(0, TRUNCATE - 3) + '...'
  }

  return description
}

const getSkills = (skills) => {
  const TRUNCATE = 5
  const array = skills.split(' ')

  if (array.length < TRUNCATE) {
    return array
  }

  return [
    ...array.slice(0, TRUNCATE),
    `+${array.length - TRUNCATE} more`
  ]
}

// 
</script>

<template>
  <VCard 
    :width="(!props.autoFit) ? 360 : 'auto'"
    :to="{
      name: 'browse-job-post-id',
      params: {
        id: helpers.security.encrypt(props.data.id)
      },
      props: true,
    }"
    :ripple="false"
    @click.stop="$event => null"
  >
    <VImg 
      :src="helpers.resolver.getImagePath(props.data.banner.file_name)"
      alt="Job Posting Card"
      cover
      width="100%"
      height="210"
    />
    <VCardText class="pa-3">
      <VRow>
        <VCol cols="12">
          <h2 class="card-title">{{ props.data.position.title }}</h2>
          <small class="d-block mt-n1 text-xs text-disabled">
            <VIcon 
              icon="tabler-map-pin-filled"
              color="error"
              size="14"
            />
            {{ props.data.position.office.name }} {{ props.data.position.office.address }}, {{ props.data.position.office.country }}
          </small>
        </VCol>
        <VCol cols="12">
          <span class="text-sm font-weight-bold">SKILLS</span>
          <div class="d-flex flex-row flex-wrap gap-1 py-2">
            <VChip
              v-for="skill in getSkills(props.data.position.skills)"
              :key="skill"
              color="primary"
              rounded="lg"
            >
              <span class="text-xs">{{ skill }}</span>
            </VChip>
          </div>
        </VCol>
        <VCol 
          cols="12" 
          class="py-0"
        >
          <div class="d-block text-end">
            <div class="d-inline text-end">
              <span class="text-h3 font-weight-thin">{{ props.data.position.salary.currency }} {{ helpers.formater.numberToMoney(props.data.position.salary.value) }}</span> / <span>{{ props.data.position.payment_type }}</span>
            </div>
          </div>
        </VCol>
        <VCol cols="12">
          <VBtn
            block
            color="mgreen"
            @click.stop="$event => null"
          >
            Read More
          </VBtn>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>
