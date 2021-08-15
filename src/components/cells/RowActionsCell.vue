<template>
<td class="actions has-text-right">
  <button
    class="button"
    data-test="button-history"
    tabindex="-1"
    @click="$emit('history-clicked')"
    v-if="!hideHistory"
  >
    <icon name="clock" class="icon is-small only-icon" />
  </button>

  <button
    class="button"
    data-test="button-edit"
    tabindex="-1"
    @click="$emit('edit-clicked')"
    v-if="!hideEdit && !entry.canceled"
  >
    <icon name="edit" class="icon is-small only-icon" />
  </button>

  <button
    class="button"
    data-test="button-restore"
    tabindex="-1"
    @click="$emit('restore-clicked')"
    v-if="entry.canceled"
  >
    <icon name="rotate-ccw" class="icon is-small only-icon" />
  </button>

  <button
    class="button"
    data-test="button-delete-admin"
    tabindex="-1"
    @click="$emit('delete-clicked')"
    v-if="!hideDelete && !entry.canceled && isCurrentUserAdmin"
  >
    <icon name="trash" class="icon is-small only-icon" />
  </button>

  <button
    class="button"
    data-test="button-delete"
    tabindex="-1"
    @click="$emit('delete-clicked')"
    v-else-if="!hideDelete"
  >
    <icon name="trash" class="icon is-small only-icon" />
  </button>
</td>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Icon from '@/components/widgets/Icon'

export default {
  name: 'row-actions-cell',
  components: {
    Icon
  },

  props: {
    entry: {
      type: Object,
      default: () => {
        return {}
      }
    },
    hideEdit: {
      type: Boolean,
      default: false
    },
    hideDelete: {
      type: Boolean,
      default: false
    },
    hideHistory: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapGetters([
      'isCurrentUserAdmin'
    ])
  },
  methods: {
    ...mapActions([
    ])
  }
}
</script>

<style lang="scss" scoped>
.button {
  margin-left: 0.2em;
}
</style>
