<script setup lang="ts">
import { usePublicationPermission } from '~/composables/permission/publication'
import { useRolePermissions } from '~/hooks/useRedirect'
import { useUserSubscription } from '~/composables'

const props = defineProps<{ clientID: string; group: string }>()

const { canSettingContentModel, ready: readyPublicationPermission } = usePublicationPermission()
const { canAccessAllPlusFeatures, ready: readyUserSubscription } = useUserSubscription()
const hasPermissions = computed(() => canAccessAllPlusFeatures.value && canSettingContentModel.value)
const ready = computed(() => readyPublicationPermission.value && readyUserSubscription.value)
useRolePermissions(hasPermissions, `/${props.clientID}/`, ready)
</script>

<template>
  <div />
</template>

<style lang="scss" scoped></style>
