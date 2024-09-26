import { expect, it } from 'vitest'
import { basicBlocks, richMediaEmbeds } from '../suggestion'

it('contains basic blocks', () => {
  expect(basicBlocks.map((x) => x.key)).toMatchInlineSnapshot(`
    [
      "text",
      "h2",
      "h3",
      "bullet",
      "numbered",
      "quote",
      "divider",
      "photo",
      "gallery",
      "bookmark",
      "codeblock",
      "tableOfContent",
    ]
  `)
})

it('contains rich media blocks', () => {
  expect(richMediaEmbeds.map((x) => x.key)).toMatchInlineSnapshot(`
    [
      "html",
      "embed",
      "unsplash",
      "twitter",
      "instagram",
      "youtube",
      "vimeo",
      "spotify",
      "sound_cloud",
      "codepen",
    ]
  `)
})
