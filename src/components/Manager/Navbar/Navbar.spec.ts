import { it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import Navbar from './Navbar.vue'
import { render } from '~/test-helpers'

vi.mock('@article-templates/templates', () => ({
  TEMPLATE_MAP: {},
}))

const props = {
  id: '19',
  slug: 'testSlug',
  avatars: [
    { src: 'https://i.pravatar.cc/150?img=3', name: 'test1', color: 'hsl(0, 100%, 50%)' },
    { src: 'https://i.pravatar.cc/150?img=4', name: 'test2', color: 'hsl(234, 100%, 50%)' },
    { src: 'https://i.pravatar.cc/150?img=5', name: 'test3', color: 'hsl(117, 31%, 46%)' },
  ],
  title: 'testTitle',
  userDevice: 'desktop',
  isPreview: true,
  articleModel: {},
  userList: [],
  hasUpdated: false,
  formModel: {
    draft: false,
    published: false,
    newsletter: true,
    newsletterAt: '2024-01-01T00:00:00Z',
    slackText: '',
  },
  ydoc: {
    getMap: () => {
      return {
        observe: () => {},
      }
    },
  },
}

it('change desktop success', async () => {
  const { getByLabelText, emitted } = render(Navbar, { props, stubActions: false })
  const desktop = getByLabelText('desktop')

  expect(emitted()).not.toHaveProperty('changeDevice')
  await fireEvent.click(desktop)
  expect(emitted()).toHaveProperty('changeDevice', [['desktop']])
})

it('change tablet success', async () => {
  const { getByLabelText, emitted } = render(Navbar, { props, stubActions: false })
  const tablet = getByLabelText('tablet')

  expect(emitted()).not.toHaveProperty('changeDevice')
  await fireEvent.click(tablet)
  expect(emitted()).toHaveProperty('changeDevice', [['tablet']])
})

it('change mobile success', async () => {
  const { getByLabelText, emitted } = render(Navbar, { props, stubActions: false })
  const mobile = getByLabelText('mobile')

  expect(emitted()).not.toHaveProperty('changeDevice')
  await fireEvent.click(mobile)
  expect(emitted()).toHaveProperty('changeDevice', [['mobile']])
})
