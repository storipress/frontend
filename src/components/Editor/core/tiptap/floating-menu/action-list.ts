import { BlockType, EmbedType } from '../../utils'
import BlockBookmark from './assets/block-bookmark.svg'
import BlockBulletList from './assets/block-bullet-list.svg'
import BlockDivider from './assets/block-divider.svg'
import BlockGallery from './assets/block-gallery.svg'
import BlockEmbed from './assets/block-embed.svg'
import BlockH2 from './assets/block-h2.svg'
import BlockH3 from './assets/block-h3.svg'
import BlockHtmlEmbed from './assets/block-html-embed.svg'
import BlockNumberedList from './assets/block-numbered-list.svg'
import BlockPhoto from './assets/block-photo.svg'
import BlockQuote from './assets/block-quote.svg'
import BlockText from './assets/block-text.svg'
import BlockCodeInjection from './assets/block-code-injection.svg'
import BlockTableOfContent from './assets/block-table-of-content.svg'
import Unsplash from './assets/type-unsplash.svg'
import { UNSPLASH } from '~/utils/image-source'
import { clientID } from '~/components/Editor/core/client'

type FloatingCommands =
  | 'clearNodes'
  | 'setHorizontalRule'
  | 'toggleBulletList'
  | 'setImage'
  | 'setGallery'
  | 'setEmbed'
  | 'setResource'
  | 'addTableOfContent'
  | 'toggleBlockquote'
  | 'toggleHeading'
  | 'toggleOrderedList'
  | 'setCodeBlock'

export interface Format {
  name: string
  action: FloatingCommands
  options?: object
  [key: string]: unknown
}

export const primary: readonly Format[] = Object.freeze([
  {
    key: BlockType.text,
    name: 'Text',
    action: 'clearNodes',
    component: BlockText,
  },
  {
    key: BlockType.h2,
    name: 'H2',
    action: 'toggleHeading',
    component: BlockH2,
    options: { level: 2 },
  },
  {
    key: BlockType.h3,
    name: 'H3',
    action: 'toggleHeading',
    component: BlockH3,
    options: { level: 3 },
  },
  {
    key: BlockType.numbered,
    name: 'Numbered',
    action: 'toggleOrderedList',
    component: BlockNumberedList,
  },
  {
    key: BlockType.bullet,
    name: 'Bulleted',
    action: 'toggleBulletList',
    component: BlockBulletList,
  },
  {
    key: BlockType.quote,
    name: 'Quote',
    action: 'toggleBlockquote',
    component: BlockQuote,
  },
  {
    key: BlockType.divider,
    name: 'Divider',
    action: 'setHorizontalRule',
    component: BlockDivider,
  },
  {
    key: BlockType.photo,
    name: 'Photo',
    action: 'setImage',
    component: BlockPhoto,
  },
  {
    key: BlockType.gallery,
    name: 'Gallery',
    action: 'setGallery',
    component: BlockGallery,
  },
  {
    key: BlockType.bookmark,
    name: 'Bookmark',
    action: 'setResource',
    component: BlockBookmark,
    options: { type: 'bookmark' },
  },
  {
    key: BlockType.embed,
    name: 'Embed',
    action: 'setResource',
    component: BlockEmbed,
    options: { type: 'embed' },
  },
  {
    key: EmbedType.unsplash,
    name: 'Unsplash',
    description: 'License free photos',
    action: 'setImage',
    component: Unsplash,
    options: {
      provider: UNSPLASH,
      cid: clientID,
    },
  },
  {
    key: BlockType.html,
    name: 'HTML',
    action: 'setEmbed',
    component: BlockHtmlEmbed,
    options: { name: 'html' },
  },
  {
    key: BlockType.codeblock,
    name: 'Code',
    action: 'setCodeBlock',
    component: BlockCodeInjection,
    options: { name: 'code', language: 'html' },
  },
  {
    key: BlockType.tableOfContent,
    name: 'Table of content',
    action: 'addTableOfContent',
    component: BlockTableOfContent,
  },
])
