<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { Dialog as DialogComponent, DialogOverlay, TransitionChild, TransitionRoot } from '@headlessui/vue'
import Picker from './picker.vue'
import type { UnsplashDialogInfo } from './types'
import { useRemoteDialogProvider } from '~/modules/editor/remote-dialog'
import type { UnsplashClient } from '~/utils/editor/clients/unsplash'

export default defineComponent({
  components: { DialogComponent, DialogOverlay, Picker, TransitionChild, TransitionRoot },

  props: {
    client: {
      type: Object as PropType<UnsplashClient>,
      required: true,
    },
  },

  setup(props) {
    const { param, reply, close } = useRemoteDialogProvider<UnsplashDialogInfo>('unsplash')

    return {
      open: computed(() => Boolean(param.value)),
      close,
      reply,
    }
  },
})
</script>

<template>
  <TransitionRoot as="template" :show="open">
    <DialogComponent class="fixed inset-0 z-[53] flex items-center justify-center" :open="open" @click="close">
      <DialogOverlay class="absolute inset-0 size-full bg-stone-800/75" @click="close" />
      <TransitionChild
        enter="transition duration-100 ease-out"
        enter-from="transform scale-95 opacity-0"
        enter-to="transform scale-100 opacity-100"
        leave="transition duration-75 ease-in"
        leave-from="transform scale-100 opacity-100"
        leave-to="transform scale-95 opacity-0"
      >
        <Picker :client="client" :open="open" @reply="reply" @click.stop />
      </TransitionChild>
    </DialogComponent>
  </TransitionRoot>
</template>
