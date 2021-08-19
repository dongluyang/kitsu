<template>
<div
  :class="{
    field: withMargin,
    'field--narrow': narrow
  }"
>
  <label class="label" v-if="label.length > 0">
    {{ label }}
  </label>
  <div
    class="status-combo"
  >
    <div
      class="flexrow"
      @click="toggleStatusList"
    >
      <div
        class="selected-status-line flexrow-item"
      >
        <span
          class="tag"
          :style="{
            background: backgroundColor(currentStatus),
            color: color(currentStatus)
          }"
          v-if="currentStatus"
        >
          {{ currentStatus.short_name }}
        </span>
      </div>
      <icon name="chevron-down" class="down-icon flexrow-item"/>
    </div>
    <div
      class="select-input"
      ref="select"
      v-if="showStatusList"
    >
      <div
        class="status-line"
        v-for="status in taskStatusList"
        @click="selectStatus(status)"
        :key="status.id"
      >
        <span
          class="tag"
          :style="{
            background: backgroundColor(status),
            color: color(status)
          }"
        >
          {{ status.short_name }}
        </span>
      </div>
    </div>
  </div>
  <combobox-mask
    :displayed="showStatusList"
    @click="toggleStatusList"
  />
</div>
</template>

<script>
import { mapGetters } from 'vuex'

import colors from '@/lib/colors'
import Icon from '@/components/widgets/Icon'
import ComboboxMask from '@/components/widgets/ComboboxMask'

export default {
  name: 'combobox-status',

  components: {
    Icon,
    ComboboxMask
  },

  data () {
    return {
      showStatusList: false
    }
  },

  props: {
    label: {
      default: '',
      type: String
    },
    taskStatusList: {
      default: () => [],
      type: Array
    },
    modelValue: {
      default: '',
      type: String
    },
    narrow: {
      default: false,
      type: Boolean
    },
    withMargin: {
      default: true,
      type: Boolean
    },
    addPlaceholder: {
      default: false,
      type: Boolean
    }
  },

  mounted () {
    this.selectedTaskStatus = this.taskStatus
  },

  computed: {
    ...mapGetters([
      'isDarkTheme',
      'taskStatusMap'
    ]),

    currentStatus () {
      if (this.modelValue) {
        return this.taskStatusMap.get(this.modelValue)
      } else if (this.addPlaceholder) {
        return {
          short_name: '+ status',
          color: '#999'
        }
      } else {
        return this.taskStatusList[0]
      }
    }
  },

  methods: {
    selectStatus (status) {
      console.log(status)
      this.$emit('update:modelValue', status.id)
      this.showStatusList = false
    },

    backgroundColor (taskStatus) {
      if (
        (!taskStatus || taskStatus.short_name === 'todo') &&
        !this.isDarkTheme
      ) {
        return '#ECECEC'
      } else if (
        (!taskStatus || taskStatus.short_name === 'todo') &&
        this.isDarkTheme
      ) {
        return '#5F626A'
      } else if (this.isDarkTheme) {
        return colors.darkenColor(taskStatus.color)
      } else {
        return taskStatus.color
      }
    },

    color (taskStatus) {
      if ((!taskStatus || taskStatus.short_name !== 'todo') || this.isDarkTheme) {
        return 'white'
      } else {
        return '#333'
      }
    },

    toggleStatusList () {
      this.showStatusList = !this.showStatusList
    }
  }
}
</script>

<style lang="scss" scoped>
.dark {
  .select-input,
  .status-line,
  .status-combo {
    background: $dark-grey-light;
    border-color: $dark-grey;
  }

  .status-line:hover {
    background: $dark-purple;
  }
}

.status-combo {
  background: $white;
  min-width: 120px;
  width: 120px;
  border: 1px solid $light-grey-light;
  user-select: none;
  cursor: pointer;
  margin: 0;
  margin-top: 1px;
  vertical-align: middle;
  position: relative;
}

.status-combo:hover {
  border: 1px solid $green;
}

.field--narrow .status-combo {
  padding: 0;
  margin: 0;
}

.selected-status-line {
  text-transform: uppercase;
  flex: 1;
}

.status-line {
  background: $white;
  cursor: pointer;
  margin: 0;
  text-transform: uppercase;

  &:hover {
    background: $purple;
  }
}

.down-icon {
  width: 15px;
  min-width: 15px;
  margin-right: 0.4em;
  margin-top: 5px;
  color: $green;
  cursor: pointer;
}

.select-input {
  background: $white;
  width: 120px;
  position: absolute;
  border: 1px solid $light-grey-light;
  z-index: 300;
  margin-left: -1px;
  max-height: 180px;
  top: 33px;
  left: 0;
  overflow-y: auto;
}

.field .label {
  padding-top: 5px;
}
</style>
