<template>
<span>
  <vue-feather :type="name" />
</span>
</template>

<script>
export default {
  name: 'icon',
  components: {
  },

  props: {
    name: {
      type: String,
      required: true
    }
  },

  computed: {
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
