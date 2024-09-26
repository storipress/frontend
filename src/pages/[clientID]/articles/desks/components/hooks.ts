import { ref } from 'vue'
import type { Client } from 'typesense'
import Typesense from 'typesense'
import type { Promisable } from 'type-fest'
import { useQuery } from '~/lib/apollo'
import type { GetArticleSearchKeyQuery } from '~/graphql-operations'
import { GetArticleSearchKeyDocument } from '~/graphql-operations'
import { env } from '~/env'

export function useDeskSettingSlideOverControl(
  events: {
    onShow?: (event: any) => void
    onClose?: (event: any) => void
    onSubmit: (event: any) => Promisable<void>
    onDelete?: (event: any) => Promisable<void>
  },
  options: {
    keepSlideOverAfterSubmit: boolean
  } = {
    keepSlideOverAfterSubmit: false,
  },
) {
  const args = reactive({ show: false, loading: false })
  return {
    args,
    open: (event: any) => {
      args.show = true
      events.onShow && events.onShow(event)
    },
    close: (event: any) => {
      args.show = false
      events.onClose && events.onClose(event)
    },
    submit: async (event: any) => {
      args.loading = true
      if (events.onSubmit) {
        await events.onSubmit(event)
      }
      Object.assign(args, { show: options.keepSlideOverAfterSubmit, loading: false })
    },
    delete: async (event: any) => {
      args.loading = true
      if (events.onDelete) {
        await events.onDelete(event)
      }
      Object.assign(args, { show: false, loading: false })
    },
  }
}

export function useTypesenseClient() {
  const { result: resultOfSearchKey } = useQuery<GetArticleSearchKeyQuery>(GetArticleSearchKeyDocument, undefined, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only',
  })
  const searchClient = ref<Client>()
  watch(resultOfSearchKey, () => {
    searchClient.value = new Typesense.Client({
      nodes: [
        {
          host: env.VITE_TYPESENSE_DOMAIN,
          port: 443,
          protocol: 'https',
        },
      ],
      apiKey: resultOfSearchKey.value?.articleSearchKey || '',
      connectionTimeoutSeconds: 5,
    })
  })
  return searchClient
}
