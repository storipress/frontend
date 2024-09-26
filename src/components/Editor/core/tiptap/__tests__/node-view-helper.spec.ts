import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reactive } from 'vue'
import type { NodeViewProps } from '@tiptap/core'
import { useBindNodeAttr, useNodeAttr } from '../node-view-helper'

describe('node-view-helper', () => {
  let props: Pick<NodeViewProps, 'node' | 'updateAttributes'>

  beforeEach(() => {
    props = reactive({
      node: { attrs: { key1: 'value1', key2: 'value2' } } as unknown as NodeViewProps['node'],
      updateAttributes: vi.fn(),
    })
  })

  describe('useBindNodeAttr', () => {
    it('should return a computed property with correct getter and setter', () => {
      const bindAttr = useBindNodeAttr(props)
      const computedProperty = bindAttr('key1')

      expect(computedProperty.value).toBe('value1')

      computedProperty.value = 'newValue'
      expect(props.updateAttributes).toHaveBeenCalledWith({ key1: 'newValue' })
    })
  })

  describe('useNodeAttr', () => {
    it('should return a computed property with correct getter and setter', () => {
      const computedProperty = useNodeAttr(props, 'key2')

      expect(computedProperty.value).toBe('value2')

      computedProperty.value = 'newValue'
      expect(props.updateAttributes).toHaveBeenCalledWith({ key2: 'newValue' })
    })
  })
})
