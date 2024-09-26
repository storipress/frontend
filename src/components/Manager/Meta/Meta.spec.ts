import { fireEvent, waitFor } from '@testing-library/vue'
import Meta from './Meta.vue'
import { render } from '~/test-helpers'

Element.prototype.compareDocumentPosition = () => Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC

const props = {
  id: '19',
  formModel: {
    title: '',
    blurb: '',
    searchTitle: 'searchTitle',
    searchDescription: 'searchDescription',
    socialTitle: 'socialTitle',
    socialDescription: 'socialDescription',
    tags: [],
    authors: [],
    slug: 'test-test',
    hasSlug: true,
    featured: true,
  },
  urlPrefix: 'nytimes.com/posts/',
  ydoc: {
    transact: () => {},
    doc: {},
    getMap: () => {
      return {
        observe: () => {},
      }
    },
    getText: () => {
      return {
        doc: {
          on: () => {},
          off: () => {},
        },
        observe: () => {},
        unobserve: () => {},
        delete: () => {},
        insert: () => {},
        toString: () => {
          return 'testslug'
        },
      }
    },
  },
}

it('permalink change success', async () => {
  const { getAllByRole, getByLabelText, emitted } = render(Meta, { props })
  await waitFor(() => {
    expect(getAllByRole('button')).not.toEqual([])
  })

  const permalink = getByLabelText('Permalink')
  expect(emitted()).not.toHaveProperty('editing')
  expect(emitted()).not.toHaveProperty('changeArticle')
  expect(emitted()).not.toHaveProperty('updateArticleColumn')

  await fireEvent.update(permalink, 'testSlug')

  // Because using @input and @update:model-value together, test will have two values.
  expect(emitted()).toHaveProperty('editing', [['slug']])
  await new Promise((resolve) => setTimeout(resolve, 1000))
  expect(emitted()).toHaveProperty('changeArticle', [
    ['testslug', 'slug'],
    [true, 'hasSlug'],
  ])
})

describe('seo change success', () => {
  it('search title change success', async () => {
    const { getAllByRole, getByLabelText, emitted } = render(Meta, { props })
    await waitFor(() => {
      expect(getAllByRole('button')).not.toEqual([])
    })
    const searchTitle = getByLabelText('Search title')

    expect(emitted()).not.toHaveProperty('editing')
    expect(emitted()).not.toHaveProperty('changeArticle')
    expect(emitted()).not.toHaveProperty('updateSeo')
    await fireEvent.update(searchTitle, 'testTitle')
    expect(emitted()).toHaveProperty('editing', [['searchTitle']])
    expect(emitted()).toHaveProperty('changeArticle', [['testTitle', 'searchTitle']])
    expect(emitted()).toHaveProperty('updateSeo')
  })

  it('search description change success', async () => {
    const { getAllByRole, getByLabelText, emitted } = render(Meta, { props })
    await waitFor(() => {
      expect(getAllByRole('button')).not.toEqual([])
    })
    const searchDescription = getByLabelText('Search description')

    expect(emitted()).not.toHaveProperty('editing')
    expect(emitted()).not.toHaveProperty('changeArticle')
    expect(emitted()).not.toHaveProperty('updateSeo')
    await fireEvent.update(searchDescription, 'testDescription')
    expect(emitted()).toHaveProperty('editing', [['searchDescription']])
    expect(emitted()).toHaveProperty('changeArticle', [['testDescription', 'searchDescription']])
    expect(emitted()).toHaveProperty('updateSeo')
  })

  it('social title change success', async () => {
    const { getAllByRole, getByRole, getByLabelText, emitted } = render(Meta, { props })
    await waitFor(() => {
      expect(getAllByRole('button')).not.toEqual([])
    })
    const socialTab = getByRole('tab', { name: /Share to Socials/i })
    await fireEvent.click(socialTab)
    const socialTitle = getByLabelText('Social title')

    expect(emitted()).not.toHaveProperty('editing')
    expect(emitted()).not.toHaveProperty('changeArticle')
    expect(emitted()).not.toHaveProperty('updateSeo')
    await fireEvent.update(socialTitle, 'testTitle')
    expect(emitted()).toHaveProperty('editing', [['socialTitle']])
    expect(emitted()).toHaveProperty('changeArticle', [['testTitle', 'socialTitle']])
    expect(emitted()).toHaveProperty('updateSeo')
  })

  it('social description change success', async () => {
    const { getAllByRole, getByRole, getByLabelText, emitted } = render(Meta, { props })
    await waitFor(() => {
      expect(getAllByRole('button')).not.toEqual([])
    })
    const socialTab = getByRole('tab', { name: /Share to Socials/i })
    await fireEvent.click(socialTab)
    const socialDescription = getByLabelText('Social description')

    expect(emitted()).not.toHaveProperty('editing')
    expect(emitted()).not.toHaveProperty('changeArticle')
    expect(emitted()).not.toHaveProperty('updateSeo')
    await fireEvent.update(socialDescription, 'testDescription')
    expect(emitted()).toHaveProperty('editing', [['socialDescription']])
    expect(emitted()).toHaveProperty('changeArticle', [['testDescription', 'socialDescription']])
    expect(emitted()).toHaveProperty('updateSeo')
  })
})
