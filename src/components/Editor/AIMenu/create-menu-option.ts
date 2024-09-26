import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import CommandsList from './AIMenu.vue'
import { askAI } from './ask-ai'

const options: Partial<SuggestionOptions> = {
  char: ' ',
  startOfLine: true,
  allowedPrefixes: [],

  command: ({ editor, range, props }) => {
    askAI({ editor, prompt: props.prompt, promptType: props.promptType, range, requestSource: 'create' })
  },

  render: () => {
    let component: VueRenderer | undefined
    let popup: Instance[] | undefined

    return {
      onStart: (props: SuggestionProps) => {
        const { $from } = props.editor.state.selection
        if ($from.nodeAfter?.textContent || $from.nodeBefore?.textContent !== ' ' || $from.parentOffset !== 1) {
          popup?.[0].destroy()
          return
        }

        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          animation: 'scale',
          inertia: true,
          getReferenceClientRect: props.clientRect as () => DOMRect,
          // Append to editor parent element so we can get the width of the editor
          appendTo: () => props.editor.view.dom.parentElement as HTMLElement,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          maxWidth: 'none',
          onCreate(instance) {
            instance.popper.classList.add('w-full')
          },
          popperOptions: {
            modifiers: [
              { name: 'flip', enabled: false },
              {
                name: 'offset',
                options: {
                  offset: [-8, 0],
                },
              },
            ],
          },
        })
      },

      onUpdate(props: SuggestionProps) {
        component?.updateProps(props)
        popup?.[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onExit() {
        popup?.[0].destroy()
        component?.destroy()
      },
    }
  },
}

export default options
