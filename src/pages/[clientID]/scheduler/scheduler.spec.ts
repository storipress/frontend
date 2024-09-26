import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import Scheduler from './index.vue'
import { mockResponseOnce, render } from '~/test-helpers'
import { useMeMeta } from '~/composables/meMeta'
import MeMetaMock from '~/mocks/graphql/GetMeMeta'

vi.mock('vue-router', async () => ({
  ...(await vi.importActual('vue-router')),
  onBeforeRouteLeave: vi.fn(),
}))

it('load last scheduler view', async () => {
  mockResponseOnce(MeMetaMock, {
    me: {
      id: '1',
      meta: JSON.stringify({ lastSchedulerView: '5 Day' }),
    },
  })

  const { getByRole } = render(Scheduler)
  const { loading } = useMeMeta()

  const monthBtn = getByRole('radio', {
    name: /month/i,
  })
  const fiveDayBtn = getByRole('radio', {
    name: /5 day/i,
  })

  await until(loading).not.toBe(true)

  expect(monthBtn).not.toBeChecked()
  expect(fiveDayBtn).toBeChecked()
})

it('switch scheduler view', async () => {
  const { getByRole } = render(Scheduler)
  const _useMeMeta = useMeMeta()

  const setUserMeta = vi.spyOn(_useMeMeta, 'setUserMeta')

  const fiveDayBtn = getByRole('radio', {
    name: /5 day/i,
  })

  await fireEvent.click(fiveDayBtn)

  expect(fiveDayBtn).toBeChecked()
  expect(setUserMeta).not.toBeCalled()
})
