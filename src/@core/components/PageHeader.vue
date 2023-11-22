<script>
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: null,
    },
    breadcrumb: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<template>
  <VRow
    no-gutters
    class="mb-3 align-end"
  >
    <VCol
      cols="12"
      md="6"
      sm="12"
      xs="12"
      :class="{ 'mb-3': $vuetify.display.xs || $vuetify.display.sm }"
    >
      <h3 class="page-header-title mb-0">
        {{ title }}
      </h3>
      <p
        class="mb-0 page-header-subtitle"
        :class="{ 'd-none': !subtitle }"
      >
        {{ subtitle }}
      </p>
    </VCol>
    <VCol
      cols="12"
      md="6"
      sm="12"
      xs="12"
    >
      <VBreadcrumbs
        :items="breadcrumb"
        :class="{
          'justify-end': !$vuetify.display.xs && !$vuetify.display.sm,
          'pa-0': $vuetify.display.xs || $vuetify.display.sm,
        }"
      >
        <template #divider>
          <VIcon icon="tabler-chevrons-right" />
        </template>
      </VBreadcrumbs>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.v-breadcrumbs--density-default {
  padding-block: 5px !important;
}

.page-header-title {
  font-size: 18px !important;
}

.page-header-subtitle {
  font-size: 12px !important;
  line-height: 1;
}
</style>
