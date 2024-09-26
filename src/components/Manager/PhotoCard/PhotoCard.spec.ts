import { describe, expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import PhotoCard from './PhotoCard.vue'
import { render } from '~/test-helpers'

vi.mock('~/components/Editor/rich-input')

const props = {
  img: '',
  alt: '',
  caption: '',
  uploadImg: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('https://i.pravatar.cc/150?img=3')
      }, 2000)
    })
  },
  removeImg: () => {},
  callUnsplash: async () => {},
  updateAlt: () => {},
  updateCaption: () => {},
  updateLink: () => {},
}

// tippy is not compatible with happy-dom
vi.mock('tippy.js', () => ({
  default: () => ({
    destroy: () => {},
  }),
}))

describe('upload success', () => {
  it('trigger upload failed when no file', async () => {
    const uploadImg = vi.fn()
    const { getByText } = render(PhotoCard, {
      props: {
        ...props,
        uploadImg,
      },
    })

    expect(uploadImg).not.toBeCalled()
    const uploadBody = getByText('computer')
    await fireEvent.mouseOver(uploadBody)

    const button = getByText('Upload from computer')
    await fireEvent.click(button)
    expect(uploadImg).not.toBeCalled()
  })

  it('trigger unsplash success', async () => {
    const callUnsplash = vi.fn()
    const { getByText } = render(PhotoCard, {
      props: {
        ...props,
        callUnsplash,
      },
    })
    expect(callUnsplash).not.toBeCalled()
    const uploadBody = getByText('computer')
    await fireEvent.mouseOver(uploadBody)

    const button = getByText('Select from Unsplash')
    await fireEvent.click(button)
    expect(callUnsplash).toBeCalled()
  })
})

it('delete success', async () => {
  const removeImg = vi.fn()
  const { getByText } = render(PhotoCard, {
    props: {
      ...props,
      img: 'test.jpg',
      removeImg,
    },
  })
  expect(removeImg).not.toBeCalled()
  const uploadBody = getByText('Missing alt text')
  await fireEvent.mouseOver(uploadBody)

  const deleteButton = getByText('Delete')
  await fireEvent.click(deleteButton)
  expect(removeImg).toBeCalled()
})

it('update alt success', async () => {
  const updateAlt = vi.fn()
  const { getByText, getByPlaceholderText } = render(PhotoCard, {
    props: {
      ...props,
      img: 'test.jpg',
      updateAlt,
    },
  })
  expect(updateAlt).not.toBeCalled()
  const altButton = getByText('Missing alt text')
  await fireEvent.mouseOver(altButton)

  const altInput = getByPlaceholderText('Enter alt text …')
  await fireEvent.update(altInput, 'test')
  await fireEvent.blur(altInput)
  expect(updateAlt).toBeCalledWith('test')
})

it.skip('update caption success', async () => {
  const updateCaption = vi.fn()
  const { getByPlaceholderText } = render(PhotoCard, {
    props: {
      ...props,
      img: 'test.jpg',
      updateCaption,
    },
  })

  expect(updateCaption).not.toBeCalled()
  const altInput = getByPlaceholderText('Add hero photo caption …')
  await fireEvent.update(altInput, 'test')
  await fireEvent.blur(altInput)
  expect(updateCaption).toBeCalledWith('test')
})

it('update link success', async () => {
  const updateLink = vi.fn()
  const { getByTestId, getByPlaceholderText } = render(PhotoCard, {
    props: {
      ...props,
      img: 'test.jpg',
      updateLink,
    },
  })
  expect(updateLink).not.toBeCalled()
  const linkButton = getByTestId('link-button')
  await fireEvent.click(linkButton)

  const linkInput = getByPlaceholderText('Paste link...')
  await fireEvent.update(linkInput, 'test')
  await fireEvent.keyDown(linkInput, { key: 'Enter' })
  expect(updateLink).toBeCalledWith('test')
})
