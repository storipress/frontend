import { describe, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import UserMenu from './UserMenu.vue'
import { render } from '~/test-helpers'
import { raf } from '~/utils'

Element.prototype.compareDocumentPosition = () => Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC

const hasNoPermission = {
  liveUrl: 'https://test.com',
  draft: false,
  published: false,
  newsletter: false,
  title: 'testTitle',
  navColor: '#44a604',
  plan: 'member',
  userDevice: 'desktop',
  isPreview: true,
  articleModel: {},
  canPublishedArticle: false,
  articleInfo: { id: '1', slug: 'foo' },
}

const hasPermission = {
  liveUrl: 'https://test.com',
  draft: false,
  published: false,
  newsletter: false,
  title: 'testTitle',
  navColor: '#44a604',
  plan: 'member',
  userDevice: 'desktop',
  isPreview: true,
  articleModel: {},
  canPublishedArticle: true,
  articleInfo: { id: '1', slug: 'foo' },
}

describe('has no permission', () => {
  it('trigger success when published', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasNoPermission,
        published: true,
      },
    })
    const menu = getByText('Update')
    await fireEvent.click(menu)

    const update = getByText('Update changes')
    await fireEvent.click(update)
    expect(emitted()).toHaveProperty('onUpdateArticle')
  })

  it('trigger success when not published and draft', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasNoPermission,
        published: false,
        draft: true,
      },
    })
    const menu = getByText('Publish')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('onChangeArticleStage')
    const submit = getByText('Submit for review')
    await fireEvent.click(submit)
    expect(emitted()).toHaveProperty('onChangeArticleStage', [[true]])
  })

  it('trigger success when not published and not draft', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasNoPermission,
        published: false,
        draft: false,
      },
    })
    const menu = getByText('Publish')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('onChangeArticleStage')
    const unsubmit = getByText('Unsubmit for review')
    await fireEvent.click(unsubmit)
    expect(emitted()).toHaveProperty('onChangeArticleStage', [[false]])
  })
})

describe('has permission', () => {
  it('trigger update success', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasPermission,
        published: true,
      },
    })
    const menu = getByText('Update')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('onUpdateArticle')
    const update = getByText('Update changes')
    await fireEvent.click(update)
    expect(emitted()).toHaveProperty('onUpdateArticle')
  })

  it('trigger unpublish success', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasPermission,
        published: true,
      },
    })
    const menu = getByText('Update')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('onUnpublishArticle')
    const update = getByText('Unpublish')
    await fireEvent.click(update)
    expect(emitted()).toHaveProperty('onUnpublishArticle')
  })

  it('trigger publish success', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasPermission,
        published: false,
      },
    })
    const menu = getByText('Publish')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('onPublishArticle')
    const update = getByText('Publish now')
    await fireEvent.click(update)
    expect(emitted()).toHaveProperty('onPublishArticle')
  })

  it('trigger schedule success', async () => {
    const { getByText, emitted } = render(UserMenu, {
      stubActions: false,
      props: {
        ...hasPermission,
        published: false,
      },
    })
    const menu = getByText('Publish')
    await fireEvent.click(menu)

    expect(emitted()).not.toHaveProperty('modalOpen')
    const schedule = getByText(/schedule/i)
    await fireEvent.click(schedule)
    await raf()
    await raf()
    expect(emitted()).toHaveProperty('modalOpen')
  })
})
