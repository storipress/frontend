import { server } from '@test/server'
import { graphql } from 'msw'
import { expect, it, vi } from 'vitest'
import { setActivePinia } from 'pinia'
import { useSlugUnique } from '../use-slug-unique'
import { warning } from '~/lib/linter'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'

function mockSlugDuplicate() {
  server.use(
    graphql.mutation('UpdateArticle', (_req, res, ctx) => {
      return res.once(ctx.errors([{ message: 'Slug is already taken' }]))
    }),
  )
}

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
})

it('should show error when slug is not unique', async () => {
  mockSlugDuplicate()

  const setError = vi.fn()
  const checkSlugUnique = useSlugUnique('id', setError)

  await expect(checkSlugUnique('slug')).resolves.toBe(false)
  expect(setError).toBeCalledWith(warning.slugUnigue)
})

it('should clear error state if slug is unique', async () => {
  const setError = vi.fn()
  const checkSlugUnique = useSlugUnique('id', setError)

  await expect(checkSlugUnique('slug')).resolves.toBe(true)
  expect(setError).toBeCalledWith(undefined)
})

it('empty string should immediately pass validation', async () => {
  const setError = vi.fn()
  const checkSlugUnique = useSlugUnique('id', setError)

  await expect(checkSlugUnique('slug')).resolves.toBe(true)
  expect(setError).toBeCalledWith(undefined)

  mockSlugDuplicate()

  // proof no API call
  await expect(checkSlugUnique(''), 'empty string trigger API').resolves.toBe(true)
  expect(setError).toBeCalledWith(undefined)

  // trigger API call
  await expect(checkSlugUnique('another-slug')).resolves.toBe(false)
  expect(setError).toBeCalledWith(warning.slugUnigue)
})
