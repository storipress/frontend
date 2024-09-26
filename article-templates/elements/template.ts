import { defineComponent } from 'vue'
import ArticleContent from './article-content.vue'
import TitleElement from './title.vue'
import Paragraph from './paragraph.vue'
import HeadlineImage from './headline-image.vue'
import HeadlineCaption from './headline-caption.vue'
import Header1 from './header1.vue'
import { Authors } from './authors'
import Header2 from './header2.vue'
import HeaderBlock from './header.vue'
import HeadlineWrapper from './headline-wrapper.vue'
import Desk from './desk.vue'
import Description from './description.vue'
import Date from './date.vue'
import Content from './content.vue'
import ColorArea from './color-area.vue'
import Blockquote from './blockquote.vue'
import AuthorName from './author-name.vue'
import AuthorList from './author-list.vue'
import ArticleElement from './article.vue'
import LinkElement from './link-element.vue'
import ArticleInfo from './article-info.vue'

export const Template = defineComponent({
  components: {
    ArticleContent,
    TitleElement,
    Paragraph,
    HeadlineImage,
    HeadlineCaption,
    HeadlineWrapper,
    Header1,
    Header2,
    Header: HeaderBlock,
    HeaderBlock,
    Desk,
    Description,
    Date,
    Content,
    ColorArea,
    Blockquote,
    AuthorName,
    AuthorList,
    ArticleElement,
    ArticleBlock: ArticleElement,
    Authors,
    LinkElement,
    ArticleInfo,
  },

  setup(_, { slots }) {
    return () => slots.default!()
  },
})

const patched = Template as any

patched.extend = (opts: any) =>
  defineComponent({
    mixins: [Template],
    ...opts,
  })
