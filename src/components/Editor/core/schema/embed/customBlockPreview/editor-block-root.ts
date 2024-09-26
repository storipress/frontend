export const EditorBlockRoot = defineComponent(() => {
  const slots = useSlots()
  return () => h('div', { 'data-editor-block-root': 'true' }, slots.default?.())
})
