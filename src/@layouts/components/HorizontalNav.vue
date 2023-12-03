<script setup>
import {
  HorizontalNavGroup,
  HorizontalNavLink,
} from '@layouts/components'

const props = defineProps({
  navItems: {
    type: null,
    required: true,
  },
})

const resolveNavItemComponent = item => {
  if ('children' in item)
    return HorizontalNavGroup
  
  return HorizontalNavLink
}

const isShown = (item) => {
  if (!item.hidden) return true

  if (item.hidden instanceof Function) {
    return !item.hidden()
  }

  return false
}
</script>

<template>
  <ul class="nav-items">
    <template
      v-for="(item, index) in navItems"
      :key="index"
    >
      <Component
        :is="resolveNavItemComponent(item)"
        :item="item"
        v-if="isShown(item)"
      />
    </template>
  </ul>
</template>

<style lang="scss">
.layout-wrapper.layout-nav-type-horizontal {
  .nav-items {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
