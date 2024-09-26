import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import WriteMenu from './WritingMenu.vue'
import { askAI } from './ask-ai'
import type { WriteMenuOptions, WriteMenuProps } from './writing-menu-plugin'

export const writeMenuOptions: Partial<WriteMenuOptions> = {
  command: ({ editor, range, props }) => {
    askAI({ editor, prompt: props.prompt, promptType: props.promptType, range, requestSource: 'next-step' })
  },

  render: () => {
    let component: VueRenderer
    let popup: Instance[]
    let prevState = ''

    return {
      onStart: (props: WriteMenuProps) => {
        component = new VueRenderer(WriteMenu, {
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
                  offset: [0, 0],
                },
              },
            ],
          },
        })
      },

      onUpdate(props: WriteMenuProps) {
        // onStart can be called before onUpdate
        if (!component || !popup) {
          return
        }

        // Only update the component if the state has changed
        if (prevState !== props.state) {
          component.updateProps(props)
        }

        prevState = props.state

        popup[0].setProps({
          hideOnClick: false,
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}

export default writeMenuOptions
