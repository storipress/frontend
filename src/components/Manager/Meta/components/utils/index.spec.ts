import { expect, it, vi } from 'vitest'
import type { IDefineYdocMapReturn, MediaEnableSetting, MediaUserSettingCard } from '../../utils'
import { updateYdocEnable, updateYdocUser } from '.'

it('update ydoc enable ok', () => {
  const ydocEnable: Pick<IDefineYdocMapReturn<MediaEnableSetting>, 'get' | 'set'> = {
    set: vi.fn((input) => {
      return input
    }),
    get: vi.fn(() => undefined),
  }

  updateYdocEnable(false, ydocEnable as IDefineYdocMapReturn<MediaEnableSetting>, 'facebook')

  expect(vi.mocked(ydocEnable.get)).toBeCalled()
  expect(vi.mocked(ydocEnable.set)).toBeCalled()
  expect(vi.mocked(ydocEnable.set).mock.calls[0][0]).toStrictEqual({
    Facebook: false,
    Twitter: false,
    LinkedIn: false,
    facebook: true,
  })
})

it('update ydoc user ok', () => {
  const list = [
    {
      id: '1',
      name: 'test name',
      thumbnail: 'test thumbnail',
    },
  ]
  const ydocUser: Pick<IDefineYdocMapReturn<MediaUserSettingCard>, 'get' | 'set'> = {
    set: vi.fn((input) => {
      return input
    }),
    get: vi.fn(() => undefined),
  }
  updateYdocUser('1', ydocUser as IDefineYdocMapReturn<MediaUserSettingCard>, 'facebook', list)

  expect(vi.mocked(ydocUser.get)).toBeCalled()
  expect(vi.mocked(ydocUser.set)).toBeCalled()
  expect(vi.mocked(ydocUser.set).mock.calls[0][0]).toStrictEqual({
    Facebook: { id: '', name: '', thumbnail: '' },
    Twitter: { id: '', name: '', thumbnail: '' },
    LinkedIn: { id: '', name: '', thumbnail: '' },
    facebook: { id: '1', name: 'test name', thumbnail: 'test thumbnail' },
  })
})
