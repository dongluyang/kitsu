<template>
<th scope="row" class="name datatable-row-header">
  <div class="people-name">
    <people-avatar class="avatar" :person="person" />
    <people-name class="people-name" with-link :person="person" />
  </div>
</th>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PeopleAvatar from '../widgets/PeopleAvatar'
import PeopleName from '../widgets/PeopleName'

export default {
  name: 'people-name-cell',
  components: {
    PeopleName,
    PeopleAvatar
  },

  props: {
    person: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters([
    ])
  },
  methods: {
    ...mapActions([
    ])
  }
}
</script>

<style lang="scss" scoped>
.people-name {
  display: flex;
  align-items: center;
  flex-direction: row;
}

.people-name {
  margin-left: 0.6em;
}
</style>
