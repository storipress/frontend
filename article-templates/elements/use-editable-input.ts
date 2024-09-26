import { computed, toRef, warn } from 'vue'
import { useArticleElement } from './inject'

export function useEditableInput(field: 'title' | 'blurb' | 'headlineCaption') {
  const element = useArticleElement()
  const contentAttrs = computed(() => {
    return element.editable ? {} : { innerHTML: element[field] }
  })

  watch(
    () => element.editable,
    () => warn('element.editable should not change in runtime'),
  )
  return { contentAttrs, editable: toRef(element, 'editable') }
}
