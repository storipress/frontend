import { expect, it } from 'vitest'
import { useUserPermission } from './user-permission'

it('useUserPermission extract permission info', () => {
  expect(
    useUserPermission({
      me: ref({
        id: '1',
        role: 'owner',
        desks: [{ id: '1' }, { id: '2' }],
      }),
      mainDeskMap: ref(
        new Map([
          ['1', '1'],
          ['2', '2'],
        ]),
      ),
    }).value,
  ).toMatchInlineSnapshot(`
    {
      "mainDeskMap": Map {
        "1" => "1",
        "2" => "2",
      },
      "ownedDesks": Set {
        "1",
        "2",
      },
      "ready": true,
      "role": "owner",
      "userId": "1",
    }
  `)
})

it('useUserPermission should ignore sub-desk', () => {
  expect(
    useUserPermission({
      me: ref({
        id: '1',
        role: 'owner',
        desks: [{ id: '2' }],
      }),
      mainDeskMap: ref(
        new Map([
          ['1', '1'],
          // This means id: 2 is a sub-desk
          ['2', '1'],
        ]),
      ),
    }).value,
  ).toMatchInlineSnapshot(`
    {
      "mainDeskMap": Map {
        "1" => "1",
        "2" => "1",
      },
      "ownedDesks": Set {},
      "ready": true,
      "role": "owner",
      "userId": "1",
    }
  `)
})
