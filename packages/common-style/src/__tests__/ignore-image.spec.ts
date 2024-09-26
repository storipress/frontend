import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { compileAsync } from 'sass'

const __dirname = dirname(fileURLToPath(import.meta.url))

it('can ignore image', async () => {
  const { css } = await compileAsync(join(__dirname, './with-ignore-image.scss'))
  expect(css).not.toContain('data-format=image')
})

it('can have image style', async () => {
  const { css } = await compileAsync(join(__dirname, './without-ignore-image.scss'))
  expect(css).toContain('data-format=image')
})
