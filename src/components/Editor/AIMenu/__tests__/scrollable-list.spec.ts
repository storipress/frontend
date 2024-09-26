import { fireEvent } from '@testing-library/vue'
import { focusOrSubmit } from '../utils'

const focusCurrent = vi.fn()
const onKeyDown = vi.fn()

describe('scrollableList trigger event', () => {
  it('trigger focus when no content, and click Backspace', async () => {
    focusOrSubmit(focusCurrent, onKeyDown, ref(''))
    await fireEvent.keyDown(document, { key: 'Backspace', code: 'Backspace' })
    expect(focusCurrent).toBeCalled()
  })

  it('trigger keydown when having content, and click Enter', async () => {
    focusOrSubmit(focusCurrent, onKeyDown, ref('content'))
    await fireEvent.keyDown(document, { key: 'Enter' })
    expect(onKeyDown).toBeCalled()
  })
})
