import type { InjectionKey, Ref, UnwrapNestedRefs } from 'vue'

export interface ConfirmOptionInterface {
  title: string
  description: string
  iconWarpClass?: string
  icon?: string
  iconClass?: string
  okText?: string
  okButtonClass?: string
  cancelText?: string
  cancelButtonClass?: string
  type?: 'info' | 'warning'
}

export interface ModalArgsInterface {
  id: string
  content: ConfirmOptionInterface
  visible: boolean
  isOk: boolean
  onClose: () => void
}

export type ProvideContentInterface = UnwrapNestedRefs<{
  modalList: ModalArgsInterface[]
  confirm: (option: Ref<ConfirmOptionInterface>) => Promise<boolean>
}>

export const key = Symbol('confirm-modal') as InjectionKey<ProvideContentInterface>
