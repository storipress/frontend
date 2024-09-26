import type { Ref } from 'vue'
import { isRef, onMounted, onUnmounted, ref, unref, watch } from 'vue'
import type { AnyMaskedOptions, InputMask } from 'imask'
import imask from 'imask'

interface UseImaskReturn {
  el: Ref<HTMLElement>
  value: Ref<string>
  unmaskedValue: Ref<string>
  typedValue: Ref<string | number | Date>
}

interface UseImaskOptions {
  opts: AnyMaskedOptions | Ref<AnyMaskedOptions>
  initialValue?: string
  onAccept?: (value: string, mask: InputMask<AnyMaskedOptions>) => void
  onComplete?: (value: string, mask: InputMask<AnyMaskedOptions>) => void
}

export function useIMask({ opts, initialValue, onAccept, onComplete }: UseImaskOptions): UseImaskReturn {
  const el = ref()
  const value = ref('')
  const unmaskedValue = ref('')
  const typedValue = ref<string | number | Date>('')

  if (!isRef(opts)) {
    opts = ref(opts)
  }

  onMounted(() => {
    const input = el.value
    const mask = imask(input, unref(opts))

    if (initialValue) {
      mask.value = initialValue
    }

    mask.on('accept', () => {
      value.value = mask.value
      unmaskedValue.value = mask.unmaskedValue
      typedValue.value = mask.typedValue
      onAccept?.(mask.value, mask)
    })

    mask.on('complete', () => {
      value.value = mask.value
      unmaskedValue.value = mask.unmaskedValue
      typedValue.value = mask.typedValue
      onComplete?.(mask.value, mask)
    })

    watch(opts, (opts) => {
      mask.updateOptions(unref(opts))
    })

    onUnmounted(() => {
      mask.destroy()
    })
  })

  return {
    el,
    value,
    unmaskedValue,
    typedValue,
  }
}
