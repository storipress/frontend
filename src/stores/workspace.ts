import { acceptHMRUpdate, defineStore } from 'pinia'
import { isUserInfoComplete } from '~/composables/tutorials'
import type { GetMeProfileQuery, ListWorkspacesQuery } from '~/graphql-operations'
import { GetMeProfileDocument, ListWorkspacesDocument } from '~/graphql-operations'
import { query } from '~/lib/apollo'
import { useAuthStore } from '~/stores/auth'

type Workspace = ListWorkspacesQuery['workspaces'][0]

function isUserNeedFillProfile(user: GetMeProfileQuery['me'], role: string): boolean {
  return role !== 'owner' && !isUserInfoComplete(user)
}

async function getUserNeedFillProfileInWorkspace(role: string) {
  try {
    // because of Apollo's cache mechanism, here only will send request once
    const { data } = await query('default', GetMeProfileDocument)
    return isUserNeedFillProfile(data.me, role)
  } catch {
    return false
  }
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: undefined as Workspace[] | undefined,
    mapIdToWorkspace: {} as Record<string, Workspace>,
    userShouldFieldProfile: {} as Record<string, boolean>,
  }),
  getters: {
    currentWorkspace(): Workspace | undefined {
      const store = useAuthStore()
      return this.mapIdToWorkspace[store.clientID]
    },
    defaultWorkspace(): Workspace | undefined {
      return this.currentWorkspace || this.workspaces?.[0]
    },
  },
  actions: {
    async fetchWorkspaces() {
      const store = useAuthStore()
      if (store.isAuth) {
        const { data } = await query('default', ListWorkspacesDocument, undefined, { fetchPolicy: 'network-only' })
        if (data) {
          this.workspaces = data.workspaces.map((item) => ({ ...item }))
          this.mapIdToWorkspace = Object.fromEntries(
            this.workspaces.map((workspace) => [workspace.id, workspace] as const),
          )
        }
      } else {
        throw new Error('Unauthenticated')
      }
    },
    async initialize() {
      await this.fetchWorkspaces()
    },
    async reInitialize() {
      this.$reset()
      await this.initialize()
    },
    async prepareForUsing(): Promise<Workspace[]> {
      if (this.workspaces === undefined) await this.initialize()
      return this.workspaces as Workspace[]
    },
    async prepareUserFillProfile() {
      const workspaces = await this.prepareForUsing()
      this.userShouldFieldProfile = Object.fromEntries(
        await Promise.all(
          workspaces.map(async ({ id, role }) => [id, await getUserNeedFillProfileInWorkspace(role)] as const),
        ),
      )
      return this.userShouldFieldProfile
    },
  },
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useWorkspaceStore, import.meta.hot))
