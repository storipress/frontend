import { produce } from 'immer'
import type { Promisable } from 'type-fest'
import invariant from 'tiny-invariant'

import type { Breakpoint, StyleTree } from '.'
import { STYLE_TREE_FRAGMENT, getNode } from '.'

export interface Options {
  getStore: () => Record<string, StyleTree>
  key?: string
}

export interface UpdateOptions {
  path: readonly string[]
  property: string
  value: unknown
}

interface NodeInfo {
  node: StyleTree
  name: string
  path: string[]
  apply: (styles: Record<string, Breakpoint>) => Promise<void>
}

let lastStore: unknown

export interface TestUtils {
  resolveSelector: (path: readonly string[]) => string
  nextTick: () => Promise<void>
  update: (options: UpdateOptions) => Promisable<() => void>
  traverse(cb: (info: NodeInfo) => Promise<void>): Promise<void>
}

export function resolveSelector(path: readonly string[]): string {
  invariant(path.length > 0, 'expect a least one selector')
  const name = path[path.length - 1]
  if (name.startsWith('&')) {
    invariant(path.length > 1, 'expect has parent')
    return `${resolveSelector(path.slice(0, -1))} ${name.replace('& ', '')}`
  }
  return `.${name}`
}

function assertStore(store: unknown) {
  if (!lastStore) {
    store = lastStore
    return
  }
  invariant(store === lastStore, 'found multiple instance of store')
}

export function createTestUtils({ getStore, key = 'styles' }: Options): TestUtils {
  return {
    resolveSelector,
    nextTick,

    update({ path, property, value }: UpdateOptions) {
      const store = getStore()
      let old: Breakpoint
      store[key] = produce(store[key], (root) => {
        const node = getNode(root, path)
        old = node.styles[property]
        node.styles[property] = typeof value !== 'object' ? { xs: value } : (value as Breakpoint)
      })

      return () => {
        store[key] = produce(store[key], (root) => {
          const node = getNode(root, path)
          node.styles[property] = old
        })
      }
    },

    async traverse(handler) {
      const store = getStore()
      assertStore(store)
      const root = store[key]
      const queue = [[root, [] as string[]]]
      const shouldSkip = new Set()
      while (queue.length > 0) {
        const [node, path] = queue.shift() as [StyleTree, string[]]
        if (node === root && node.name === STYLE_TREE_FRAGMENT) {
          for (const child of Object.values(node.children)) {
            shouldSkip.add(child)
            queue.push([child, [...path, child.name]])
          }
          continue
        }

        for (const child of Object.values(node.children)) {
          queue.push([child, [...path, child.name]])
        }

        if (shouldSkip.has(node)) {
          shouldSkip.delete(node)
          continue
        }

        if (node.name === STYLE_TREE_FRAGMENT) {
          continue
        }

        try {
          await handler({
            node,
            name: node.name,
            path,
            apply: async (styles: Record<string, Breakpoint>) => {
              store[key] = produce(root, (draft) => {
                const draftNode = getNode(draft, path)
                draftNode.styles = styles
              })
              await nextTick()
            },
          })
        } catch (error) {
          console.error(error)
        }
      }
      store[key] = root
    },
  }
}

function nextTick(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 0)
  })
}
