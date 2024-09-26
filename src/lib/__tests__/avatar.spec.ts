import { expect, it } from 'vitest'
import { getAvatarURL } from '../avatar'

it('getAvatarURL to work as expected', () => {
  expect(getAvatarURL('David Peng')).toMatchInlineSnapshot('"https://avatars.dicebear.com/api/initials/David Peng.svg"')
})
