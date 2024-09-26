import type { DialogInfo } from '~/modules/editor/remote-dialog'

export interface UnsplashPhoto {
  src: string
  alt: string
  title: string
}

export type UnsplashDialogInfo = DialogInfo<'unsplash', true, UnsplashPhoto>
