import type { ArticleInjected } from '@article-templates/elements/inject'

export const DEFAULT_PREVIEW_DATA: Partial<ArticleInjected> = {
  title: 'An Ode to Nothingness: Inner Dialogues on the Meaning of Absolutely Nothing.',
  blurb:
    'What is nothingness if nothingness is nothing? Sometimes one has to enquire as to the true meaning of this question; but other times, one must reflect introspectively to discover its true meaning.',
  authors: [
    {
      name: 'Storipress Helper',
      full_name: 'Storipress Helper',
      avatar: 'https://assets.stori.press/storipress/storipress-helper-user-avatar.webp',
      url: '#',
    },
  ],
  date: new Date(),
  desk: 'News',
  site: { name: 'Courier Express' },
  cover: {
    url: 'https://picsum.photos/seed/article/800/600',
  },
  headlineURL: 'https://picsum.photos/seed/article/800/600',
  headlineFocus: { x: 0, y: 0 },
  headlineAlt: '',
  headlineCaption: '',
  logo: 'https://assets.stori.press/storipress/sp-placeholder.svg',
  section: { selected: null, hover: null },
  elements: { dropcap: 'none', blockquote: 'none' },
  relevances: [
    {
      title: 'An Ode to Nothingness: Inner Dialogues on the Meaning of Absolutely Nothing.',
      blurb:
        'What is nothingness if nothingness is nothing? Sometimes one has to enquire as to the true meaning of this question; but other times, one must reflect introspectively to discover its true meaning.',
    },
  ],
}
