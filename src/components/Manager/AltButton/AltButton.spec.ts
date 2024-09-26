import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import AltButton from './AltButton.vue'
import { render } from '~/test-helpers'

describe('click success', () => {
  it('clicked change success', async () => {
    const { getByRole, emitted } = render(AltButton, { props: { disabled: false, clicked: true } })
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(emitted()).toHaveProperty('handleAltClick')
    expect(emitted<[boolean]>().handleAltClick[0][0]).toBe(false)
  })

  it('not clicked change success', async () => {
    const { getByRole, emitted } = render(AltButton, { props: { disabled: false, clicked: false } })
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(emitted()).toHaveProperty('handleAltClick')
    expect(emitted<[boolean]>().handleAltClick[0][0]).toBe(true)
  })
})

it('disbaled success', async () => {
  const { getByRole } = render(AltButton, { props: { disabled: true } })
  const button = getByRole('button')

  await fireEvent.click(button)
  expect(button).toBeDisabled()
  expect(button).not.toHaveProperty('handleAltClick')
})
