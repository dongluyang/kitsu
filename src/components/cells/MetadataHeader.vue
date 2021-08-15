<template>
  <th
    scope="col"
    class="metadata-descriptor"
    :class="{'datatable-row-header': isStick}"
    :style="{'left': left}"
  >
    <div class="flexrow">
      <span class="flexrow-item descriptor-name">
        {{ descriptor.name }}
      </span>
      <icon
        @click="$emit('show-metadata-header-menu', $event)"
        name="chevron-down"
        class="header-icon flexrow-item"
      />
    </div>
  </th>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'MetadataHeader',
  props: {
    descriptor: Object,
    isStick: {
      type: Boolean,
      default: false
    },
    left: {
      type: String,
      default: '0px'
    }
  },
  components: { Icon }
}
</script>

<style lang="scss" scoped>

th.metadata-descriptor {
  min-width: 120px;
  max-width: 120px;
  width: 120px;
  overflow-wrap: break-word;
  hyphens: auto;
}

</style>
