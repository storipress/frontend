import { describe, expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import UploadHero from './UploadHero.vue'
import { render } from '~/test-helpers'

const props = {
  coverUrl: '',
  coverAlt: '',
  coverCaption: '',
  coverCrop: {
    left: 0,
    top: 0,
    zoom: 1,
    realWidth: 0,
    realHeight: 0,
    width: 0,
    height: 0,
  },
  addCover: () => {},
  callUnsplash: async () => {},
  removeCover: () => {},
  updateCoverAlt: () => {},
  updateCoverCaption: () => {},
}

describe('upload cover success', () => {
  it('trigger upload failed when no file', async () => {
    const addCover = vi.fn()
    const { getByText } = render(UploadHero, {
      props: {
        ...props,
        addCover,
      },
    })

    expect(addCover).not.toBeCalled()
    const uploadBody = getByText('hero', { exact: false })
    await fireEvent.mouseOver(uploadBody)

    const button = getByText('Upload from computer')
    await fireEvent.click(button)
    expect(addCover).not.toBeCalled()
  })

  it('trigger unsplash success', async () => {
    const callUnsplash = vi.fn()
    const { getByText } = render(UploadHero, {
      props: {
        ...props,
        callUnsplash,
      },
    })
    expect(callUnsplash).not.toBeCalled()
    const uploadBody = getByText('hero', { exact: false })
    await fireEvent.mouseOver(uploadBody)

    const button = getByText('Select from Unsplash')
    await fireEvent.click(button)
    expect(callUnsplash).toBeCalled()
  })
})

it('delete cover success', async () => {
  const removeCover = vi.fn()
  const { getByText } = render(UploadHero, {
    props: {
      ...props,
      coverUrl: 'https://example.com/test.jpg',
      removeCover,
    },
  })
  expect(removeCover).not.toBeCalled()
  const uploadBody = getByText('Missing alt text')
  await fireEvent.mouseOver(uploadBody)

  const deleteButton = getByText('Remove photo')
  await fireEvent.click(deleteButton)
  expect(removeCover).toBeCalled()
})

it('update alt success', async () => {
  const updateCoverAlt = vi.fn()
  const { getByText, getByPlaceholderText, emitted } = render(UploadHero, {
    props: {
      ...props,
      coverUrl: 'https://example.com/test.jpg',
      updateCoverAlt,
    },
  })
  expect(updateCoverAlt).not.toBeCalled()
  expect(emitted()).not.toHaveProperty('changeCover')

  const uploadBody = getByText('Missing alt text')
  await fireEvent.mouseOver(uploadBody)

  const altInput = getByPlaceholderText('Enter alt Text')
  await fireEvent.update(altInput, 'test')
  expect(emitted()).toHaveProperty('changeCover')
  expect(emitted().changeCover[0]).toEqual(['test', 'coverAlt', 'alt'])
})
