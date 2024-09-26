import { describe, expect, it } from 'vitest'
import { getLayoutId } from './utils'

describe('test default layout id', () => {
  const layouts = [
    {
      id: '1',
    },
    {
      id: '111',
    },
    {
      id: '222',
    },
    {
      id: '333',
    },
  ]

  it('get does not exist article layout id will use first layout', () => {
    const article = {
      layout: {
        id: 'no exist',
      },
    }

    expect(getLayoutId(article, layouts)).toBe('1')
  })

  it('get article layout id', () => {
    const article = {
      layout: {
        id: '111',
      },
    }

    expect(getLayoutId(article, layouts)).toBe('111')
  })

  it('get article desk layout id', () => {
    const article = {
      desk: {
        layout: {
          id: '222',
        },
      },
    }

    expect(getLayoutId(article, layouts)).toBe('222')
  })

  it('get article parent desk layout id', () => {
    const article = {
      desk: {
        desk: {
          layout: {
            id: '333',
          },
        },
      },
    }

    expect(getLayoutId(article, layouts)).toBe('333')
  })

  it('get first layout id in layouts', () => {
    const article = {}

    expect(getLayoutId(article, layouts)).toBe('1')
  })
})
