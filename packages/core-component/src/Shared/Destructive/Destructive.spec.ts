import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { ref } from 'vue'
import { html } from 'proper-tags'
import Destructive from './index.vue'

it('close destructive modal', async () => {
  const onModalClose = vi.fn()
  const onClickDelete = vi.fn()
  const { getByRole } = render(Destructive, {
    props: {
      title: 'Subs',
      confirmValue: 'New-York-Times/Delete-Members',
      buttonText: 'member(s)',
      visible: true,
      onOnModalClose: onModalClose,
      onOnClickDelete: onClickDelete,
    },
  })
  const closeButton = getByRole('button', { name: 'close' })

  await fireEvent.click(closeButton)

  expect(onModalClose).toHaveBeenCalledTimes(1)
  expect(onClickDelete).toHaveBeenCalledTimes(0)
})

it('type incorrect value', async () => {
  const onClickDelete = vi.fn()
  const { getByRole, getByPlaceholderText } = render(Destructive, {
    props: {
      title: 'Subs',
      confirmValue: 'New-York-Times/Delete-Members',
      buttonText: 'member(s)',
      visible: true,
      onOnClickDelete: onClickDelete,
    },
  })
  const input = getByPlaceholderText('New-York-Times/Delete-Members')
  const button = getByRole('button', {
    name: 'submit',
  })

  await fireEvent.update(input, 'New-York-Times')
  await fireEvent.click(button)

  expect(onClickDelete).toHaveBeenCalledTimes(0)
})

it('type correct value', async () => {
  const onClickDelete = vi.fn()
  const { getByRole, getByPlaceholderText } = render(Destructive, {
    props: {
      title: 'Subs',
      confirmValue: 'New-York-Times/Delete-Members',
      buttonText: 'member(s)',
      visible: true,
      onOnClickDelete: onClickDelete,
    },
  })
  const input = getByPlaceholderText('New-York-Times/Delete-Members')
  const button = getByRole('button', {
    name: 'submit',
  })

  await fireEvent.update(input, 'New-York-Times/Delete-Members')
  await fireEvent.click(button)

  expect(onClickDelete).toHaveBeenCalledTimes(1)
})

it('click event will not be emitted when loading', async () => {
  const onClickDelete = vi.fn()
  const { getByRole, getByPlaceholderText } = render(Destructive, {
    props: {
      title: 'Subs',
      confirmValue: 'New-York-Times/Delete-Members',
      buttonText: 'member(s)',
      visible: true,
      loading: true,
      onOnClickDelete: onClickDelete,
    },
  })
  const input = getByPlaceholderText('New-York-Times/Delete-Members')
  const button = getByRole('button', {
    name: 'submit',
  })

  await fireEvent.click(button)

  expect(input).toBeDisabled()
  expect(onClickDelete).toHaveBeenCalledTimes(0)
})

it('input value will init after modal close', async () => {
  const { getByRole, getByPlaceholderText } = render({
    components: { Destructive },
    setup: () => {
      const visible = ref(true)
      const args = {
        title: 'Subs',
        confirmValue: 'New-York-Times/Delete-Members',
        buttonText: 'member(s)',
      }

      return { visible, args }
    },
    template: html`
      <div>
        <button @click="visible = true">show destructive</button>
        <Destructive v-bind="args" :visible="visible" @on-modal-close="visible = false" />
      </div>
    `,
  })

  const input = getByPlaceholderText('New-York-Times/Delete-Members')
  const closeButton = getByRole('button', {
    name: 'close',
  })
  const openButton = getByRole('button', {
    name: 'show destructive',
  })

  await fireEvent.update(input, 'Test')
  expect(input).toHaveValue('Test')

  await fireEvent.click(closeButton)
  await fireEvent.click(openButton)
  expect(input).toHaveValue('')
})
