import type { Ref, SetupContext, VNode } from 'vue'
import slugify from '@sindresorhus/slugify'
import type { SubscriberEventsDataType } from '../definition'
import { dayjs } from '~/lib/dayjs'
import type {
  SubscriberEventArticleFragment,
  SubscriberEventDeskFragment,
  SubscriberEventEmailFragment,
  SubscriberEventPageFragment,
  SubscriberEventQuery,
  SubscriberEventUserFragment,
} from '~/graphql-operations'
import { GetSiteDocument, SubscriberEventDocument } from '~/graphql-operations'
import { filterHTMLTag } from '~/utils'

export type Events = NonNullable<SubscriberEventQuery['subscriber']>['events']
export type EventData = NonNullable<Events>['data'][number]

export default function (id: string) {
  const { result: siteResult } = useQuery(GetSiteDocument)

  const { result, loading, refetch } = useQuery(SubscriberEventDocument, { id })
  const events = computed(() => result.value?.subscriber?.events)

  const publicationUrl = computed(() =>
    siteResult.value?.site?.customer_site_domain ? `//${siteResult.value.site.customer_site_domain}` : '',
  )

  const renderEventFunction = renderEventTemplate(publicationUrl)
  const handleEventData = ({ id, name, data, occurred_at, target }: EventData) => {
    data = JSON.parse(data)
    const renderFunction = renderEventFunction[name] ?? renderEventFunction.default
    const element = renderFunction({ date: occurred_at, data, target })
    // @ts-expect-error patch virtual dom
    element.id = id
    return element
  }

  const eventsContent = computed(() => result.value?.subscriber?.events?.data.map(handleEventData) ?? [])

  return {
    events,
    loading,
    eventsContent,
    turnPages(page: number) {
      return refetch({ id, page })
    },
  }
}

export function EventItem(props: { date: string }, { slots }: SetupContext) {
  return (
    <div class="text-body flex gap-3 border-t px-4 py-3">
      <div class="w-2/5 text-stone-400">{dayjs(props.date).format('MMM DD')}</div>
      <div class="flex-1 pl-4 text-stone-700">{slots.default?.()}</div>
    </div>
  )
}
export function EventLink(props: { to: string }, { slots }: SetupContext) {
  return (
    <a href={props.to ?? '/'} target="_blank" class="text-body mx-1 underline">
      {slots.default?.()}
    </a>
  )
}

type RenderFunction = (event: {
  date: string
  data?: SubscriberEventsDataType[keyof SubscriberEventsDataType]
  target?: EventData['target']
}) => VNode
export function renderEventTemplate(publicationUrl: Ref<string>): Record<string, RenderFunction> {
  return {
    'email.received': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { subject, target: article } = target as SubscriberEventEmailFragment

      if (!article) return <EventItem date={date}>Received email {subject}</EventItem>
      return (
        <EventItem date={date}>
          Received email
          <EventLink to={`${publicationUrl.value}/posts/${article.slug}`}>{filterHTMLTag(article.title)}</EventLink>
        </EventItem>
      )
    },
    'email.bounced': ({ date, data, target }) => {
      if (!date || !data || !target) return <div class="hidden" />

      const { description } = data as SubscriberEventsDataType['email.bounced']
      const { subject, target: article } = target as SubscriberEventEmailFragment

      if (!article)
        return (
          <EventItem date={date}>
            {subject} {description}
          </EventItem>
        )
      return (
        <EventItem date={date}>
          Email
          <EventLink to={`${publicationUrl.value}/posts/${article.slug}`}>{filterHTMLTag(article.title)}</EventLink>
          bounced
        </EventItem>
      )
    },
    'email.opened': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { subject, target: article } = target as SubscriberEventEmailFragment

      if (!article) return <EventItem date={date}>Opened {subject}</EventItem>
      return (
        <EventItem date={date}>
          Opened
          <EventLink to={`${publicationUrl.value}/posts/${article.slug}`}>{filterHTMLTag(article.title)}</EventLink>
        </EventItem>
      )
    },
    'email.link_clicked': ({ date, data, target }) => {
      if (!date || !data || !target) return <div class="hidden" />

      const { link } = data as SubscriberEventsDataType['email.link_clicked']
      const { subject, target: article } = target as SubscriberEventEmailFragment

      if (!article)
        return (
          <EventItem date={date}>
            Clicked
            <EventLink to={link}>link</EventLink>
            in {subject}
          </EventItem>
        )
      return (
        <EventItem date={date}>
          Clicked
          <EventLink to={link}>link</EventLink>
          in
          <EventLink to={`${publicationUrl.value}/posts/${article.slug}`}>{filterHTMLTag(article.title)}</EventLink>
        </EventItem>
      )
    },
    'auth.signed_up': ({ date }) => {
      return <EventItem date={date}>Free Signup</EventItem>
    },
    'auth.signed_in': ({ date }) => {
      return <EventItem date={date}>Sign in</EventItem>
    },
    'auth.signed_out': ({ date }) => {
      return <EventItem date={date}>Signed out</EventItem>
    },
    'subscription.subscribed': ({ date }) => {
      return <EventItem date={date}>Start a new subscription</EventItem>
    },
    'subscription.invoice_paid': ({ date }) => {
      return <EventItem date={date}>New invoice was paid</EventItem>
    },
    'subscription.canceled': ({ date }) => {
      return <EventItem date={date}>Cancel existing subscription</EventItem>
    },
    'article.seen': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { slug, title } = target as SubscriberEventArticleFragment
      return (
        <EventItem date={date}>
          Visited article
          <EventLink to={`${publicationUrl.value}/posts/${slug}`}>{filterHTMLTag(title)}</EventLink>
        </EventItem>
      )
    },
    'article.shared': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { slug, title } = target as SubscriberEventArticleFragment
      return (
        <EventItem date={date}>
          Shared article
          <EventLink to={`${publicationUrl.value}/posts/${slug}`}>{filterHTMLTag(title)}</EventLink>
        </EventItem>
      )
    },
    'article.link.clicked': ({ date, data, target }) => {
      if (!date || !data || !target) return <div class="hidden" />

      const { link } = data as SubscriberEventsDataType['article.link.clicked']
      const { slug, title } = target as SubscriberEventArticleFragment
      return (
        <EventItem date={date}>
          Clicked
          <EventLink to={link || '#'}>link</EventLink>
          in
          <EventLink to={`${publicationUrl.value}/posts/${slug}`}>{filterHTMLTag(title)}</EventLink>
          on visit
        </EventItem>
      )
    },
    'page.seen': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { title, seo } = target as SubscriberEventPageFragment
      const slug = JSON.parse(seo)?.slug ?? slugify(title)
      return (
        <EventItem date={date}>
          Visited
          <EventLink to={`${publicationUrl.value}/${slug}`}>{filterHTMLTag(title)}</EventLink>
        </EventItem>
      )
    },
    'desk.seen': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { name, slug } = target as SubscriberEventDeskFragment
      return (
        <EventItem date={date}>
          Visited
          <EventLink to={`${publicationUrl.value}/${slug}`}>{name}</EventLink>
        </EventItem>
      )
    },
    'author.seen': ({ date, target }) => {
      if (!date || !target) return <div class="hidden" />

      const { full_name } = target as SubscriberEventUserFragment
      const slug = slugify(full_name ?? '')
      return (
        <EventItem date={date}>
          Visited
          <EventLink to={`${publicationUrl.value}/authors/${slug}`}>{full_name}</EventLink>
        </EventItem>
      )
    },
    'home.seen': ({ date }) => {
      return <EventItem date={date}>Visited your frontpage</EventItem>
    },
    'article.commented': ({ date }) => {
      return <EventItem date={date}>Comment on an article</EventItem>
    },
    'article.hyperlink.clicked': ({ date, data, target }) => {
      if (!date || !data || !target) return <div class="hidden" />

      const { href } = data as SubscriberEventsDataType['article.hyperlink.clicked']
      const { title } = target as SubscriberEventArticleFragment
      return (
        <EventItem date={date}>
          Clicked
          <EventLink to={href || '#'}>link</EventLink>
          in "{filterHTMLTag(title)}" on visit
        </EventItem>
      )
    },
    'article.read': ({ date, target, data }) => {
      if (!data || !target) return <div class="hidden" />
      const { title } = target as SubscriberEventArticleFragment
      const { percentage } = data as SubscriberEventsDataType['article.read']
      return (
        <EventItem date={date}>
          Read on an article "{filterHTMLTag(title)}" to {percentage}%
        </EventItem>
      )
    },
    'article.viewed': ({ date, target }) => {
      if (!target) return <div class="hidden" />
      const { title } = target as SubscriberEventArticleFragment
      return <EventItem date={date}>Open article page "{filterHTMLTag(title)}"</EventItem>
    },
    'article.text.copied': ({ date, data, target }) => {
      if (!data || !target) return <div class="hidden" />
      const { title } = target as SubscriberEventArticleFragment
      const { text_copy: text } = data as SubscriberEventsDataType['article.text.copied']
      return (
        <EventItem date={date}>
          Reader copy text "{text}" in "{filterHTMLTag(title)}"
        </EventItem>
      )
    },
    'article.text.selected': ({ date, data, target }) => {
      if (!data || !target) return <div class="hidden" />
      const { title } = target as SubscriberEventArticleFragment
      const { text_selection: text } = data as SubscriberEventsDataType['article.text.selected']
      return (
        <EventItem date={date}>
          Reader select text "{text}" in "{filterHTMLTag(title)}"
        </EventItem>
      )
    },
    'page.viewed': ({ date, data }) => {
      if (!data) return <div class="hidden" />

      const { pathname } = data as SubscriberEventsDataType['page.viewed']

      return (
        <EventItem date={date}>
          Visited page <EventLink to={`${publicationUrl.value}${pathname}`}>{pathname}</EventLink>
        </EventItem>
      )
    },
    'subscriber.signed_in': ({ date }) => {
      return <EventItem date={date}>Subscriber sign in</EventItem>
    },
    'paywall.activated': ({ date }) => {
      return <EventItem date={date}>Paywall activated</EventItem>
    },
    'paywall.canceled': ({ date }) => {
      return <EventItem date={date}>Paywall dismiss</EventItem>
    },
    default: () => {
      return <div class="hidden" />
    },
  }
}
