import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import type { FormModel } from '../../types'
import { useUpdate } from '../update'
import { debounceLimit } from '../../setting'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'
import { ArticlePlan } from '~/graphql-operations'

const mockBatchUpdate = vi.fn()

vi.mock('~/lib/batch', () => {
  return {
    createBatch: () => ({ batchUpdate: mockBatchUpdate, completed: ref(true) }),
  }
})

const mockFormModel: FormModel = {
  id: '',
  title: '',
  blurb: '',
  slug: '',
  url: '',
  coverUrl: '',
  coverAlt: '',
  coverCaption: '',
  coverCrop: {
    key: '',
    left: 50,
    top: 50,
    zoom: 1,
    realWidth: 0,
    realHeight: 0,
    width: 0,
    height: 0,
  },
  searchTitle: 'Mock search title',
  searchDescription: 'Mock search desc',
  socialTitle: 'Mock social title',
  socialDescription: 'Mock social desc',
  socialImageUrl: 'Mock social image',
  newsletter: false,
  newsletterAt: null,
  FBPageId: '',
  FBEnable: false,
  FBText: '',
  TWUserId: '',
  TWEnable: false,
  TWText: '',
  LNAuthorId: '',
  LNEnable: false,
  LNText: '',
  slackText: '',
  navColor: '#FFF',
  deskId: '',
  deskName: '',
  draft: false,
  published: false,
  hasSlug: false,
  featured: false,
  previewId: '',
  plan: ArticlePlan.Free,
  imgUrl: '',
  imgAlt: '',
  tags: [],
  authors: [],
}

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
  mockBatchUpdate.mockReset()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useUpdate seo', () => {
  it('can update seo', () => {
    const { mutateSeo } = useUpdate('1', ref(mockFormModel))

    mutateSeo()

    expect(mockBatchUpdate).not.toBeCalled()

    vi.advanceTimersByTime(debounceLimit)

    expect(mockBatchUpdate).toBeCalledTimes(1)
    expect(mockBatchUpdate.mock.calls[0][0]).toEqual({
      id: '1',
      seo: expect.any(String),
    })
    expect(JSON.parse(mockBatchUpdate.mock.calls[0][0].seo)).toEqual({
      meta: {
        title: 'Mock search title',
        description: 'Mock search desc',
      },
      og: {
        title: 'Mock social title',
        description: 'Mock social desc',
      },
      ogImage: 'Mock social image',
      hasSlug: false,
    })
  })

  it('can update hasSlug', () => {
    const { mutateHasSlug } = useUpdate(
      '1',
      ref({
        ...mockFormModel,
        hasSlug: true,
      }),
    )

    mutateHasSlug()

    expect(mockBatchUpdate).not.toBeCalled()

    vi.advanceTimersByTime(debounceLimit)

    expect(mockBatchUpdate).toBeCalledTimes(1)
    expect(mockBatchUpdate.mock.calls[0][0]).toEqual({
      id: '1',
      seo: expect.any(String),
    })
    expect(JSON.parse(mockBatchUpdate.mock.calls[0][0].seo)).toEqual({
      meta: {
        title: 'Mock search title',
        description: 'Mock search desc',
      },
      og: {
        title: 'Mock social title',
        description: 'Mock social desc',
      },
      ogImage: 'Mock social image',
      hasSlug: true,
    })
  })

  it('can update ogImage', () => {
    const { mutateOgImage } = useUpdate('1', ref(mockFormModel))

    mutateOgImage('New og image')

    expect(mockBatchUpdate).toBeCalledTimes(1)
    expect(mockBatchUpdate.mock.calls[0][0]).toEqual({
      id: '1',
      seo: expect.any(String),
    })
    expect(JSON.parse(mockBatchUpdate.mock.calls[0][0].seo)).toEqual({
      meta: {
        title: 'Mock search title',
        description: 'Mock search desc',
      },
      og: {
        title: 'Mock social title',
        description: 'Mock social desc',
      },
      ogImage: 'New og image',
      hasSlug: false,
    })
  })

  it('can update all', () => {
    const { mutateAll } = useUpdate('1', ref(mockFormModel))

    mutateAll()

    expect(mockBatchUpdate).toBeCalledTimes(1)
    expect(mockBatchUpdate.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: '1',
        seo: expect.any(String),
      }),
    )
    expect(JSON.parse(mockBatchUpdate.mock.calls[0][0].seo)).toEqual({
      meta: {
        title: 'Mock search title',
        description: 'Mock search desc',
      },
      og: {
        title: 'Mock social title',
        description: 'Mock social desc',
      },
      ogImage: 'Mock social image',
      hasSlug: false,
    })
  })
})
