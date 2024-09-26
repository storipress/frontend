<script>
export default {
  name: 'NuxtImg',
  inheritAttrs: false,
}
</script>

<template>
  <img v-bind="$attrs" v-on="$attrs" />
</template>
