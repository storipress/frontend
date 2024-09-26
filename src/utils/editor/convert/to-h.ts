import commas from 'comma-separated-tokens'
import find from 'property-information/find'
import html from 'property-information/html'
import spaces from 'space-separated-tokens'
import type { Node } from 'unist'
import { convert } from 'unist-util-is'

export interface Text extends Node {
  type: 'text'
  value: string
}

export interface Element extends Node {
  type: 'element'
  tagName: string
  properties: Record<string, any>
  children: Node[]
}

const element = convert<Element>('element')
const text = convert<Text>('text')

type H = (tag: string, attr: Record<string, string>, children: any[]) => any

export function toH(h: H, node: Element): any {
  const name: string = node.tagName
  const properties: Record<string, any> = node.properties
  const attributes = {}
  const children = node.children
  const elements = []
  const length = children ? children.length : 0
  let index

  for (const property in properties) {
    addAttribute(attributes, property, properties[property])
  }

  index = -1

  while (++index < length) {
    const value = children[index]

    if (element(value)) {
      elements.push(toH(h, value))
    } else if (text(value)) {
      elements.push(value.value)
    }
  }

  // Ensure no React warnings are triggered for void elements having children
  // passed in.
  return h(name, attributes, elements)
}

function addAttribute(props: Record<string, any>, prop: string, value: any) {
  const info = find(html, prop)

  // Ignore nully and `NaN` values.
  // Ignore `false` and falsey known booleans for hyperlike DSLs.
  if (value === null || value === undefined || Number.isNaN(value) || value === false || (info.boolean && !value)) {
    return
  }

  if (value !== null && typeof value === 'object' && 'length' in value) {
    // Accept `array`.
    // Most props are space-separated.
    value = (info.commaSeparated ? commas : spaces).stringify(value)
  }

  if (info.boolean) {
    value = ''
  }

  props[info.attribute] = value
}
