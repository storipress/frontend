import { expect, it } from 'vitest'
import { aliasParagraph } from '../patch-style-tree'
import { assertStyleTree } from '../style-tree'

it('aliasParagraph can handle new article template', () => {
  const emptyTree = assertStyleTree({} as any)
  expect(emptyTree).toMatchInlineSnapshot(`
    {
      "children": {},
      "name": "@@jraft/STYLE_TREE_FRAGMENT",
      "styles": {},
    }
  `)
  expect(() => aliasParagraph(assertStyleTree({} as any))).not.toThrow()
})
