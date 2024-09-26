import { getImageSource } from '../image-source'

it.each([
  [
    'https://images.unsplash.com/photo-1716369414811-ab4b06d8fb0e?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'unsplash',
  ],
  ['https://assets.stori.press/media/images/6cb12b14-3dac-4ccc-a6f4-98973b7f23bf.png', 'storipress'],
  ['https://robohash.org/HTB.png', 'external-image'],
])('can check image source %s', (url, expected) => {
  expect(getImageSource(url)).toBe(expected)
})
