<script lang="ts" setup>
import { useForm } from 'vee-validate'
import * as Yup from 'yup'
import { Buttons, Inputs, SelectTypeahead, Select as SpSelect, Tooltip } from '@storipress/core-component'
import { ApolloError } from '@apollo/client/core'
import type { InviteUserInput, RolesQuery } from './definition'
import type { ListDesksQuery } from '~/graphql-operations'
import {
  CreateInvitationDocument,
  GetBillingDocument,
  ListDesksDocument,
  ListInvitationsDocument,
  ListSimpleUsersDocument,
} from '~/graphql-operations'
import { usePublicationPermission } from '~/composables/permission/publication'
import { watchToDisabledAllContainedInputs } from '~/composables/permission/watch-permission'
import { useRoles } from '~/composables/roles'
import { useCheckoutDialog } from '~/hooks/useCheckoutDialog'
import { useNotification } from '~/composables'

defineOptions({
  name: 'UserInvite',
})

defineEmits<{
  focus: []
  blur: []
}>()

const { canUpdateSettingTeam } = usePublicationPermission()
const divRef = watchToDisabledAllContainedInputs(canUpdateSettingTeam)
const { roles } = useRoles()

const inviteSuccess = ref(false)
const errorData = {
  unique: 'This user is already in your team.',
  other: 'Oops... something went wrong.',
}
const errorKey = ref<keyof typeof errorData>()
const schema = {
  email: Yup.string().email('email must be a valid email').required('email is a required field'),
  role: Yup.object().nullable().required('role is a required field'),
}

const { handleSubmit, values } = useForm({
  initialValues: {
    email: null,
    role: null,
  },
  validationSchema: schema,
})
whenever(
  () => values.email,
  () => (inviteSuccess.value = false),
)

function getInitialData() {
  return {
    email: '',
    role: {} as RolesQuery,
    deskId: [],
  } as InviteUserInput
}
const input = reactive(getInitialData())
function resetInput() {
  Object.assign(input, getInitialData())
}

const { result: desksQueryResult } = useQuery(ListDesksDocument)

const rolesList = computed(() => {
  return roles.value.filter((role) => role.name !== 'owner')
})
const desks = computed(() => {
  return desksQueryResult.value?.desks ?? ([] as ListDesksQuery['desks'])
})
const { create } = useNotification()
const { mutate } = useMutation(CreateInvitationDocument)
const onSubmit = handleSubmit(async (_values, actions) => {
  const { deskId, role, ...left } = input
  const desk = deskId.map((item) => item.id)
  const checkoutDone = await checkCheckout(role.id)
  if (!checkoutDone) return

  try {
    const result = await mutate(
      {
        input: {
          ...left,
          role_id: role.id,
          desk_id: desk,
        },
      },
      { refetchQueries: [ListInvitationsDocument, ListSimpleUsersDocument] },
    )
    if (result?.data) {
      resetInput()
      actions.resetForm()
      inviteSuccess.value = true
      create({
        title: 'User invited',
        type: 'primary',
        content: 'Invitation email sent. Ask them to check their inbox!',
      })
    }
  } catch (e: unknown) {
    if (e instanceof ApolloError) {
      errorKey.value =
        (e.graphQLErrors[0]?.extensions.validation as { email: keyof typeof errorKey.value })?.email?.[0] ?? 'other'
      if (errorKey.value === 'other') {
        create({
          title: errorData[errorKey.value],
          type: 'warning',
          iconName: 'warning',
          content: 'Please reload the page to try again',
        })
      } else {
        actions.setFieldError('email', errorData[errorKey.value])
      }
    }
  }
})

const { refetch: refetchBilling, loading: loadingBilling } = useQuery(GetBillingDocument)

const { openDialog, checkPaidRole, isFreePlan } = useCheckoutDialog()
async function checkCheckout(roleId: string) {
  await until(loadingBilling).not.toBeTruthy()
  if (isFreePlan.value && checkPaidRole(roleId)) {
    const checkoutDone = await openDialog()
    if (checkoutDone) await refetchBilling()
    return checkoutDone
  }
  return true
}
</script>

<template>
  <!-- Main container for the invite form -->
  <div
    ref="divRef"
    class="layer-1 relative z-10 w-[18rem] rounded-lg bg-white px-6 pb-6 pt-4"
    :class="{ 'opacity-50 after:absolute after:left-0 after:top-0 after:size-full': !canUpdateSettingTeam }"
  >
    <!-- Header and tooltip for the invite form -->
    <div class="mb-2 flex flex-col">
      <span class="text-heading">Invite your team.</span>
      <span class="text-body mb-1 mr-4 mt-1.5 text-stone-400"
        >Earn $20 credit per Admin that joins Storipress (up to $60)</span
      >
      <Tooltip class="absolute right-[3.75rem] top-[4.15rem]">
        <div class="w-64 p-4">
          <div class="text-body text-stone-500">
            When an invited Admin joins Storipress via your invite, credits are activated and automatically applied
            every billing cycle.
          </div>
        </div>
      </Tooltip>
    </div>
    <!-- Form for inviting a user -->
    <form class="flex flex-col gap-y-2.5" @submit.prevent>
      <!-- Input field for the email of the user to invite -->
      <Inputs
        v-model="input.email"
        label="Email"
        placeholder="hello@storipress.com"
        html-type="email"
        html-name="email"
        autocomplete="email"
        :show-error="!inviteSuccess"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      <!-- Success message after a successful invite -->
      <span v-if="inviteSuccess" class="text-caption text-emerald-700">User invited</span>
      <!-- Select field for assigning desks to the user -->
      <SelectTypeahead
        v-model="input.deskId"
        :items="desks"
        option-label-prop="name"
        label="Assigned desks"
        all-option
        checkbox
        placement-left
        @focus="$emit('focus')"
        @blur="$emit('blur')"
      />
      <!-- Select field for assigning a role to the user -->
      <SpSelect
        :items="rolesList"
        option-label-prop="title"
        label="Role"
        name="role"
        @focus="$emit('focus')"
        @blur="$emit('blur')"
        @update:model-value="(value) => (input.role = value)"
      />
      <!-- Button for submitting the invite form -->
      <Buttons is-shadow class="mt-3 h-9 w-full" type="main" html-type="submit" color="primary" @click="onSubmit">
        Invite user
      </Buttons>
    </form>
  </div>
</template>
