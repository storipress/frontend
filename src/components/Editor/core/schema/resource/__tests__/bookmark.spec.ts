import { render } from '@testing-library/vue'
import { getHTMLFromFragment, getSchema } from '@tiptap/core'
import { Fragment } from 'prosemirror-model'

import { baseSchema } from '../../test-utils'
import Bookmark from '../bookmark.vue'
import { ResourceSchema } from '../schema'
import type { BookmarkMeta } from '~/components/Editor/core/api'

const extensions = [...baseSchema, ResourceSchema]

it('have same html structure between bookmark.vue and render-resource-impl.jsx', () => {
  const schema = getSchema(extensions)
  const meta: BookmarkMeta = {
    url: '#',
    title: 'title',
    thumbnail: 'thumbnail',
    publisher: 'publisher',
    icon: 'icon',
    description: 'description',
    author: 'Author',
    aspectRadio: 1,
    html: '<div>title</div>',
  }
  const { getByText, container } = render(Bookmark, { props: { meta } })

  const title = getByText('title')

  expect(title).toBeInTheDocument()

  const staticHTML = getHTMLFromFragment(
    Fragment.fromArray([schema.nodes.resource.create({ meta: JSON.stringify(meta), type: 'bookmark' })]),
    schema,
  )
  expect(staticHTML).toMatchSnapshot()
  expect(staticHTML).not.toContain('template')

  const div = document.createElement('div')
  div.innerHTML = staticHTML
  // eslint-disable-next-line testing-library/no-node-access
  const bookmarkHTML = div.querySelector('.bookmark__link')?.innerHTML
  expect(bookmarkHTML).toBeDefined()
  expect(bookmarkHTML).toMatchSnapshot()
  expect(container.innerHTML).toMatchSnapshot()
})

it('render success when no author', () => {
  const schema = getSchema(extensions)
  const meta: BookmarkMeta = {
    url: '#',
    title: 'title',
    thumbnail: 'thumbnail',
    publisher: 'publisher',
    icon: 'icon',
    html: '<div>foo</div>',
    description: 'description',
    author: null,
    aspectRadio: 1,
  }
  expect(() => {
    const staticHTML = getHTMLFromFragment(
      Fragment.fromArray([schema.nodes.resource.create({ meta: JSON.stringify(meta), type: 'bookmark' })]),
      schema,
    )

    expect(staticHTML).toMatchSnapshot()
  }).not.toThrow()
})

it('render success when no html', () => {
  const schema = getSchema(extensions)
  const meta: BookmarkMeta = {
    url: '#',
    title: 'title',
    thumbnail: 'thumbnail',
    publisher: 'publisher',
    icon: 'icon',
    html: '',
    description: 'description',
    author: null,
    aspectRadio: 1,
  }
  expect(() => {
    const staticHTML = getHTMLFromFragment(
      Fragment.fromArray([schema.nodes.resource.create({ meta: JSON.stringify(meta), type: 'bookmark' })]),
      schema,
    )

    expect(staticHTML).toMatchSnapshot()
  }).not.toThrow()
})

it('render success for a lot of empty data', () => {
  const schema = getSchema(extensions)
  const meta: BookmarkMeta = {
    title: "Chairman's Letter - 1980",
    description: '',
    author: '',
    icon: '',
    url: 'https://www.berkshirehathaway.com/letters/1980.html',
    thumbnail: '',
    aspectRadio: 1,
  }
  expect(() => {
    const staticHTML = getHTMLFromFragment(
      Fragment.fromArray([schema.nodes.resource.create({ meta: JSON.stringify(meta), type: 'bookmark' })]),
      schema,
    )

    expect(staticHTML).toMatchSnapshot()
  }).not.toThrow()
})
