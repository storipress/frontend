import { describe, expect, it } from 'vitest'
import { generate } from '..'
import { createStyleTree } from '../../style-tree'

describe('code-generator', () => {
  describe('generate', () => {
    it('return css', () => {
      const tree = createStyleTree('foo')
      tree.styles = {
        fontSize: { xs: '12px', lg: '14px', md: '16px' },
      }
      expect(generate(tree)).toMatchSnapshot()

      const tree2 = createStyleTree('foo')
      tree2.children = {
        '& p': {
          name: '& p',
          styles: {
            fontSize: { xs: '12', lg: '14', md: '16' },
          },
          children: {},
        },
      }
      expect(generate(tree2)).toMatchSnapshot()
    })

    it('could use null style', () => {
      const tree = createStyleTree('foo')
      tree.styles = {
        fontSize: { xs: '12px', lg: '14px', md: null },
      }
      expect(generate(tree)).toMatchSnapshot()
    })

    it('could use deep selector', () => {
      const tree = createStyleTree('foo')
      tree.children = {
        '& p': {
          name: '& p',
          styles: {
            fontSize: { xs: '12', lg: '14', md: '16' },
          },
          children: {},
        },
      }
      const css = generate(tree, true)
      expect(css).toContain('v-deep')
      expect(css).toMatchSnapshot()
    })
  })
})
