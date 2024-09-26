import type { InjectionKey, UnwrapNestedRefs } from 'vue'

export interface NotificationConfig {
  key?: string
  message: string
  icon: string
  iconColor: string
  okText?: string
  cancelText?: string
  ok?: () => void
  close?: () => void
}
export type ProvideContentInterface = UnwrapNestedRefs<{
  notify: (config: NotificationConfig) => Promise<boolean>
  notifyForPublishNowAndConfirmUndo: (config: {
    key: string
    ok?: () => Promise<void> | void
    close?: () => Promise<void> | void
  }) => Promise<boolean>
  notifyForPublishHasScheduledAndConfirmUndo: (config: {
    key: string
    ok?: () => Promise<void> | void
    close?: () => Promise<void> | void
  }) => Promise<boolean>
  notifyForUnpublishAndConfirmUndo: (config: {
    key: string
    ok?: () => Promise<void> | void
    close?: () => Promise<void> | void
  }) => Promise<boolean>
  notifyForDeleteAndConfirmUndo: (config: {
    key: string
    ok?: () => Promise<void> | void
    close?: () => Promise<void> | void
  }) => Promise<boolean>
  closeAll: () => Promise<void>
}>
export const key = Symbol('notification-for-Kanban') as InjectionKey<ProvideContentInterface>
