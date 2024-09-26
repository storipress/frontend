import { stripIndent } from 'proper-tags'
import { Editor } from '@tiptap/vue-3'
import { useScrollableList } from '../scrollable-list'
import { createMenu } from '../write-menu-items'
import { customInsertContent, transMarkdownContentToHtml } from '../utils'
import { extensions } from '~/components/Editor/core/tiptap/__tests__/helper'

const selectItem = vi.fn()

describe('transMarkdownContentToHtml', () => {
  it('can convert markdown to html', () => {
    expect(
      transMarkdownContentToHtml(stripIndent`
      ## H2
      ### H3

      - list item 1
      - list item 2

      1. number 1
      2. number 2
    `),
    ).toMatchInlineSnapshot(
      `"<h2>H2</h2><h3>H3</h3><ul><li>list item 1</li><li>list item 2</li></ul><ol><li>number 1</li><li>number 2</li></ol>"`,
    )
  })
})

describe('scrollableList trigger event', () => {
  it('trigger Enter', () => {
    const { onKeyDown } = useScrollableList({
      items: createMenu,
      itemRefs: ref([]),
      onSubmit: selectItem,
    })

    onKeyDown({ event: { key: 'Enter', preventDefault: () => {} } })
    expect(selectItem).toHaveBeenCalled()
  })
})

describe('customInsertContent', () => {
  it('update editor content', () => {
    const editor = new Editor({
      extensions,
      content: {
        type: 'doc',
      },
    })
    customInsertContent(0, editor, '\n')
    customInsertContent(3, editor, '123')
    expect(editor.getHTML()).toBe(`<p>
</p><p>123</p>`)
  })
})
