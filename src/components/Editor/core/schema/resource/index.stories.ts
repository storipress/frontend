import { h } from 'vue'
import { createStoryComponent } from '../story-helper'

import { Resource } from './index'
import type { API, BookmarkMeta } from '~/components/Editor/core/api'
import { injectAPI } from '~/components/Editor/core/api'

injectAPI({
  uploadImage: (file: File) => {
    return new Promise<string>((resolve) => {
      const url = URL.createObjectURL(file)
      // simulate upload
      setTimeout(() => {
        resolve(url)
      }, 1000)
    })
  },
  createImageURL: (url: string, edits: object = {}) => {
    return `${url}#${JSON.stringify(edits)}`
  },
  getBookmarkMeta: async (url: string) => {
    const nextTick = () => new Promise((resolve) => setTimeout(resolve, 300))
    await nextTick()
    const data: BookmarkMeta = {
      aspectRadio: 1,
      author: 'storipress',
      description: '',
      html: '<div style="max-width: 660px;"><div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 63%; padding-top: 284px;"><iframe src="//cdn.iframe.ly/api/iframe?card=1&app=1&url=https%3A%2F%2Fwww.instagram.com%2Fp%2FCVZe3RahHr4%2F%3Futm_source%3Dig_web_copy_link&key=6d002d15348823942403bf5e779d2cca" style="top: 0; left: 0; width: 100%; height: 100%; position: absolute; border: 0;" allowfullscreen></iframe></div></div>',
      icon: 'https://www.instagram.com/static/images/ico/apple-touch-icon-76x76-precomposed.png/666282be8229.png',
      maxWidth: 660,
      publisher: 'Instagram',
      thumbnail:
        'https://scontent.cdninstagram.com/v/t51.2885-15/247872806_459862755453608_5984124733699827108_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=scontent.cdninstagram.com&_nc_cat=108&_nc_ohc=OITerZ1J510AX_k4tcN&edm=AMO9-JQAAAAA&ccb=7-4&oh=00_AT-4ZLM-FFrKTMckqtSx27UIn6jGsrU2DnxKrSZJH1XbLw&oe=624F304D&_nc_sid=b9f2ee',
      title: 'A post shared by Storipress (@storipress)',
      url: 'https://www.instagram.com/p/CVZe3RahHr4/?utm_source=ig_web_copy_link',
    }
    return data
  },
} as unknown as API)

const ResourceView = createStoryComponent(Resource)

export default {
  title: 'EditorCore/Schema/Embed',
  component: ResourceView,
}

export function Default() {
  return {
    setup: () => () => h(ResourceView, { attrs: { type: 'bookmark' }, class: 'w-80 ml-10' }),
  }
}
