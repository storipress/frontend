<script lang="ts" setup>
import type { FloatVirtualInitialProps } from '@headlessui-float/vue'
import { FloatVirtual, useOutsideClick } from '@headlessui-float/vue'
import { inline, shift } from '@floating-ui/dom'
import { DecorationEnum } from './types'
import StyleGuide from '~/components/StyleGuide/StyleGuide.vue'

interface IProps {
  referenceElement: Element
  shouldShow: boolean
  showApply: boolean
  showDeleted: boolean
  title: string
  type: DecorationEnum
  description: string
  onDismiss: () => void
  onApply: () => void
}

const props = defineProps<{
  floatSetting: IProps | null
}>()

const show = ref(false)

function onInitial({ reference, floating }: FloatVirtualInitialProps) {
  watch(
    () => props.floatSetting,
    (nowSetting) => {
      if (nowSetting?.shouldShow) {
        reference.value = nowSetting.referenceElement

        show.value = true
      } else {
        show.value = false
      }
    },
    { deep: true, immediate: true },
  )

  useOutsideClick(
    floating,
    () => {
      show.value = false
    },
    computed(() => show.value),
  )

  onKeyStroke(() => {
    show.value = false
  })
}

whenever(show, () => {
  // we are reusing same UI to display spell error, we need to avoid to send ai linter track here
  if (props.floatSetting?.type === DecorationEnum.spellCheck) {
    return
  }

  sendTrack('ai_linter_show')
})
</script>

<template>
  <div>
    <FloatVirtual
      portal
      :show="show"
      placement="bottom"
      auto-update
      :offset="4"
      strategy="fixed"
      enter="transition duration-100 ease-out"
      enter-from="transform scale-95 opacity-0"
      enter-to="transform scale-100 opacity-100"
      leave="transition duration-75 ease-in"
      leave-from="transform scale-100 opacity-100"
      leave-to="transform scale-95 opacity-0"
      tailwindcss-origin-class
      :middleware="[inline(), shift()]"
      @initial="onInitial"
    >
      <StyleGuide
        in-editor
        :error-title="floatSetting?.title"
        :error-description="floatSetting?.description"
        :show-apply="floatSetting?.showApply"
        :show-deleted="floatSetting?.showDeleted"
        @dismiss="floatSetting?.onDismiss"
        @apply="floatSetting?.onApply"
        @close="show = false"
      />
    </FloatVirtual>
  </div>
</template>
