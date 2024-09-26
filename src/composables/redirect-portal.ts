import { $URL } from 'ufo'
import type { LocationQueryRaw } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { query as apolloQuery } from '~/lib/apollo'
import { ListPublicationsDocument, ListWorkspacesDocument } from '~/graphql-operations'
import { checkClientIDFormat } from '~/utils'

export enum RedirectTarget {
  Integration = 'integration',
  Migration = 'migration',
  Onboarding = 'onboarding',
  ChoosePublication = 'choose-publication',
  Import = 'import',
  Scheduler = 'scheduler',
  Members = 'members',
  Team = 'team',
  Domains = 'domains',
  Manage = 'manage',
  CreateNewArticle = 'create-new-article',
}

const targets: Record<RedirectTarget, (clientID: string) => string> = {
  [RedirectTarget.Integration]: (clientID: string) => `/${clientID}/preferences/publication/integrations`,
  [RedirectTarget.Migration]: (clientID: string) => `/${clientID}/articles/desks/all?migrate=true`,
  [RedirectTarget.Onboarding]: (clientID: string) => `/${clientID}/onboarding/migrate`,
  [RedirectTarget.ChoosePublication]: (_clientID: string) => '/workspaces',
  [RedirectTarget.Import]: (clientID: string) => `/${clientID}/publication/import`,
  [RedirectTarget.Scheduler]: (clientID: string) => `/${clientID}/scheduler`,
  [RedirectTarget.Members]: (clientID: string) => `/${clientID}/members`,
  [RedirectTarget.Team]: (clientID: string) => `/${clientID}/preferences/publication/team`,
  [RedirectTarget.Domains]: (clientID: string) => `/${clientID}/preferences/publication/domains`,
  [RedirectTarget.Manage]: (clientID: string) => `/${clientID}/articles/desks/all`,
  [RedirectTarget.CreateNewArticle]: (clientID: string) => `/${clientID}/articles/desks/all?createNewArticle=true`,
}

function isRedirectTarget(s: string): s is RedirectTarget {
  return s in targets
}

export function useRedirectPortal() {
  const router = useRouter()

  const authStore = useAuthStore()

  return async (query: LocationQueryRaw, source = 'redirect') => {
    if (typeof query.client_id !== 'string') {
      router.push({
        path: '/workspaces',
        query: {
          ...query,
          sp_from: source,
        },
      })
    } else if (typeof query.to === 'string' && typeof query.client_id === 'string' && isRedirectTarget(query.to)) {
      const { data } = await apolloQuery('default', ListWorkspacesDocument)
      // In setup wordpress, user may need to redirect to a workspace when user is only an admin
      const publicationsIdSet = new Set(data?.workspaces?.map((item) => item.id) || [])
      const { to: _to, client_id: _client_id, ...restQuery } = query

      if (!publicationsIdSet.has(_client_id) && checkClientIDFormat(_client_id)) {
        router.push({
          path: '/workspaces',
          query: {
            ...query,
            sp_from: source,
          },
        })
        return
      }

      // prefill the client id to let API work
      if (_client_id !== 'null') {
        authStore.clientID = _client_id
      }

      const url = new $URL(targets[_to](_client_id))
      const queryParams = Object.fromEntries(url.searchParams.entries())

      router.push({
        path: url.pathname,
        query: {
          ...restQuery,
          ...queryParams,
          ...(queryParams.migrate ? {} : { sp_from: source }),
        },
      })
    } else if (query.to === RedirectTarget.Import) {
      const { data } = await apolloQuery('default', ListPublicationsDocument)

      const clientID: string = data?.publications?.[0]?.id ?? ''
      if (!clientID) {
        router.push('/workspaces')
        return
      }

      const { to: _to, client_id: _client_id, ...restQuery } = query
      const url = new $URL(targets[RedirectTarget.Import](clientID))
      const queryParams = Object.fromEntries(url.searchParams.entries())

      router.push({
        path: url.pathname,
        query: {
          ...restQuery,
          ...Object.fromEntries(url.searchParams.entries()),
          ...(queryParams.migrate ? {} : { sp_from: source }),
        },
      })
    } else {
      router.push('/workspaces')
    }
  }
}
