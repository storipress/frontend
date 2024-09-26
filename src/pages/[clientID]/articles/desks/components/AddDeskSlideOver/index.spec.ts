import { describe, expect, it } from 'vitest'
import AddDeskSlideOver from './index'
import { render } from '~/test-helpers'

describe('addDeskSlideOver.vue', () => {
  it('props features', async () => {
    const { rerender, baseElement } = render(AddDeskSlideOver, {
      props: { loading: false, show: false, defaultMembers: [] },
    })
    expect(baseElement).toMatchSnapshot('hide')
    await rerender({ show: true })
    expect(baseElement).toMatchSnapshot('show')
    await rerender({ loading: true })
    expect(baseElement).toMatchSnapshot('loading')
  })
})
