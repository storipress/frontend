import { render, templates } from 'eta'
import postcss from 'postcss'
import nested from 'postcss-nested'

import type { StyleTree } from '../style-tree'
import { renderHelpers } from '../style-tree'
import breakpointsTemplate from './breakpoints.scss.ejs'
import discardEmpty from './discard-empty'
import stylesTemplate from './styles.scss.ejs'
import treeTemplate from './tree.scss.ejs'

templates.define('styles', stylesTemplate)
templates.define('breakpoints', breakpointsTemplate)
templates.define('tree', treeTemplate)

const processor = postcss([nested(), discardEmpty()])

export function generate(root: StyleTree, useDeepSelector = false): string {
  const data = render(
    treeTemplate,
    { root },
    {
      ...renderHelpers,
      useDeepSelector,
    },
  ) as string
  const { css } = processor.process(data)
  return css
}
