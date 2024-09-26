import { expect, it, vi } from 'vitest'
import { fireEvent, waitFor } from '@testing-library/vue'
import NewArticle from './new-article.vue'
import { render } from '~/test-helpers'

Element.prototype.compareDocumentPosition = () => Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC

it.skip('prevent create article without title', async () => {
  const onSubmit = vi.fn()
  const { getByRole, findByRole } = render(NewArticle, {
    props: {
      publication: 'Blog',
      modelValue: true,
      onSubmit,
    },
  })

  const testerDesk = await findByRole('radio', { name: 'Tester' })
  await fireEvent.click(testerDesk)

  const submitButton = getByRole('button', { name: 'New Story' })
  await fireEvent.click(submitButton)

  expect(testerDesk).toBeChecked()
  // validation is async
  // await expect(findByText('Title is required')).resolves.toBeVisible()
  expect(onSubmit).not.toBeCalled()
})

it.skip('prevent create article without desk', async () => {
  const onSubmit = vi.fn()
  const { getByRole, queryByText, findByRole, findByText } = render(NewArticle, {
    props: {
      publication: 'Blog',
      modelValue: true,
      onSubmit,
    },
  })

  // wait desk loaded
  await findByRole('radio', { name: 'Tester' })

  const titleInput = getByRole('textbox', { name: 'title' })
  await fireEvent.update(titleInput, 'Title')

  const submitButton = getByRole('button', { name: 'New Story' })
  await fireEvent.click(submitButton)

  expect(queryByText('Title is required')).toBeFalsy()
  // validation is async
  await expect(findByText('Select a desk')).resolves.toBeVisible()
  expect(onSubmit).not.toBeCalled()
})

it.skip('emit submit for filled data', async () => {
  const onSubmit = vi.fn()
  const { getByRole, findByRole } = render(NewArticle, {
    props: {
      publication: 'Blog',
      modelValue: true,
      onSubmit,
    },
  })

  const testerDesk = await findByRole('radio', { name: 'Tester' })
  await fireEvent.click(testerDesk)

  const titleInput = getByRole('textbox', { name: 'title' })
  await fireEvent.update(titleInput, 'Title')

  const submitButton = getByRole('button', { name: 'New Story' })
  await fireEvent.click(submitButton)

  // wait for validation
  await waitFor(() => {
    expect(onSubmit).toBeCalled()
  })
  expect(onSubmit).toBeCalledWith({
    title: 'Title',
    blurb: '',
    desk: '2',
    authors: ['152'],
  })
})
