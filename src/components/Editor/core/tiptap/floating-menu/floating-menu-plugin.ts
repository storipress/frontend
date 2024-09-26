import { posToDOMRect } from '@tiptap/core'
import type { FloatingMenuPluginProps, FloatingMenuViewProps } from '@tiptap/extension-floating-menu'
import { FloatingMenuView } from '@tiptap/extension-floating-menu'
import type { ResolvedPos } from 'prosemirror-model'
import type { EditorState } from 'prosemirror-state'
import { Plugin, PluginKey } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'
import invariant from 'tiny-invariant'
import type { EffectScope } from 'vue'

export type { FloatingMenuPluginProps }

export class HoverTriggerFloatingMenuView extends FloatingMenuView {
  currentPos?: ResolvedPos
  isClickButton = false
  scope: EffectScope

  constructor({ view, element, ...options }: FloatingMenuViewProps) {
    super({ view, element, ...options })

    const dom = view.dom
    dom.addEventListener('mouseover', this.handleMouseOver, { passive: true })
    element.addEventListener('mousedown', this.handleMouseDown, { passive: true, capture: true })
    document.body.addEventListener('click', this.handleClick, { capture: true, passive: true })

    this.scope = effectScope(true)
    this.scope.run(() => {
      const isMobile = useMediaQuery('(max-width: 768px)')
      watch(isMobile, (nowMobile) => {
        this?.tippy?.setProps({
          placement: nowMobile ? 'top' : 'left',
        })
      })
    })
  }

  setClickButton = (event: MouseEvent) => {
    if ((event.target as HTMLElement)?.closest('[data-floating-menu-trigger]')) {
      this.isClickButton = true
    } else {
      this.isClickButton = false
    }
  }

  handleClick = (event: MouseEvent) => {
    this.setClickButton(event)
    if (this.view.dom.contains(event.target as HTMLElement) || this.element.contains(event.target as HTMLElement)) {
      return
    }
    this.hide()
  }

  handleMouseDown = (event: MouseEvent) => {
    this.setClickButton(event)
    if (!this.currentPos) {
      return
    }
    const $pos = this.currentPos
    const node = $pos.node(1)
    // if node already have content, insert it at after. otherwise insert at current point
    const pos = !node || !node.isTextblock || !node.textContent ? $pos.start(1) : $pos.end(1)
    this.editor.commands.setTextSelection(pos)
  }

  handleMouseOver = (event: MouseEvent) => {
    if (!event.target || this.isClickButton) {
      return
    }

    this.createTooltip()
    const { tippy, view } = this
    const $pos = this.posAtCursor(event.target as Node)
    if (!$pos) {
      this.hide()
      return
    }
    // depth > 0 -> normal node
    // depth == 0 -> atom node
    const from = $pos.depth > 0 ? $pos.start(1) : $pos.pos
    const to = $pos.depth > 0 ? $pos.end(1) : from

    invariant(tippy, 'tippy is not defined')
    this.currentPos = $pos

    tippy.setProps({
      getReferenceClientRect: () => {
        const pos = posToDOMRect(view, from, to)
        return { ...pos, height: 24, width: 0 }
      },
    })
    this.show()
  }

  hide = () => {
    this.currentPos = undefined
    if (!this.isClickButton) {
      super.hide()
    }
  }

  update = (view: EditorView, oldState?: EditorState) => {
    this.currentPos = undefined
    super.update(view, oldState)
  }

  posAtCursor(dom: Node): ResolvedPos | void {
    const { view } = this
    const pos = view.posAtDOM(dom, 0)
    if (pos < 0) {
      return
    }

    const $pos = view.state.doc.resolve(pos)
    // we probably select on an atom node, fallback to use nodeAfter
    if ($pos.depth === 0) {
      const node = $pos.nodeAfter
      if (node?.type.isAtom) {
        // our assume is correct
        return $pos
      }
      return
    }
    const node = $pos.node(1)

    if (!node) {
      return
    }

    return $pos
  }

  destroy() {
    const { element, view, handleClick, handleMouseDown, handleMouseOver } = this
    const dom = view.dom

    dom.removeEventListener('mouseover', handleMouseOver)
    element.removeEventListener('mousedown', handleMouseDown, { capture: true })
    document.body.removeEventListener('click', handleClick, { capture: true })

    this.scope.stop()
    super.destroy()
  }
}

export function FloatingMenuPlugin(options: FloatingMenuPluginProps) {
  return new Plugin({
    key: typeof options.pluginKey === 'string' ? new PluginKey(options.pluginKey) : options.pluginKey,
    view: (view) => new HoverTriggerFloatingMenuView({ view, ...options }),
  })
}
