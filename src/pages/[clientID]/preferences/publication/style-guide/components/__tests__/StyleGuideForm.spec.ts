import { fireEvent } from '@testing-library/vue'
import StyleGuideForm from '../StyleGuideForm.vue'
import { render } from '~/test-helpers'

const props = {
  modelValue: {
    errorTitle: 'title',
    errorDescription: 'description',
    instructions: 'instructions',
  },
  index: 0,
  hideDropdown: false,
  errors: {},
}

it('render style guide form', () => {
  const { getAllByRole } = render(StyleGuideForm, { props })

  const {
    modelValue: { errorTitle, instructions },
  } = props

  expect(getAllByRole('textbox')[0]).toHaveValue(errorTitle)
  expect(getAllByRole('textbox')[1]).toHaveValue(instructions)
})

it('hide dropdown menu button', () => {
  const { queryByRole } = render(StyleGuideForm, {
    props: { ...props, hideDropdown: true },
  })

  expect(queryByRole('button')).not.toBeInTheDocument()
})

it('update rule', async () => {
  const onChangeRule = vi.fn()
  const { getAllByRole } = render(StyleGuideForm, { props: { ...props, onChangeRule } })

  // same value will not emit change
  await fireEvent.update(getAllByRole('textbox')[0], 'title')
  await fireEvent.update(getAllByRole('textbox')[1], 'instructions')

  expect(onChangeRule).toHaveBeenCalledTimes(0)

  await fireEvent.update(getAllByRole('textbox')[0], 'title1')
  await fireEvent.update(getAllByRole('textbox')[1], 'instructions1')

  expect(onChangeRule).toHaveBeenCalledTimes(2)
})

it('delete rule', async () => {
  const onDeleteRule = vi.fn()
  const { getByRole, getByTestId } = render(StyleGuideForm, { props: { ...props, onDeleteRule } })

  await fireEvent.click(getByRole('button'))

  expect(getByTestId('dropdown-menu')).toBeVisible()

  await fireEvent.click(getByRole('menuitem', { name: 'Delete rule' }))

  expect(onDeleteRule).toHaveBeenCalledTimes(1)
})

it('show style guide preview', async () => {
  const onShowPreview = vi.fn()
  const { getAllByRole } = render(StyleGuideForm, { props: { ...props, onShowPreview } })

  await getAllByRole('textbox')[0].focus()
  await getAllByRole('textbox')[1].focus()

  expect(onShowPreview).toHaveBeenCalledTimes(2)
})

it('hide style guide preview', async () => {
  const onHidePreview = vi.fn()
  const { getAllByRole } = render(StyleGuideForm, { props: { ...props, onHidePreview } })

  await getAllByRole('textbox')[0].focus()
  await getAllByRole('textbox')[0].blur()

  await getAllByRole('textbox')[1].focus()
  await getAllByRole('textbox')[1].blur()

  expect(onHidePreview).toHaveBeenCalledTimes(2)
})
