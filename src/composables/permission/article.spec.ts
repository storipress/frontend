import { describe, expect, it } from 'vitest'
import type { ArticleLike } from './article'
import { useArticlePermission } from './article'
import type { UseUserPermissionInput } from './user-permission'

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
        ['5', '1'],
        ['6', '3'],
      ]),
    ),
  }
}

const OWNED_DESK_NOT_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '1' },
  authors: [],
}

const OWNED_DESK_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '1' },
  authors: [{ id: '1' }],
}

const NON_OWNED_DESK_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '3' },
  authors: [{ id: '1' }],
}

const NON_OWNED_DESK_NOT_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '3' },
  authors: [],
}

const OWNED_SUBDESK_NOT_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '5' },
  authors: [],
}

const NON_OWNED_SUBDESK_NOT_ASSIGNED: ArticleLike = {
  id: '1',
  desk: { id: '6' },
  authors: [],
}

describe('owner/admin', () => {
  const { canEdit, canManage } = useArticlePermission(createUser('owner'))

  it('can edit any article', () => {
    // owned desk
    expect(canEdit(OWNED_DESK_NOT_ASSIGNED).value).toBe(true)
    expect(canEdit(OWNED_DESK_ASSIGNED).value).toBe(true)

    // non-owned desk
    expect(canEdit(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(true)
    expect(canEdit(NON_OWNED_DESK_ASSIGNED).value).toBe(true)
  })

  it('can manage any article', () => {
    // owned desk
    expect(canManage(OWNED_DESK_NOT_ASSIGNED).value).toBe(true)
    expect(canManage(OWNED_DESK_ASSIGNED).value).toBe(true)

    // non-owned desk
    expect(canManage(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(true)
    expect(canManage(NON_OWNED_DESK_ASSIGNED).value).toBe(true)
  })
})

describe('editor', () => {
  const { canEdit, canManage } = useArticlePermission(createUser('editor'))

  it('can edit assigned desks/articles', () => {
    // owned desk
    expect(canEdit(OWNED_DESK_ASSIGNED).value, 'owned desk assigned').toBe(true)
    expect(canEdit(OWNED_DESK_NOT_ASSIGNED).value, 'owned desk not assigned').toBe(true)
    expect(canEdit(OWNED_SUBDESK_NOT_ASSIGNED).value, 'owned subdesk not assigned').toBe(true)

    // assigned articles
    expect(canEdit(NON_OWNED_DESK_ASSIGNED).value, 'non owned desk assigned').toBe(true)

    // non-owned desk
    expect(canEdit(NON_OWNED_DESK_NOT_ASSIGNED).value, 'non owned desk not assigned').toBe(false)
    expect(canEdit(NON_OWNED_SUBDESK_NOT_ASSIGNED).value, 'non owned subdesk not assigned').toBe(false)
  })

  it('can manage assigned desks/articles', () => {
    // owned desk
    expect(canManage(OWNED_DESK_ASSIGNED).value).toBe(true)
    expect(canManage(OWNED_DESK_NOT_ASSIGNED).value).toBe(true)
    expect(canEdit(OWNED_SUBDESK_NOT_ASSIGNED).value).toBe(true)

    // assigned articles
    expect(canManage(NON_OWNED_DESK_ASSIGNED).value).toBe(true)

    // non-owned desk
    expect(canManage(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
    expect(canEdit(NON_OWNED_SUBDESK_NOT_ASSIGNED).value).toBe(false)
  })
})

describe('author', () => {
  const { canEdit, canManage } = useArticlePermission(createUser('author'))

  it('can edit assigned articles', () => {
    // assigned articles
    expect(canEdit(OWNED_DESK_ASSIGNED).value).toBe(true)
    expect(canEdit(NON_OWNED_DESK_ASSIGNED).value).toBe(true)

    // not assigned articles
    expect(canEdit(OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
    expect(canEdit(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
  })

  it('can manage assigned articles', () => {
    // assigned articles
    expect(canManage(OWNED_DESK_ASSIGNED).value).toBe(true)
    expect(canManage(NON_OWNED_DESK_ASSIGNED).value).toBe(true)

    // not assigned articles
    expect(canManage(OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
    expect(canManage(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
  })
})

describe('contributor', () => {
  const { canEdit, canManage } = useArticlePermission(createUser('contributor'))

  it('can edit assigned articles', () => {
    // assigned articles
    expect(canEdit(OWNED_DESK_ASSIGNED).value, 'assigned article').toBe(true)

    // adjust result to be false in this jira https://storipress-media.atlassian.net/jira/software/projects/SPMVP/boards/1?selectedIssue=SPMVP-3340
    expect(canEdit(NON_OWNED_DESK_ASSIGNED).value, 'non owned desk assigned').toBe(false)

    // not assigned articles
    expect(canEdit(OWNED_DESK_NOT_ASSIGNED).value, 'owned not assigned').toBe(false)
    expect(canEdit(NON_OWNED_DESK_NOT_ASSIGNED).value, 'non owned not assigned').toBe(false)
  })

  it('can not manage any articles', () => {
    expect(canManage(OWNED_DESK_ASSIGNED).value).toBe(false)
    expect(canManage(NON_OWNED_DESK_ASSIGNED).value).toBe(false)
    expect(canManage(OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
    expect(canManage(NON_OWNED_DESK_NOT_ASSIGNED).value).toBe(false)
  })
})
