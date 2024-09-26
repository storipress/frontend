<script lang="ts" setup>
import ChangePassword from './components/ChangePassword.vue'
import ChangeEmail from './components/ChangeEmail.vue'

useHead({
  title: 'Storipress account profile',
})
</script>

<template>
  <Section title="Security" class="w-full">
    <ChangePassword />
    <hr />
    <ChangeEmail />
  </Section>
</template>

<style></style>
