import { expect, it } from 'vitest'
import { setActivePinia } from 'pinia'
import type { CreateNewWorkspaceLinkInput, CreateWorkspaceLinkInput } from '../use-redirect-targets'
import {
  createNewWorkspaceLink,
  createOwnerWorkspaceLink,
  createUserWorkspaceLink,
  useBaseCreateWorkspaceLinkInput,
  useRedirectTargets,
} from '../use-redirect-targets'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'
import { useWorkspaceStore } from '~/stores/workspace'
import { UserStatus } from '~/graphql-operations'

vi.mock('vue-router', () => ({
  useRoute: () => ({ query: {} }),
}))

beforeEach(() => {
  setupApolloClient()
  setActivePinia(setupTestPinia())
})

it('should redirect owner user to correct path', () => {
  const sharedInput: Pick<
    CreateWorkspaceLinkInput,
    'id' | 'isInvitedSurveyCompletion' | 'role' | 'shouldFieldProfile' | 'isNewPublicationSurveyCompletion'
  > = {
    id: 'client_id',
    isInvitedSurveyCompletion: true,
    role: 'owner',
    shouldFieldProfile: false,
    isNewPublicationSurveyCompletion: true,
  }

  expect(
    createOwnerWorkspaceLink({
      ...sharedInput,
      everSubscribed: true,
      noSubscribed: false,
      hasSurvey: true,
    }),
  ).toMatchInlineSnapshot('"/client_id/articles/desks/all"')

  expect(
    createOwnerWorkspaceLink({
      ...sharedInput,
      everSubscribed: true,
      noSubscribed: false,
      hasSurvey: false,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?redirect=/workspaces"')

  expect(
    createOwnerWorkspaceLink({
      ...sharedInput,
      everSubscribed: true,
      noSubscribed: true,
      hasSurvey: false,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?redirect=/workspaces"')

  expect(
    createOwnerWorkspaceLink({
      ...sharedInput,
      everSubscribed: true,
      noSubscribed: true,
      hasSurvey: true,
    }),
  ).toMatchInlineSnapshot('"/client_id/account/billing/plans"')

  expect(
    createOwnerWorkspaceLink({
      ...sharedInput,
      everSubscribed: false,
      noSubscribed: true,
      hasSurvey: true,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/checkout?redirect=/workspaces"')
})

it('should redirect non-owner user to correct path', () => {
  const sharedInput: Pick<
    CreateWorkspaceLinkInput,
    'id' | 'everSubscribed' | 'noSubscribed' | 'hasSurvey' | 'role' | 'isNewPublicationSurveyCompletion'
  > = {
    id: 'client_id',
    role: 'editor',
    hasSurvey: false,
    everSubscribed: false,
    noSubscribed: true,
    isNewPublicationSurveyCompletion: true,
  }

  expect(
    createUserWorkspaceLink({
      ...sharedInput,
      isInvitedSurveyCompletion: false,
      shouldFieldProfile: false,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?source=invitation&client=client_id"')

  expect(
    createUserWorkspaceLink({
      ...sharedInput,
      isInvitedSurveyCompletion: false,
      shouldFieldProfile: true,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?source=invitation&client=client_id"')

  expect(
    createUserWorkspaceLink({
      ...sharedInput,
      isInvitedSurveyCompletion: true,
      shouldFieldProfile: true,
    }),
  ).toMatchInlineSnapshot('"/client_id/invited"')

  expect(
    createUserWorkspaceLink({
      ...sharedInput,
      isInvitedSurveyCompletion: true,
      shouldFieldProfile: false,
    }),
  ).toMatchInlineSnapshot('"/client_id/articles/desks/all"')
})

it('should redirect user to correct new publication path', () => {
  const sharedInput: Pick<CreateNewWorkspaceLinkInput, 'hasSurvey' | 'isInvitedSurveyCompletion'> = {
    hasSurvey: false,
    isInvitedSurveyCompletion: true,
  }
  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: false,
      noSubscribed: true,
      everSubscribed: false,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?redirect=/workspaces/create-publication"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: true,
      noSubscribed: true,
      everSubscribed: false,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/checkout?redirect=/workspaces/create-publication"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: false,
      noSubscribed: true,
      everSubscribed: true,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/auth/completion/survey?redirect=/workspaces/create-publication"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: true,
      noSubscribed: true,
      everSubscribed: true,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/_/account/billing/plans"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: true,
      noSubscribed: true,
      everSubscribed: true,
      defaultPublicationId: 'client_id',
    }),
  ).toMatchInlineSnapshot('"/client_id/account/billing/plans"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: true,
      noSubscribed: false,
      everSubscribed: false,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/workspaces/create-publication"')

  expect(
    createNewWorkspaceLink({
      ...sharedInput,
      isNewPublicationSurveyCompletion: true,
      noSubscribed: false,
      everSubscribed: true,
      defaultPublicationId: undefined,
    }),
  ).toMatchInlineSnapshot('"/workspaces/create-publication"')
})

it('should return base input', () => {
  expect(
    useBaseCreateWorkspaceLinkInput({
      billingResult: ref({ billing: { subscribed: true, has_historical_subscriptions: false } }),
      userMeta: ref({ survey: true }),
    }).value,
  ).toMatchInlineSnapshot(`
    {
      "everSubscribed": false,
      "hasSurvey": true,
      "isInvitedSurveyCompletion": false,
      "isNewPublicationSurveyCompletion": false,
      "noSubscribed": false,
    }
  `)

  expect(
    useBaseCreateWorkspaceLinkInput({
      billingResult: ref({ billing: { subscribed: false, has_historical_subscriptions: true } }),
      userMeta: ref({ survey: false }),
    }).value,
  ).toMatchInlineSnapshot(`
    {
      "everSubscribed": true,
      "hasSurvey": false,
      "isInvitedSurveyCompletion": false,
      "isNewPublicationSurveyCompletion": false,
      "noSubscribed": true,
    }
  `)

  expect(
    useBaseCreateWorkspaceLinkInput({
      billingResult: ref({ billing: { subscribed: false, has_historical_subscriptions: false } }),
      userMeta: ref({ survey: true }),
    }).value,
  ).toMatchInlineSnapshot(`
    {
      "everSubscribed": false,
      "hasSurvey": true,
      "isInvitedSurveyCompletion": false,
      "isNewPublicationSurveyCompletion": false,
      "noSubscribed": true,
    }
  `)
})

it('should return redirect target', () => {
  const workspaceStore = useWorkspaceStore()
  const res = useRedirectTargets({
    workspaceStore,
    workspaces: ref([
      {
        id: 'client_id_owner',
        name: 'workspace',
        workspace: 'workspace',
        customer_site_domain: 'example.com',
        role: 'owner',
        status: UserStatus.Active,
      },
      {
        id: 'client_id_editor',
        name: 'workspace',
        workspace: 'workspace',
        customer_site_domain: 'example.com',
        role: 'editor',
        status: UserStatus.Active,
      },
    ]),
    billingResult: ref({
      billing: {
        subscribed: true,
        has_historical_subscriptions: true,
      },
    }),
    userMeta: ref({ survey: true }),
  })

  expect(workspaceStore.prepareUserFillProfile).toBeCalled()
  expect(res.createPublicationTarget.value).toMatchInlineSnapshot(
    `"/auth/completion/survey?redirect=%2Fworkspaces%2Fcreate-publication"`,
  )
  expect(res.workspaceLinks.value).toMatchInlineSnapshot(`
    [
      [
        "client_id_owner",
        "/client_id_owner/articles/desks/all",
      ],
      [
        "client_id_editor",
        "/auth/completion/survey?source=invitation&client=client_id_editor",
      ],
    ]
  `)
})
