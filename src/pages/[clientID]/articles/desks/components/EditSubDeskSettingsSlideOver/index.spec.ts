import { describe, expect, it } from 'vitest'
import EditSubDeskSettingsSlideOver from './index'
import { render } from '~/test-helpers'

describe('editSubDeskSettingsSlideOver.vue', () => {
  it('props features', async () => {
    const { rerender, baseElement } = render(EditSubDeskSettingsSlideOver, {
      props: {
        show: false,
        loading: false,
        workspaceName: 'New-York-Times',
        desk: { id: '0', name: 'Capital Markets' },
        parent: { id: '0', name: 'Business' },
      },
    })
    expect(baseElement).toMatchSnapshot('hide')
    await rerender({ show: true })
    expect(baseElement).toMatchSnapshot('show')
    await rerender({ loading: true })
    expect(baseElement).toMatchSnapshot('loading')
  })
})
