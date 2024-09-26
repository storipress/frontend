import type { MockInstance } from 'vitest'
import { expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import { inject, nextTick, ref } from 'vue'
import invariant from 'tiny-invariant'
import Notifications from './Notifications.vue'
import NotificationList from './NotificationList.vue'
import notifications, { NOTIFICATION_KEY } from './index'

describe('notifications renders and click event', () => {
  let onOk: MockInstance<(...args: any[]) => any>
  let onCancel: MockInstance<(...args: any[]) => any>
  let onClose: MockInstance<(...args: any[]) => any>
  // Arrange
  const view = () => {
    onOk = vi.fn()
    onCancel = vi.fn()
    onClose = vi.fn()

    return render(
      {
        components: { Notifications },
        setup: () => {
          const notification = ref()
          const closeNotification = (el: HTMLElement) => {
            el?.remove()
          }
          return { notification, closeNotification }
        },
        template: /* html */ `
          <Notifications
            ref="notification"
            ok-text="Undo"
            cancel-text="Dismiss"
            :show="true"
            :close-notification="closeNotification"
          />
        `,
      },
      { props: { onOk, onCancel, onClose } },
    )
  }

  it('emits click event when submit button is clicked', async () => {
    const { getByRole } = view()
    await nextTick()
    const submitButton = getByRole('button', { name: 'Undo' })

    // Assert
    expect(submitButton).toHaveTextContent('Undo')

    // Act
    await fireEvent.click(submitButton)

    // Assert
    expect(onOk).toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('emits click event when cancel button is clicked', async () => {
    const { getByRole } = view()
    await nextTick()
    const cancelButton = getByRole('button', { name: 'Dismiss' })

    // Assert
    expect(cancelButton).toHaveTextContent('Dismiss')

    // Act
    await fireEvent.click(cancelButton)

    // Assert
    expect(onOk).not.toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('emits click event when close button is clicked', async () => {
    const { getByRole } = view()
    await nextTick()
    const closeButton = getByRole('button', { name: 'Close' })

    // Assert
    expect(closeButton).toBeInTheDocument()

    // Act
    await fireEvent.click(closeButton)

    // Assert
    expect(onOk).not.toHaveBeenCalled()
    expect(onCancel).not.toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})

describe('delayed execution', () => {
  afterEach(() => {
    vi.useRealTimers()
  })
  it('notification timer', async () => {
    // Arrange
    const timeoutHandler = vi.fn()
    const { getByText } = render(
      {
        components: { NotificationList },
        setup: () => {
          const notification = inject(NOTIFICATION_KEY)
          const closeNotification = (el: HTMLElement) => {
            el.remove()
          }
          const showNotification = () => {
            invariant(notification)
            const { onTimeout } = notification({
              timeout: 8000,
              title: 'Notification title',
              type: 'primary',
              content: 'Notification content',
            })
            onTimeout(timeoutHandler)
          }
          return { showNotification, closeNotification }
        },
        template: /* html */ `
          <div>
            <button @click="showNotification">show notification</button>
            <NotificationList />
          </div>
        `,
      },
      {
        global: { plugins: [notifications] },
      },
    )
    vi.useFakeTimers()

    const button = getByText('show notification')
    await fireEvent.click(button)
    const notification = getByText('Notification title')

    // Assert
    expect(notification).toBeInTheDocument()
    expect(timeoutHandler).not.toHaveBeenCalled()

    // Act
    vi.advanceTimersByTime(1000)
    await nextTick()

    // Assert
    expect(notification).toBeInTheDocument()
    expect(timeoutHandler).not.toHaveBeenCalled()

    // Act
    vi.advanceTimersByTime(7000)
    await nextTick()

    // Assert
    expect(notification).not.toBeInTheDocument()
    expect(timeoutHandler).toHaveBeenCalled()
  })
})
