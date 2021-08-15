<template>
<div
  class="has-text-right"
  v-if="sorting.length > 0"
>
  {{ label }} {{ sorting[0].name }}
  <a
    @click="$emit('clear-sorting')"
  >x</a>
</div>
</template>

<script>
export default {
  name: 'sorting-info',

  props: {
    label: {
      default: 'Sorted by',
      type: String
    },
    sorting: {
      default: () => [],
      type: Array
    }
  }
}
</script>

<style lang="scss">
</style>
