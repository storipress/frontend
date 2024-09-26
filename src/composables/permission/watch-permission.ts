import type { Ref } from 'vue'
import { watch } from 'vue'

type HTMLInputtableElement =
  | HTMLInputElement
  | HTMLButtonElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLFormElement
  | HTMLFieldSetElement

export function watchToDisabledAllContainedInputs(permVal: Ref<boolean>) {
  const containerElement = ref<HTMLElement>()
  const mapInputToOriginAttributePair = new Map<HTMLInputtableElement, [string, string | null][]>()
  function disabledAllInputs() {
    if (containerElement.value) {
      mapInputToOriginAttributePair.clear()
      const inputs: HTMLInputtableElement[] =
        Array.from(containerElement.value.querySelectorAll('input, button, select, textarea, form, fieldset')) ?? []
      for (const item of inputs) {
        mapInputToOriginAttributePair.set(item, [
          ['disabled', item.getAttribute('disabled')],
          ['tabIndex', item.getAttribute('tabIndex')],
        ])
        item.setAttribute('disabled', '')
        item.setAttribute('tabIndex', '-1')
      }
    }
  }
  function rollbackDisabledChange() {
    for (const [element, attrs] of mapInputToOriginAttributePair.entries()) {
      for (const [name, value] of attrs) {
        if (value === null) element.removeAttribute(name)
        else element.setAttribute(name, value)
      }
    }
    mapInputToOriginAttributePair.clear()
  }
  const observer = new MutationObserver((mutations) => {
    if (!permVal.value && mapInputToOriginAttributePair.size) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          rollbackDisabledChange()
          disabledAllInputs()
        }
      }
    }
  })
  watch(containerElement, (_, old) => {
    if (containerElement.value !== undefined && old === undefined) {
      observer.observe(containerElement.value, { childList: true, subtree: true })
    } else if (containerElement.value === undefined && old !== undefined) {
      observer.disconnect()
    }
  })
  watch(
    [containerElement, permVal],
    () => {
      if (containerElement.value) {
        if (!permVal.value) {
          disabledAllInputs()
        } else {
          rollbackDisabledChange()
        }
      }
    },
    { immediate: true },
  )

  return containerElement
}
