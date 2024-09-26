import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import IntegrationsCard from './Card.vue'
import { render } from '~/test-helpers'

const defaultProps = {
  label: 'Slack',
  integrationImg: 'slack.svg',
  enabled: false,
}

it('render integrations card', () => {
  const { getByRole, getByText } = render(IntegrationsCard, {
    props: defaultProps,
  })

  expect(getByText('Slack')).toBeVisible()
  expect(getByRole('img')).toHaveAttribute('src', 'slack.svg')
  expect(getByRole('switch')).not.toBeChecked()
})

it('click toggle', async () => {
  const onOnSwitch = vi.fn()

  const { getByRole } = render(IntegrationsCard, {
    props: { onOnSwitch, ...defaultProps },
  })

  const toggle = getByRole('switch')
  await fireEvent.click(toggle)
  expect(onOnSwitch).toBeCalledTimes(1)
})

it('click integrations card', async () => {
  const onOnModalOpen = vi.fn()

  const { getByRole } = render(IntegrationsCard, {
    props: { onOnModalOpen, ...defaultProps },
  })

  const card = getByRole('button', {
    name: 'Slack',
  })
  await fireEvent.click(card)
  expect(onOnModalOpen).toBeCalledTimes(1)
})
