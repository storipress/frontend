import type { InjectionKey, Plugin, UnwrapNestedRefs } from 'vue'
import { reactive } from 'vue'
import type { EventHookOn } from '@vueuse/core'
import { createEventHook } from '@vueuse/core'
import type { Writable } from 'type-fest'
import type Notifications from './Notifications.vue'
import type { NotificationType } from './definition'

export interface NotificationOptions {
  title: string
  okText?: string
  cancelText?: string
  type?: NotificationType
  content?: string
  timeout?: number
  iconName?: string
  iconClass?: string
}
export { NotificationType }

interface NotificationReturn {
  onClose: EventHookOn<void>
  onOk: EventHookOn<void>
  onCancel: EventHookOn<void>
  onTimeout: EventHookOn<void>
}

export type NotificationFactory = (options: NotificationOptions) => NotificationReturn

export const NOTIFICATION_KEY: InjectionKey<NotificationFactory> = Symbol('notification')

interface NotificationState {
  list: InstanceType<typeof Notifications>['$props'][]
}
export const NOTIFICATION_INNER_KEY: InjectionKey<UnwrapNestedRefs<NotificationState>> = Symbol('notification-inner')

const innerState: UnwrapNestedRefs<NotificationState> = reactive({
  list: [],
})

const notifications: Plugin = {
  install(app) {
    app.provide('notifications', createNotifications)
    app.provide(NOTIFICATION_KEY, createNotifications)
    app.provide(NOTIFICATION_INNER_KEY, innerState)
  },
}

function createNotifications({
  title,
  okText,
  cancelText,
  type,
  content,
  timeout,
  iconName,
}: NotificationOptions): NotificationReturn {
  const okEvent = createEventHook()
  const cancelEvent = createEventHook()
  const timeoutEvent = createEventHook()
  const closeEvent = createEventHook()
  innerState.list.push({
    title,
    okText,
    cancelText,
    type,
    content,
    timeout,
    iconName,
    onOk: okEvent.trigger,
    onCancel: cancelEvent.trigger,
    onTimeout: timeoutEvent.trigger,
    onClose: closeEvent.trigger,
    show: true,
    closeNotification: () => {},
  })
  const currentItem: Writable<InstanceType<typeof Notifications>['$props']> =
    innerState.list[innerState.list.length - 1]
  currentItem.closeNotification = () => {
    const index = innerState.list.findIndex((item) => item === currentItem)
    if (index !== -1) innerState.list.splice(index, 1)
  }
  return {
    onOk: okEvent.on,
    onCancel: cancelEvent.on,
    onTimeout: timeoutEvent.on,
    onClose: closeEvent.on,
  }
}

export default notifications
export { default as NotificationList } from './NotificationList.vue'
