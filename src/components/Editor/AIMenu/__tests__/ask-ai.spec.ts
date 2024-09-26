import { expect } from 'vitest'
import { fc, test } from '@fast-check/vitest'
import { setActivePinia } from 'pinia'
import { parseMultipleLineJson, removeDefaultPrompt, streamAsyncIterator } from '../ask-ai'
import { setupTestPinia } from '~/test-helpers'

test.prop([fc.array(fc.dictionary(fc.string(), fc.string()), { maxLength: 10, minLength: 1 })])(
  'can parse multiple line json',
  (items) => {
    const json = items.map((item) => `${JSON.stringify(item)}\n`).join('')
    const result = Array.from(parseMultipleLineJson(json))
    expect(result).toEqual(items)
  },
)

test('remove default prompt only in index 0', () => {
  expect(removeDefaultPrompt('Brainstorm ideas on test', 'brainstorm')).toBe(' test')
  expect(removeDefaultPrompt('Brainstorm ideas', 'brainstorm')).toBe('Brainstorm ideas')
  expect(removeDefaultPrompt('test Brainstorm ideas on test', 'brainstorm')).toBe('test Brainstorm ideas on test')
  expect(removeDefaultPrompt('Write a pros and cons', 'pros-and-cons-list')).toBe('Write a pros and cons')
  expect(removeDefaultPrompt('', 'pros-and-cons-list')).toBe('')
})

const mockData = [
  '{"ok":true,"type":"completion","data":""}\n',
  '{"ok":true,"type":"completion","data":"Understanding"}\n{"ok":true,"type":"completion","data":" the"}\n',
  '{"ok":true,"type":"completion","data":" Impact"}\n{"ok":true,"type":"completion","data":" of"}\n',
  '{"ok":true,"type":"completion","data":" "}\n{"ok":true,"type":"completion","data":"123"}\n',
  '{"ok":true,"type":"comple',
  'tion","data":"456"}\n{"ok":true,"type":"completion","data":" Security"}\n',
  '{"ok":true,"type":"completion","data":""}\n',
  '',
]

function arrayToStream(array: string[]) {
  return new ReadableStream({
    start(controller) {
      array.forEach((line) => {
        controller.enqueue(new TextEncoder().encode(line))
      })
      controller.close()
    },
  })
}

function insertAt(str: string, index: number, insert: string) {
  return str.slice(0, index) + insert + str.slice(index)
}

test.prop([fc.integer({ max: 7, min: 0 }), fc.integer({ max: 25, min: 3 })])(
  'streamAsyncIterator correctly reads data from stream',
  async (row, breakPoint) => {
    setActivePinia(setupTestPinia())

    const data = [...mockData.slice(0, row), insertAt(mockData[row], breakPoint, '\n'), ...mockData.slice(row + 1)]

    const stream = arrayToStream(data)
    const reader = stream.getReader()
    const response = streamAsyncIterator(reader, 200)

    expect(await response.next()).toEqual({ done: false, value: '' })
    expect(await response.next()).toEqual({ done: false, value: 'Understanding' })
    expect(await response.next()).toEqual({ done: false, value: ' the' })
    expect(await response.next()).toEqual({ done: false, value: ' Impact' })
    expect(await response.next()).toEqual({ done: false, value: ' of' })
    expect(await response.next()).toEqual({ done: false, value: ' ' })
    expect(await response.next()).toEqual({ done: false, value: '123' })
    expect(await response.next()).toEqual({ done: false, value: '456' })
    expect(await response.next()).toEqual({ done: false, value: ' Security' })
    expect(await response.next()).toEqual({ done: false, value: '' })
    expect(await response.next()).toEqual({ done: true, value: undefined })
  },
)
