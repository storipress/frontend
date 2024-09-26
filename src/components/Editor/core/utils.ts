import delay from 'delay'

export const isMac = typeof window !== 'undefined' && /Mac/.test(window.navigator.platform)

export function nextTick(): Promise<void> {
  return delay(0)
}

type EditorBlockSource = 'floating_menu' | 'bubble_menu' | 'slash_menu'
interface EditorBlockTraceData {
  key: EmbedType | BlockType | StyleType
  options?: Options
}
interface Options {
  action?: string
  id?: string
  name?: string
}
export enum EmbedType {
  unsplash = 'unsplash',
  twitter = 'twitter',
  instagram = 'instagram',
  youtube = 'youtube',
  vimeo = 'vimeo',
  spotify = 'spotify',
  soundCloud = 'sound_cloud',
  codepen = 'codepen',
}
export enum BlockType {
  comment = 'comment',
  link = 'link',
  text = 'text',
  h2 = 'h2',
  h3 = 'h3',
  bullet = 'bullet',
  numbered = 'numbered',
  quote = 'quote',
  divider = 'divider',
  photo = 'photo',
  gallery = 'gallery',
  bookmark = 'bookmark',
  embed = 'embed',
  html = 'html',
  custom = 'custom',
  codeblock = 'codeblock',
  tableOfContent = 'tableOfContent',
}
export enum StyleType {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
}

const NOT_TRACK_ACTION = new Set(['toggleAI'])
const EDITOR_BLOCK_EVENT = 'editor_block_used'

export function editorBlockSendTrack(source: EditorBlockSource, property: EditorBlockTraceData) {
  if (property?.options?.action && NOT_TRACK_ACTION.has(property.options.action)) {
    return
  }
  const { key } = property
  if (key === EmbedType.unsplash) {
    sendTrackUnchecked(EDITOR_BLOCK_EVENT, {
      block: BlockType.photo,
      provider: EmbedType.unsplash,
      source,
    })
    return
  } else if (key in EmbedType) {
    sendTrackUnchecked(EDITOR_BLOCK_EVENT, {
      block: BlockType.embed,
      embedType: key,
      source,
    })
    return
  } else if (key in StyleType) {
    sendTrackUnchecked(EDITOR_BLOCK_EVENT, { style: key, source })
    return
  } else if (key === BlockType.custom) {
    sendTrackUnchecked(EDITOR_BLOCK_EVENT, {
      block: BlockType.custom,
      customBlock: { name: property.options?.name, ...(property.options?.id && { id: property.options.id }) },
      source,
    })
    return
  }
  sendTrackUnchecked(EDITOR_BLOCK_EVENT, { block: key, source })
}
