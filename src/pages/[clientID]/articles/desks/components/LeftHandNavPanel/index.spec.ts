import { describe, expect, it } from 'vitest'
import { waitFor } from '@testing-library/vue'
import LeftHandNavPanel, { DEFAULT_ITEM } from './index'
import { render } from '~/test-helpers'

describe('leftHandNavPanel.vue', () => {
  it('props features', async () => {
    const { rerender, container, getByText } = render(LeftHandNavPanel, {
      global: {
        provide: {
          setCreateDesks: ref(false),
        },
      },
      props: {
        activeId: DEFAULT_ITEM.ALL.id,
        desks: [
          { id: '0', name: 'Opinion' },
          {
            id: '1',
            name: 'Business',
            desks: [
              { id: '1-0', name: 'Capital Markets' },
              { id: '1-1', name: 'Currency' },
              { id: '1-2', name: 'Derivatives' },
              { id: '1-3', name: 'Equities' },
            ],
          },
          {
            id: '2',
            name: 'Politics',
            desks: [
              { id: '2-0', name: 'Capital Markets' },
              { id: '2-1', name: 'Currency' },
              { id: '2-2', name: 'Derivatives' },
              { id: '2-3', name: 'Equities' },
            ],
          },
          { id: '3', name: 'Environment' },
        ],
      },
    })
    expect(container).toMatchSnapshot('render')
    await rerender({ activeId: '0' })
    expect(container).toMatchSnapshot('selected a desk without child')
    await rerender({ activeId: '1' })
    await waitFor(() => {
      expect(getByText('Capital Markets')).to.exist
    })
    expect(container).toMatchSnapshot('selected a desk has children')
    await rerender({ activeId: '1-0' })
    expect(container).toMatchSnapshot('selected a sub-desk ')
  })

  it('props desks length is 0', async () => {
    const { rerender, getAllByTestId, queryAllByTestId } = render(LeftHandNavPanel, {
      global: {
        provide: {
          setCreateDesks: ref(false),
        },
      },
      props: {
        activeId: DEFAULT_ITEM.ALL.id,
        desks: [{ id: '0', name: 'Opinion' }],
      },
    })
    await waitFor(() => {
      expect(getAllByTestId('sub-desk')).not.toEqual([])
    })
    expect(getAllByTestId('sub-desk')).toHaveLength(1)

    await rerender({ desks: [] })
    await waitFor(() => {
      expect(queryAllByTestId('sub-desk')).toEqual([])
    })
    expect(queryAllByTestId('sub-desk')).not.toHaveLength(1)
  })
})
