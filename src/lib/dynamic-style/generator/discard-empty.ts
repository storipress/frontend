// Grab and modify from  cssnano https://github.com/cssnano/cssnano

import type { Helpers, PluginCreator, Root } from 'postcss'

const postcssPlugin = 'postcss-discard-empty'

const discardAndReport = function discardAndReport(css: Root, { result }: Helpers) {
  function discardEmpty(node: any) {
    const { type, nodes: sub, params, value, selector } = node

    if (sub) {
      node.each(discardEmpty)
    }

    if (
      (type === 'decl' && !value) ||
      (type === 'rule' && !selector) ||
      (sub && sub.length === 0) ||
      (type === 'atrule' && ((!sub && !params) || (!params && sub.length === 0)))
    ) {
      node.remove()

      result.messages.push({
        type: 'removal',
        postcssPlugin,
        node,
      })
    }
  }

  css.each(discardEmpty)
}

const pluginCreator: PluginCreator<void> = () => {
  return {
    postcssPlugin,
    Once: discardAndReport,
  }
}

pluginCreator.postcss = true

export default pluginCreator
