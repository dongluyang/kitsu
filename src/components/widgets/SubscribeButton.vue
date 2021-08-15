<template>
<button
  class="button"
  :title="buttonTitle"
  @click="$emit('click')"
>
  <icon
    name="eye"
    class="icon is-small only-icon"
    v-if="subscribed"
  />
  <icon
    name="eye-off"
    class="icon is-small only-icon"
    v-else
  />
</button>
</template>

<script>
import Icon from '@/components/widgets/Icon'

export default {
  name: 'subscribe-button',
  components: {
    Icon
  },
  props: {
    subscribed: {
      default: false,
      type: Boolean
    }
  },

  computed: {
    buttonTitle () {
      if (!this.subscribed) {
        return this.$t('tasks.subscribe_notifications')
      } else {
        return this.$t('tasks.unsubscribe_notifications')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button .icon.is-small.only-icon {
  margin-right: 0;
}
</style>
