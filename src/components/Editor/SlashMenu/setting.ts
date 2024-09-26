import Unsplash from '@assets/icons-unsplash.svg'
import Twitter from '@assets/icons-twitter.svg'
import Instagram from '@assets/icons-instagram.svg'
import YouTube from '@assets/icons-youtube.svg'
import Vimeo from '@assets/icons-vimeo.svg'
import Spotify from '@assets/icons-spotify.svg'
import SoundCloud from '@assets/icons-soundcloud.svg'
import Codepen from '@assets/icons-codepen.svg'
import Html from '@assets/icons-html-embed.svg'
import type { Editor, Range } from '@tiptap/vue-3'
import Embed from '@assets/icons-embed.svg'
import type { BlockType, EmbedType } from '../core/utils'

export const iconSrc = {
  EMBED: Embed,
  HTML: Html,
  UNSPLASH: Unsplash,
  TWITTER: Twitter,
  INSTAGRAM: Instagram,
  YOUTUBE: YouTube,
  VIMEO: Vimeo,
  SPOTIFY: Spotify,
  SOUNDCLOUD: SoundCloud,
  CODEPEN: Codepen,
}

type BlockCommands =
  | 'clearNodes'
  | 'setHorizontalRule'
  | 'toggleBulletList'
  | 'setImage'
  | 'setGallery'
  | 'setEmbed'
  | 'setResource'
  | 'setCodeBlock'
  | 'addTableOfContent'
  | 'toggleBlockquote'
  | 'toggleHeading'
  | 'toggleOrderedList'

export interface BlockItem {
  key: BlockType | EmbedType
  title: string
  description: string
  iconName: string
  action: BlockCommands
  options?: object
  command: (props: { editor: Editor; range: Range; props: any }) => void
}

export interface GroupItem {
  title: string
  blocks: BlockItem[] | []
}
