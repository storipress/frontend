<script lang="ts" setup>
// import 'codemirror/mode/htmlmixed/htmlmixed'

// import { computed, defineComponent, inject, nextTick, onMounted, ref, watch } from 'vue'
// import CodeMirror from 'codemirror'

// import { useElement } from './base-element'
// import { usePath } from './use-path'

// export default defineComponent({
//   props: {
//     kind: {
//       type: String,
//       required: true,
//     },
//   },

//   setup(props) {
//     const element = useElement()
//     const blockId = inject<string>('blockId')
//     const { path } = usePath(computed(() => [`b-${blockId}`, props.kind]))
//     const isSelected = computed(() => blockId === element.value.selectedBlock?.id)
//     const content = computed({
//       get(): string {
//         // FIXME: fix type
//         // @ts-expect-error fixme
//         const value = path.value.reduce((obj, key) => obj?.[key], element.value.texts)

//         return value ?? ''
//       },
//       set(value: string) {
//         element.value.setElementText({
//           path: path.value,
//           data: value,
//         })
//       },
//     })

//     const textarea = ref<HTMLTextAreaElement>()
//     onMounted(() => {
//       const cm = CodeMirror.fromTextArea(textarea.value!, {
//         mode: 'htmlmixed',
//         lineNumbers: true,
//         lineWrapping: true,
//         value: content.value,
//       })
//       cm.on('change', () => {
//         content.value = cm.getValue()
//       })

//       watch(
//         isSelected,
//         async (isSelected) => {
//           if (isSelected) {
//             element.value.setIsPreviewHtml(false)
//             await nextTick()
//             cm.refresh()
//           }
//         },
//         { immediate: true }
//       )
//     })

//     return { textarea, content, isPreview: computed(() => !isSelected.value || element.value.isPreviewHtml) }
//   },
// })
</script>

<template>
  <div>
    <!-- <div :class="isPreview && 'hidden'">
      <textarea ref="textarea" :value="content" />
    </div>
    <div class="items-center justify-center h-20" :class="isPreview ? 'flex' : 'hidden'">
      <div class="text-4xl">Html Block</div>
    </div> -->
  </div>
</template>
