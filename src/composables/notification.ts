import { constant, noop } from 'lodash-es'
import pDefer from 'p-defer'
import type { NotificationOptions } from '@storipress/core-component'
import { NOTIFICATION_KEY } from '@storipress/core-component'
import type { EventHookOn } from '@vueuse/core'
import { useSharedPreventLeave } from './prevent-leave'

interface NotificationReturn {
  onClose: EventHookOn<void>
  onOk: EventHookOn<void>
  onCancel: EventHookOn<void>
  onTimeout: EventHookOn<void>
}

type NotificationFactory = (options: Omit<NotificationOptions, 'moveValue'>) => NotificationReturn

type PresetKeys = 'articleUnpublished' | 'articlePublished' | 'articleScheduled' | 'articleDeleted'

const PRESETS: Record<PresetKeys, Omit<NotificationOptions, 'moveValue'>> = {
  articleUnpublished: {
    title: 'Article unpublished',
    type: 'primary',
    iconName: 'draft',
    okText: 'Undo',
    cancelText: 'Dismiss',
  },
  articlePublished: {
    title: 'Article published',
    type: 'primary',
    iconName: 'published',
    content: 'Site build initiated. Article will go live in 3-5 mins.',
    okText: 'Undo',
    cancelText: 'Dismiss',
  },
  articleScheduled: {
    title: 'Article scheduled',
    type: 'primary',
    iconName: 'schedule',
    content: 'Article scheduled for future publication.',
    okText: 'Undo',
    cancelText: 'Dismiss',
  },
  articleDeleted: {
    title: 'Article deleted',
    type: 'warning',
    iconName: 'delete',
    content: '',
    okText: 'Undo',
    cancelText: 'Dismiss',
  },
}

type FixedNotificationOptions = Omit<NotificationOptions, 'moveValue'>

type ExtendedNotificationOptions =
  | ({ preset: PresetKeys } & Partial<FixedNotificationOptions>)
  | ({ preset?: null | undefined } & FixedNotificationOptions)

interface UseNotificationReturn {
  create: NotificationFactory
}

interface UseBlockingNotificationReturn {
  create: (options: ExtendedNotificationOptions) => Promise<boolean>
}

const DEFAULT_TIMEOUT = 5000

const noopEventHook: EventHookOn<void> = constant({ off: noop })

const noopFactory: NotificationFactory = constant({
  onClose: noopEventHook,
  onOk: noopEventHook,
  onCancel: noopEventHook,
  onTimeout: noopEventHook,
})

/**
 * Get the notification factory from the app context
 * @returns notification factory
 */
export function useNotification(): UseNotificationReturn {
  const create = inject(NOTIFICATION_KEY, noopFactory)

  return {
    create(options: ExtendedNotificationOptions) {
      const opt = resolveOptions(options)

      return create(opt)
    },
  }
}

/**
 * Get a factory for cancelable notifications, which will return a promise
 * @returns a Promise that resolves to FALSE if the user clicks the OK button, false otherwise
 */
export function useCancelableNotification(): UseBlockingNotificationReturn {
  const { create } = useNotification()

  return {
    create(options: ExtendedNotificationOptions) {
      const deferred = pDefer<boolean>()
      const { onCancel, onOk, onTimeout } = create(options as FixedNotificationOptions)

      const cleanup = useSharedPreventLeave()

      function cancel() {
        cleanup()
        deferred.resolve(false)
      }

      function ok() {
        cleanup()
        deferred.resolve(true)
      }

      onCancel(ok)
      onTimeout(ok)
      onOk(cancel)
      // ensure timeout is called
      setTimeout(ok, options.timeout ?? DEFAULT_TIMEOUT)

      return deferred.promise
    },
  }
}

function resolveOptions(options: ExtendedNotificationOptions): NotificationOptions {
  if (options.preset) {
    return { ...PRESETS[options.preset], ...options } as unknown as NotificationOptions
  }

  return options as NotificationOptions
}
