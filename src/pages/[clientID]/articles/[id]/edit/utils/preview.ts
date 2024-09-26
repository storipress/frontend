import { useToggle, whenever } from '@vueuse/core'
import invariant from 'tiny-invariant'
import type { Ref } from 'vue'
import type { FormModel } from '../types'
import { useUpdate } from './update'
import { useLayouts } from './layouts'
import type { PreviewData } from './types'
import { useEditorState } from '~/modules/editor/pinia'
import { useProviderStore } from '~/stores/preview-provider'
import type { LayoutData } from '~/components/Manager/StylePicker'
import { assertStyleTree, createStyleTree } from '~/lib/dynamic-style'
import { shiftH1H2 } from '~/lib/dynamic-style/patch-style-tree'

export function usePreview(id: string, formModel: Ref<FormModel>, previewData: PreviewData, loading: Ref<boolean>) {
  const store = useProviderStore()
  const editorState = useEditorState()
  const [isPreview, previewChange] = useToggle(false)
  let listeningToUpdate = false
  const { layoutsResult, layoutMap, customLayouts } = useLayouts()
  const { mutateAll } = useUpdate(id, formModel)

  function whetherUpdate(headlineAlt: string, headlineCaption: string, headlineURL: string | null): boolean {
    if (loading.value || !listeningToUpdate) {
      return false
    }

    return (
      (headlineAlt && headlineAlt !== formModel.value.coverAlt) ||
      (headlineCaption && headlineCaption !== formModel.value.coverCaption) ||
      headlineURL !== formModel.value.coverUrl
    )
  }

  const { ignoreUpdates } = watchIgnorable(
    // allow update in preview
    () => ({
      headlineAlt: store.headlineAlt,
      headlineURL: store.headlineURL,
      headlineCaption: store.headlineCaption,
    }),
    ({ headlineAlt, headlineCaption, headlineURL }) => {
      if (whetherUpdate(headlineAlt, headlineCaption, headlineURL)) {
        formModel.value.coverAlt = headlineAlt
        formModel.value.coverUrl = headlineURL || ''
        formModel.value.coverCaption = headlineCaption
        mutateAll()
      }
    },
  )

  function setPreviewStore(template: string, { styles, elements }: LayoutData) {
    syncFormToPreview()
    store.templateName = template
    store.elements = elements
    store.userTree = shiftH1H2(styles)
    store.$sync()
  }

  function setCustomPreviewStore(customLayoutUrl: string) {
    syncFormToPreview()
    store.isCustomLayout = true
    store.customLayoutUrl = customLayoutUrl
    store.$sync()
  }

  function syncFormToPreview() {
    const { coverUrl, coverAlt, deskName, authors } = formModel.value
    const html = computed(() => editorState.state.html)
    ignoreUpdates(() => {
      store.headlineURL = coverUrl
      store.headlineAlt = coverAlt
    })
    store.content = html.value
    store.desk = deskName
    store.authors = (authors ?? []).map((author) => ({
      ...author,
      name: author.name || '',
      url: '#',
    }))
  }

  function setToLayoutId(id: string) {
    invariant(layoutsResult.value, 'layoutsResult is not ready')
    const layout = layoutMap.value.get(id)
    invariant(layout, 'layout not found')
    formModel.value.previewId = id
    previewData.templateInfo.value = {
      template: layout.template,
      data: {
        ...layout.data,
        styles: assertStyleTree(layout.data.styles || createStyleTree('article'), 'article'),
      },
    }
  }

  watch(
    previewData.templateInfo,
    ({ template, data }) => {
      setPreviewStore(template, data)
    },
    { flush: 'sync' },
  )

  whenever(
    previewData.id,
    (id) => {
      if (customLayouts?.value && customLayouts.value?.length > 0) {
        formModel.value.previewId = id
        return
      }
      setToLayoutId(id)
    },
    { flush: 'sync' },
  )

  whenever(
    isPreview,
    () => {
      listeningToUpdate = true
      syncFormToPreview()
      store.$sync()
    },
    { flush: 'sync' },
  )

  return {
    isPreview,
    previewChange,
    setPreviewStore,
    setCustomPreviewStore,
    setToLayoutId,
  }
}
