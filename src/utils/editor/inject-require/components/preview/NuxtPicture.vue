<script>
export default {
  name: 'NuxtPicture',
  inheritAttrs: false,
}
</script>

<template>
  <picture v-bind="$attrs" v-on="$attrs" />
</template>
