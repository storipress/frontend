import { describe, expect, it } from 'vitest'
import { usePublicationPermission } from './publication'
import type { UseUserPermissionInput } from './user-permission'
import type { UseCurrentDeskInput } from '~/composables/desks'

function createUser(role: string): UseUserPermissionInput {
  return {
    me: ref({
      id: '1',
      role,
      desks: [{ id: '1' }, { id: '2' }],
    }),
    mainDeskMap: ref(
      new Map([
        ['1', '1'],
        ['2', '2'],
      ]),
    ),
  }
}
function createDesks(open_access = false): UseCurrentDeskInput {
  return {
    result: ref({
      desks: [
        {
          id: '1',
          name: 'Test 2',
          slug: 'tutorial',
          open_access,
          desks: [
            {
              id: '47',
              name: 'adsadasd',
              slug: 'adsadasd',
            },
            {
              id: '54',
              name: 'ddddd',
              slug: 'ddddd-2',
            },
          ],
        },
      ],
    }),
  }
}

const OWNED_DESK_ID = '1'
const NON_OWNED_DESK_ID = '3'
const OWNED_DESK = { id: OWNED_DESK_ID }
const NON_OWNED_DESK = { id: NON_OWNED_DESK_ID }

describe('contributor and author can not do anything for publication', () => {
  it.each(['contributor', 'author'])('%s', (role) => {
    const {
      canInviteUser,
      canManageTeam,
      canUpdateDesk,
      canUpdatePublication,
      canUseBilling,
      canUseBuilder,
      canUseDomain,
      canUseIntegrations,
    } = usePublicationPermission(createUser(role), createDesks())

    expect(canInviteUser.value).toBe(false)
    expect(canManageTeam.value).toBe(false)
    expect(canUpdatePublication.value).toBe(false)
    expect(canUseBilling.value).toBe(false)
    expect(canUseBuilder.value).toBe(false)
    expect(canUseDomain.value).toBe(false)
    expect(canUseIntegrations.value).toBe(false)

    expect(canUpdateDesk(OWNED_DESK_ID).value).toBe(false)
    expect(canUpdateDesk(NON_OWNED_DESK_ID).value).toBe(false)
    expect(canUpdateDesk(OWNED_DESK).value).toBe(false)
    expect(canUpdateDesk(NON_OWNED_DESK).value).toBe(false)
  })
})

describe('editor can invite and manager owned desk', () => {
  it('editor permission', () => {
    const {
      canInviteUser,
      canManageTeam,
      canUpdateDesk,
      canUpdatePublication,
      canUseBilling,
      canUseBuilder,
      canUseDomain,
      canUseIntegrations,
    } = usePublicationPermission(createUser('editor'), createDesks())

    // invite user
    expect(canInviteUser.value).toBe(true)

    // other permission
    expect(canManageTeam.value).toBe(false)
    expect(canUpdatePublication.value).toBe(false)
    expect(canUseBilling.value).toBe(false)
    expect(canUseBuilder.value).toBe(false)
    expect(canUseDomain.value).toBe(false)
    expect(canUseIntegrations.value).toBe(false)

    // owned desk
    expect(canUpdateDesk(OWNED_DESK_ID).value).toBe(true)
    expect(canUpdateDesk(OWNED_DESK).value).toBe(true)

    // non owned desk
    expect(canUpdateDesk(NON_OWNED_DESK_ID).value).toBe(false)
    expect(canUpdateDesk(NON_OWNED_DESK).value).toBe(false)
  })
})

describe('admin can do everything expect billing', () => {
  it('admin permission', () => {
    const {
      canInviteUser,
      canManageTeam,
      canUpdateDesk,
      canUpdatePublication,
      canUseBilling,
      canUseBuilder,
      canUseDomain,
      canUseIntegrations,
    } = usePublicationPermission(createUser('admin'), createDesks())

    // billing
    expect(canUseBilling.value).toBe(false)

    // other permission
    expect(canInviteUser.value).toBe(true)
    expect(canManageTeam.value).toBe(true)
    expect(canUpdatePublication.value).toBe(true)
    expect(canUseBuilder.value).toBe(true)
    expect(canUseDomain.value).toBe(true)
    expect(canUseIntegrations.value).toBe(true)

    // manage desk
    expect(canUpdateDesk(OWNED_DESK_ID).value).toBe(true)
    expect(canUpdateDesk(OWNED_DESK).value).toBe(true)
    expect(canUpdateDesk(NON_OWNED_DESK_ID).value).toBe(true)
    expect(canUpdateDesk(NON_OWNED_DESK).value).toBe(true)
  })
})

describe('owner can do everything', () => {
  it('owner permission', () => {
    const {
      canInviteUser,
      canManageTeam,
      canUpdateDesk,
      canUpdatePublication,
      canUseBilling,
      canUseBuilder,
      canUseDomain,
      canUseIntegrations,
    } = usePublicationPermission(createUser('owner'), createDesks())

    // all permission
    expect(canUseBilling.value).toBe(true)
    expect(canInviteUser.value).toBe(true)
    expect(canManageTeam.value).toBe(true)
    expect(canUpdatePublication.value).toBe(true)
    expect(canUseBuilder.value).toBe(true)
    expect(canUseDomain.value).toBe(true)
    expect(canUseIntegrations.value).toBe(true)

    // manage desk
    expect(canUpdateDesk(OWNED_DESK_ID).value).toBe(true)
    expect(canUpdateDesk(OWNED_DESK).value).toBe(true)
    expect(canUpdateDesk(NON_OWNED_DESK_ID).value).toBe(true)
    expect(canUpdateDesk(NON_OWNED_DESK).value).toBe(true)
  })
})

describe('open access desk', () => {
  it('editor access a non open-access desk', () => {
    const { canAccessDesk, canDragItemIntoDesk, canUnpublishedArticle } = usePublicationPermission(
      createUser('editor'),
      createDesks(),
      'tutorial',
    )
    // const deskId = ref('1')
    expect(canAccessDesk('1').value).toBe(true)
    expect(canDragItemIntoDesk('1').value).toBe(true)
    expect(canUnpublishedArticle.value).toBe(true)
  })
  it('editor access a open access desk', () => {
    const { canAccessDesk, canDragItemIntoDesk, canUnpublishedArticle } = usePublicationPermission(
      createUser('editor'),
      createDesks(true),
      'tutorial',
    )
    // const deskId = ref('1')
    expect(canAccessDesk('1').value).toBe(true)
    expect(canDragItemIntoDesk('1').value).toBe(true)
    expect(canUnpublishedArticle.value).toBe(true)
  })
})
