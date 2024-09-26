import { describe, expect, it } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import SimpleUserList from './simple-user-list.vue'
import { render } from '~/test-helpers'

describe('when no query', () => {
  it('list all user', async () => {
    const { getByText, getAllByRole } = render(SimpleUserList)

    // wait for the list to be rendered
    await waitFor(() => {
      expect(getAllByRole('listitem')).not.toEqual([])
    })

    expect(getByText('Storipress Helper')).toBeVisible()
    expect(getByText('Michae Jackson')).toBeVisible()
    expect(getAllByRole('listitem')).toMatchInlineSnapshot(`
      [
        <li>
          Storipress Helper
        </li>,
        <li>
          Michae Jackson
        </li>,
        <li>
          Test Testerson
        </li>,
        <li>
          Gary Chu
        </li>,
        <li>
          Google Pie
        </li>,
        <li>
          David Peng
        </li>,
        <li>
          Ariel Lin
        </li>,
        <li>
          Harvey Liu
        </li>,
        <li>
          harvey author
        </li>,
        <li>
          harvey contributor
        </li>,
      ]
    `)
  })
})

describe('query `Storipress`', () => {
  it('list only match user', async () => {
    const { getByText, getAllByRole, queryByText } = render(SimpleUserList, { props: { modelValue: 'Storipress' } })

    // wait for the list to be rendered
    await waitFor(() => {
      expect(getAllByRole('listitem')).not.toEqual([])
    })

    // only match `Storipress`
    expect(getByText('Storipress Helper')).toBeVisible()
    // not match `Michae Jackson`
    expect(queryByText('Michae Jackson')).toBeFalsy()
    // only one user match
    expect(getAllByRole('listitem')).toHaveLength(1)
  })
})

describe('emit update:modelValue', () => {
  it('list only match user', async () => {
    const { getByRole, emitted } = render(SimpleUserList)
    const input = getByRole('textbox')

    await fireEvent.update(input, 'Storipress')

    expect(emitted()).toHaveProperty('update:modelValue')
    expect(emitted()['update:modelValue'][0]).toEqual(['Storipress'])
  })
})
