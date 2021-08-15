<template>
<a
  class="button"
  :title="title"
  :href="path"
  :target="target"
>
  <icon :name="icon" class="icon is-small" />
  <span class="text is-hidden-touch" v-if="text">
    {{ text }}
  </span>
</a>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'button-href-link',
  components: {
    Icon
  },
  props: {
    text: {
      default: '',
      type: String
    },
    path: {
      default: '',
      type: String
    },
    icon: {
      default: '',
      type: String
    },
    title: {
      default: '',
      type: String
    },
    styleclass: {
      default: '',
      type: String
    },
    target: {
      default: '_self',
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.button .icon.is-small {
  margin: 0;
}
</style>
