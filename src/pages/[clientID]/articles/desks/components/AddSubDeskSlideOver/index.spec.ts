import { describe, expect, it } from 'vitest'
import AddSubDeskSlideOver from './index'
import { render } from '~/test-helpers'

describe('addSubDeskSlideOver.vue', () => {
  it('props features', async () => {
    const { rerender, baseElement } = render(AddSubDeskSlideOver, {
      props: { loading: false, show: false, parent: { id: '0', name: 'Business' } },
    })
    expect(baseElement).toMatchSnapshot('hide')
    await rerender({ show: true })
    expect(baseElement).toMatchSnapshot('show')
    await rerender({ loading: true })
    expect(baseElement).toMatchSnapshot('loading')
  })
})
