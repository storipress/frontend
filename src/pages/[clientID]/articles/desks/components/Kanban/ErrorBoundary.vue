<script lang="ts" setup>
import { onErrorCaptured, ref } from 'vue'
import { Cause, Runtime } from 'effect'
import { captureException } from '@sentry/vue'
import type { InternalError } from './ArticleDataSource/errors'
import { isInternalError } from './ArticleDataSource/errors'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'

const error = ref()

const [confirmReload] = useConfirmFunction([
  {
    type: 'warning',
    icon: 'refresh',
    title: 'Error',
    description:
      "We've identified a UI issue causing the displayed status to not match the server status. Your data is safe on our server. This has been recorded by our system.\nPlease press OK to reload the Kanban.",
    okText: 'OK',
    cancelButtonClass: 'hidden',
    cancelText: '',
  },
])

async function showReload(error_: unknown) {
  error.value = error_
  await confirmReload()
  error.value = undefined
}

onErrorCaptured((error_) => {
  const extractedError = extractError(error_)
  if (extractedError) {
    captureException(extractedError)
    showReload(extractedError)
    return false
  }
})

function extractError(error: unknown): typeof InternalError | null {
  if (isInternalError(error)) {
    return error
  }
  if (Runtime.isFiberFailure(error)) {
    const squashError = Cause.squash(error[Runtime.FiberFailureCauseId])
    if (isInternalError(squashError)) {
      return squashError
    }
  }
  return null
}
</script>

<template>
  <div v-if="error" />
  <slot v-else />
</template>
