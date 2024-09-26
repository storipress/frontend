import invariant from 'tiny-invariant'
import { P, match } from 'ts-pattern'
import { SurveyTarget, useCheckSurveyCompletion, useWithCurrentQuery } from '~/composables'
import type { ListWorkspacesQuery } from '~/graphql-operations'
import type { useWorkspaceStore } from '~/stores/workspace'

export interface BillingQueryLike {
  billing: {
    subscribed: boolean
    has_historical_subscriptions: boolean
  }
}

interface UseRedirectTargetInput {
  billingResult: Ref<BillingQueryLike | undefined>
  workspaceStore: ReturnType<typeof useWorkspaceStore>
  workspaces: Ref<ListWorkspacesQuery['workspaces']>
  userMeta: Ref<{ survey: unknown } | undefined>
}

export function useRedirectTargets({ billingResult, workspaces, workspaceStore, userMeta }: UseRedirectTargetInput) {
  const { withQuery } = useWithCurrentQuery()

  const baseInput = useBaseCreateWorkspaceLinkInput({ billingResult, userMeta })
  const createLinkInput: UseCreateWorkspaceLinkInput = { workspaces, workspaceStore, baseInput, withQuery }

  const { createPublicationTarget } = useCreateNewWorkspaceLink(createLinkInput)
  const { workspaceLinks } = useCreateWorkspaceLinks(createLinkInput)

  return { createPublicationTarget, workspaceLinks }
}

export interface BaseCreateWorkspaceLinkInput {
  noSubscribed: boolean
  everSubscribed: boolean
  hasSurvey: boolean
  isNewPublicationSurveyCompletion: boolean
  isInvitedSurveyCompletion: boolean
}

interface UseCreateWorkspaceLinkInput extends Pick<UseRedirectTargetInput, 'workspaceStore' | 'workspaces'> {
  baseInput: Ref<BaseCreateWorkspaceLinkInput>
  withQuery: (path: string) => string
}

export function useBaseCreateWorkspaceLinkInput({
  billingResult,
  userMeta,
}: Pick<UseRedirectTargetInput, 'billingResult' | 'userMeta'>) {
  const checkSurveyCompletion = useCheckSurveyCompletion()

  return computed((): BaseCreateWorkspaceLinkInput => {
    const subscribed = billingResult.value?.billing.subscribed
    const everSubscribed = billingResult.value?.billing.has_historical_subscriptions

    return {
      noSubscribed: !subscribed,
      everSubscribed: Boolean(everSubscribed),
      hasSurvey: Boolean(userMeta.value?.survey),
      isInvitedSurveyCompletion: checkSurveyCompletion(SurveyTarget.Invitees),
      isNewPublicationSurveyCompletion: checkSurveyCompletion(SurveyTarget.NewPublication),
    }
  })
}

export interface CreateNewWorkspaceLinkInput extends BaseCreateWorkspaceLinkInput {
  defaultPublicationId: string | undefined
}

export function useCreateNewWorkspaceLink({ workspaces, withQuery, baseInput }: UseCreateWorkspaceLinkInput) {
  const createPublicationTarget = computed(() => {
    const defaultPublicationId = workspaces.value?.find((workspace) => workspace.role === 'owner')?.id

    return withQuery(
      createNewWorkspaceLink({
        ...baseInput.value,
        defaultPublicationId,
      }),
    )
  })

  return { createPublicationTarget }
}

export function createNewWorkspaceLink(input: CreateNewWorkspaceLinkInput) {
  return match(input)
    .with(
      { isNewPublicationSurveyCompletion: false },
      () => '/auth/completion/survey?redirect=/workspaces/create-publication',
    )
    .with({ noSubscribed: false }, () => '/workspaces/create-publication')
    .with({ everSubscribed: false }, () => '/auth/completion/checkout?redirect=/workspaces/create-publication')
    .with(
      { defaultPublicationId: P.string.minLength(1) },
      ({ defaultPublicationId }) => `/${defaultPublicationId}/account/billing/plans`,
    )
    .otherwise(() => '/_/account/billing/plans')
}

export interface CreateWorkspaceLinkInput extends BaseCreateWorkspaceLinkInput {
  id: string
  role: string
  shouldFieldProfile: boolean
}

function useCreateWorkspaceLinks({ workspaceStore, workspaces, baseInput, withQuery }: UseCreateWorkspaceLinkInput) {
  workspaceStore.prepareUserFillProfile()

  function createWorkspaceLinks() {
    return workspaces.value.map((workspace): [id: string, link: string] => {
      const { id, role } = workspace
      const input: CreateWorkspaceLinkInput = {
        ...baseInput.value,
        id,
        role,
        shouldFieldProfile: workspaceStore.userShouldFieldProfile[id],
      }

      const link = role === 'owner' ? createOwnerWorkspaceLink(input) : createUserWorkspaceLink(input)

      return [id, withQuery(link)]
    })
  }

  return {
    workspaceLinks: computed(() => createWorkspaceLinks()),
  }
}

export function createOwnerWorkspaceLink(input: CreateWorkspaceLinkInput) {
  const { id, role } = input
  invariant(role === 'owner', 'createOwnerWorkspaceLink call for non-owner')

  return match(input)
    .with({ hasSurvey: false }, () => '/auth/completion/survey?redirect=/workspaces')
    .with({ noSubscribed: true, everSubscribed: true }, () => `/${id}/account/billing/plans`)
    .with({ noSubscribed: true }, () => '/auth/completion/checkout?redirect=/workspaces')
    .otherwise(() => `/${id}/articles/desks/all`)
}

export function createUserWorkspaceLink(input: CreateWorkspaceLinkInput) {
  const { id, role } = input
  invariant(role !== 'owner', 'createUserWorkspaceLink call for owner')
  return match(input)
    .with({ isInvitedSurveyCompletion: false }, () => `/auth/completion/survey?source=invitation&client=${id}`)
    .with({ shouldFieldProfile: true }, () => `/${id}/invited`)
    .otherwise(() => `/${id}/articles/desks/all`)
}
