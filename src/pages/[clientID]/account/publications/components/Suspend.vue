<script setup lang="ts">
import { Destructive } from '@storipress/core-component'
import { LeavePublicationDocument } from '~/graphql-operations'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Workspace } from '~/graphql-operations'

const props = defineProps<{ open: boolean; publication: Omit<Workspace, 'hidden'> }>()

const emit = defineEmits<(event: 'close') => void>()

useHead({
  title: 'Storipress account profile',
})

const workspaceStore = useWorkspaceStore()
const { onDone: onDoneLeavePublication, mutate: mutateLeavePublication } = useMutation(LeavePublicationDocument)

onDoneLeavePublication(() => {
  workspaceStore.reInitialize()
})
function onSuspendedUser() {
  mutateLeavePublication({ id: props.publication.id })
  emit('close')
}
</script>

<template>
  <Destructive
    :visible="open"
    title="Leave publication: Are you sure?"
    :confirm-value="`${publication.name}/Leave-Publication`"
    button-text="leave publication"
    @on-modal-close="emit('close')"
    @on-click-delete="onSuspendedUser"
  >
    <span>By leaving, you suspend yourself from the publication.</span>
    <br />
    <br />
    <span
      >Your articles on that publication will be preserved, but you will need to request access from the publication
      owner to edit them or access broader publication functions.</span
    >
  </Destructive>
</template>

<style scoped></style>
