import Title from '@article-templates/elements/title.vue'
import Description from '@article-templates/elements/description.vue'
import HeadlineImage from '@article-templates/elements/headline-image.vue'
import Content from './content.vue'
import Icon from './Icon.vue'
import NuxtImg from './NuxtImg.vue'
import NuxtPicture from './NuxtPicture.vue'

export const preview = {
  ArticleTitle: Title,
  ArticleHeroPhoto: HeadlineImage,
  ArticleBlurb: Description,
  ArticleBody: Content,
  Icon,
  NuxtImg,
  NuxtPicture,
}
