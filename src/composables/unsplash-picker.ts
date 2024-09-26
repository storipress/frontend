import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'
import type { DialogInfo } from '~/modules/editor/remote-dialog'

interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}
type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>

export function useUnsplashPicker() {
  const { open } = useRemoteDialog<UnsplashDialogInfo>('unsplash')

  return {
    open() {
      return open(true)
    },
  }
}
