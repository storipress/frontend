import type { Instance } from 'tippy.js'
import tippy from 'tippy.js'
import { VueRenderer } from '@tiptap/vue-3'
import type { Editor, Range } from '@tiptap/vue-3'
import type { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import { useFuse } from '@vueuse/integrations/useFuse'
import { BlockType, EmbedType } from '../core/utils'
import CommandsList from './CommandsList.vue'
import { iconSrc } from './setting'
import type { BlockItem } from './setting'
import { useSlashMenuStore } from './utils/store'
import { clientID } from '~/components/Editor/core/client'
import { UNSPLASH } from '~/utils/image-source'

export const basicBlocks: BlockItem[] = [
  {
    key: BlockType.text,
    title: 'Text',
    description: 'Writing with plain text',
    action: 'clearNodes',
    iconName: 'text',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).clearNodes().focus().run()
    },
  },
  {
    key: BlockType.h2,
    title: 'Heading 2',
    description: 'Big section heading',
    iconName: 'H2',
    action: 'toggleHeading',
    options: { level: 2 },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).toggleHeading({ level: 2 }).focus().run()
    },
  },
  {
    key: BlockType.h3,
    title: 'Heading 3',
    description: 'Small section heading',
    iconName: 'H3',
    action: 'toggleHeading',
    options: { level: 3 },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).toggleHeading({ level: 3 }).focus().run()
    },
  },
  {
    key: BlockType.bullet,
    title: 'Bulleted list',
    description: 'Create a simple bulleted list',
    iconName: 'list_bullet',
    action: 'toggleBulletList',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).toggleBulletList().focus().run()
    },
  },
  {
    key: BlockType.numbered,
    title: 'Numbered list',
    description: 'Create a simple numbered list',
    iconName: 'list_number',
    action: 'toggleOrderedList',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).toggleOrderedList().focus().run()
    },
  },
  {
    key: BlockType.quote,
    title: 'Quote',
    description: 'Capture a quote',
    action: 'toggleBlockquote',
    iconName: 'quote',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).toggleBlockquote().focus().run()
    },
  },
  {
    key: BlockType.divider,
    title: 'Divider',
    description: 'Visually divide blocks',
    action: 'setHorizontalRule',
    iconName: 'divider',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).setHorizontalRule().focus().run()
    },
  },
  {
    key: BlockType.photo,
    title: 'Photo',
    description: 'Upload an image',
    iconName: 'image',
    action: 'setImage',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).setImage({ src: '' }).setTextSelection(range.from).focus().run()
    },
  },
  {
    key: BlockType.gallery,
    title: 'Gallery',
    description: 'An image gallery',
    iconName: 'gallery',
    action: 'setGallery',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).setGallery({ images: [], title: '' }).setTextSelection(range.from).focus().run()
    },
  },
  {
    key: BlockType.bookmark,
    title: 'Bookmark',
    description: 'Present link as a visual bookmark',
    iconName: 'bookmark',
    action: 'setResource',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).setResource({ type: 'bookmark' }).focus().run()
    },
  },
  {
    key: BlockType.codeblock,
    title: 'Code snippet',
    description: 'An inline code snippet',
    iconName: 'code_injection',
    action: 'setCodeBlock',
    options: { name: 'code', language: 'html' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).setCodeBlock({ language: 'html' }).setTextSelection(range.from).focus().run()
    },
  },
  {
    key: BlockType.tableOfContent,
    title: 'Table of contents',
    description: 'Show an outline of your page',
    iconName: 'table_of_contents',
    action: 'addTableOfContent',
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().deleteRange(range).addTableOfContent().focus().run()
    },
  },
]

export const richMediaEmbeds: BlockItem[] = [
  {
    key: BlockType.html,
    title: 'HTML',
    description: 'Embed using an HTML snippet',
    iconName: iconSrc.HTML,
    action: 'setEmbed',
    options: { name: 'html' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor
        .chain()
        .deleteRange(range)
        .setEmbed({ name: 'html', content: '' })
        .setTextSelection(range.from)
        .focus()
        .run()
    },
  },
  {
    key: BlockType.embed,
    title: 'Embed',
    description: 'Embed a link',
    action: 'setResource',
    iconName: iconSrc.EMBED,
    options: { type: 'embed' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: '' }).run()
    },
  },
  {
    key: EmbedType.unsplash,
    title: 'Unsplash',
    description: 'Insert a photo from Unsplash',
    iconName: iconSrc.UNSPLASH,
    action: 'setImage',
    options: {
      provider: UNSPLASH,
      cid: clientID,
    },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setImage({ provider: UNSPLASH, cid: clientID }).run()
    },
  },
  {
    key: EmbedType.twitter,
    title: 'Twitter',
    description: 'Embed a Tweet or account',
    iconName: iconSrc.TWITTER,
    action: 'setResource',
    options: { type: 'embed', target: 'twitter' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'twitter' }).run()
    },
  },
  {
    key: EmbedType.instagram,
    title: 'Instagram',
    description: 'Embed a Instagram photo or account',
    iconName: iconSrc.INSTAGRAM,
    action: 'setResource',
    options: { type: 'embed', target: 'instagram' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'instagram' }).run()
    },
  },
  {
    key: EmbedType.youtube,
    title: 'YouTube',
    description: 'Embed a YouTube video',
    iconName: iconSrc.YOUTUBE,
    action: 'setResource',
    options: { type: 'embed', target: 'youtube' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'youtube' }).run()
    },
  },
  {
    key: EmbedType.vimeo,
    title: 'Vimeo',
    description: 'Embed a Vimeo video',
    iconName: iconSrc.VIMEO,
    action: 'setResource',
    options: { type: 'embed', target: 'vimeo' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'vimeo' }).run()
    },
  },
  {
    key: EmbedType.spotify,
    title: 'Spotify',
    description: 'Embed a Spotify song or playlist',
    iconName: iconSrc.SPOTIFY,
    action: 'setResource',
    options: { type: 'embed', target: 'spotify' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'spotify' }).run()
    },
  },
  {
    key: EmbedType.soundCloud,
    title: 'SoundCloud',
    description: 'Embed a SoundCloud song or playlist',
    iconName: iconSrc.SOUNDCLOUD,
    action: 'setResource',
    options: { type: 'embed', target: 'soundcloud' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'soundcloud' }).run()
    },
  },
  {
    key: EmbedType.codepen,
    title: 'Codepen',
    description: 'Embed a Codepen',
    iconName: iconSrc.CODEPEN,
    action: 'setResource',
    options: { type: 'embed', target: 'codepen' },
    command: ({ editor, range }: { editor: Editor; range: Range }) => {
      editor.chain().focus().deleteRange(range).setResource({ type: 'embed', target: 'codepen' }).run()
    },
  },
]

const options = {
  fuseOptions: {
    keys: ['title', 'description', 'iconName'],
    threshold: 0.1,
  },
  matchAllWhenSearchEmpty: true,
}

export function slashMenuItems({ query }: { query: string }) {
  const { results: filtedBasic } = useFuse(query.toLowerCase(), basicBlocks, options)
  const { results: filtedRich } = useFuse(query.toLowerCase(), richMediaEmbeds, options)

  return [
    {
      title: 'Basic Blocks',
      blocks: filtedBasic.value.map((item) => item.item),
    },
    {
      title: 'Rich Media Embeds',
      blocks: filtedRich.value.map((item) => item.item),
    },
  ]
}

export default {
  items: ({ query }: { query: string }) => {
    const slashMenuStore = useSlashMenuStore()
    const { results } = useFuse(query.toLowerCase(), slashMenuStore.customBlocks?.blocks ?? [], options)
    return computed(() => [
      ...slashMenuItems({ query }),
      ...(results.value ? [{ ...slashMenuStore.customBlocks, blocks: results.value.map((item) => item.item) }] : []),
    ])
  },
  render: () => {
    let component: VueRenderer
    let popup: Instance[]

    return {
      onStart: (props: SuggestionProps) => {
        component = new VueRenderer(CommandsList, {
          props,
          editor: props.editor,
        })

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props)
        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        })
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup[0].destroy()
        component.destroy()
      },
    }
  },
}
