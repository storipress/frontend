import { defineComponent, h } from 'vue'

import LinkElement from './link-element.vue'
import { compositionStyleProps } from './style-props'
import { useArticleElement } from './inject'
import AuthorName from './author-name.vue'

export const Authors = defineComponent({
  name: 'Authors',

  props: {
    separator: {
      type: String,
      default: ', ',
    },
    authorClass: {
      type: String,
    },
    separatorClass: {
      type: String,
    },
    ...compositionStyleProps,
  },

  setup(props, { slots }) {
    const $element = useArticleElement()
    const authors = ref($element?.authors)

    function createSeparator(author: object, i: number) {
      const slot = slots.separator?.({ author, index: i, total: authors.value.length })
      if (i === authors.value.length - 1) {
        return slot ?? h(AuthorName, { key: `${i}-sep`, class: props.separatorClass }, () => [' and '])
      }

      if (i !== 0) {
        return slot ?? h(AuthorName, { key: `${i}-sep` }, () => [props.separator])
      }

      return null
    }

    watch(
      () => $element?.authors,
      (nowAuthors) => {
        authors.value = nowAuthors
      },
    )

    return () => {
      const { authorClass, separator: _separator, separatorClass: _separatorClass, ...textProps } = props

      const authorNodes =
        authors.value.length === 1
          ? [
              h(LinkElement, { class: authorClass, props: { href: authors.value[0].url } }, () => [
                slots.name?.({ author: authors.value[0], index: 0 }) ??
                  h(AuthorName, { props: textProps }, () => [authors.value[0].name]),
              ]),
            ]
          : authors.value.flatMap((author, i) => [
              createSeparator(author, i),
              h(
                LinkElement,
                {
                  key: `${i}`,
                  class: authorClass,
                  props: {
                    href: author.url,
                  },
                },
                () => [slots.name?.({ author, index: i }) ?? h(AuthorName, { props: textProps }, () => [author.name])],
              ),
            ])

      return h('span', authorNodes)
    }
  },
})
