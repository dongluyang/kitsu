<template>
<div :class="{ field: withMargin }">
  <label class="label" v-if="label">{{ label }}</label>
  <p class="control flexrow">
    <date-picker
      v-model="localValue"
    >
      <template
        :v-slot="{ inputValue, inputEvents }"
        :locale="locale"
        :attributes="attributes"
        @dayclick="onDayClick"
      >
        <input
          :class="{
            'date-input': true,
            input: true,
            short: shortDate
          }"
          :value="inputValue"
          v-on="inputEvents"
        />
      </template>
    </date-picker>
    <span
      class="clear-button unselectable"
      @click="event => clearValue(event)"
      v-show="localValue && canDelete"
    >
      +
    </span>
  </p>
</div>
</template>

<script>
import moment from 'moment-timezone'
import { mapGetters, mapActions } from 'vuex'
import { DatePicker } from 'v-calendar'

import { domMixin } from '@/components/mixins/dom'
import { formatSimpleDate } from '@/lib/time'

export default {
  name: 'date-field',

  components: {
    DatePicker
  },

  mixins: [domMixin],

  props: {
    disabledDates: {
      default: () => {},
      type: Object
    },
    label: {
      default: '',
      type: String
    },
    shortDate: {
      default: true,
      type: Boolean
    },
    modelValue: {
      default: new Date(),
      type: Date
    },
    canDelete: {
      default: true,
      type: Boolean
    },
    withMargin: {
      default: true,
      type: Boolean
    }
  },

  data () {
    return {
      localValue: null,
      attributes: {
        popover: {
          visibility: 'visible'
        }
      }
    }
  },

  mounted () {
    console.log(this.modelValue)
    this.localValue = this.modelValue
  },

  computed: {
    ...mapGetters([
      'user'
    ]),

    renderedDate (date) {
      return formatSimpleDate(date)
    },

    locale () {
      return this.user.locale.substring(0, 2)
    }
  },

  methods: {
    ...mapActions([
    ]),

    clearValue (event) {
      this.pauseEvent(event)
      this.localValue = null
      this.$emit('update:modelValue', null)
    },

    onDayClicked (day) {
      this.$emit('update:modelValue', moment(day.date))
    }
  },

  watch: {
    modelValue () {
      this.localValue = this.modelValue
    },
    localValue () {
    }
  }
}
</script>
<style lang="scss" scoped>
.control {
  position: relative;
}

.clear-button {
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 0px;
  color: $light-grey;
  transform: rotate(45deg);
}
</style>
