import { h } from '../render-html'

describe('h', () => {
  it('render array children', () => {
    const res = h('div', {}, [null, h('span', {}, 'foo')] as any)

    expect(res).toMatchSnapshot()
  })

  it('render normal children', () => {
    const res = h('div', {}, h('span', {}, 'foo'))

    expect(res).toMatchSnapshot()
  })

  it('render with null children', () => {
    const res = h('div', {}, null as any, h('span', {}, 'foo'))

    expect(res).toMatchSnapshot()
  })
})
