<script setup lang="ts">
import type { PropType } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Buttons, Icon, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { array as yupArray, object as yupObject, string as yupString } from 'yup'
import * as Sentry from '@sentry/vue'
import { RolesTitleMap, useRoles } from '~/composables/roles'
import {
  CreateInvitationDocument,
  GetScraperPendingInviteUsersDocument,
  ListInvitationsDocument,
  ListSimpleUsersDocument,
} from '~/graphql-operations'
import type { ListDesksQuery } from '~/graphql-operations'

const props = defineProps({
  modelValue: {
    type: Boolean,
  },
  desks: {
    type: Array as PropType<ListDesksQuery['desks']>,
    default: () => [],
  },
  clientId: {
    type: String,
    required: true,
  },
  scraperToken: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<(event: 'update:modelValue', value: boolean) => void>()

interface Authors {
  name: string
  email: string
}

const isOpen = useVModel(props, 'modelValue', emit)
const { roles } = useRoles()
const router = useRouter()
const notifications = inject(NOTIFICATION_KEY)
const { result: usersList } = useQuery(ListSimpleUsersDocument)
const { result: invitationsList } = useQuery(ListInvitationsDocument)
const { result: scraperPendingInviteUsers } = useQuery(GetScraperPendingInviteUsersDocument, {
  token: props.scraperToken,
})
const { mutate, loading } = useMutation(CreateInvitationDocument)

const authorsList = ref<Authors[]>([])
const defaultRole = computed(() => roles.value.find((role) => role.title === RolesTitleMap.author))
const defaultDesks = computed(() => props.desks.map((desk) => desk.id))
const existingEmails = computed(() => {
  const users = usersList.value?.users.map((user) => user.email) ?? []
  const invitations = invitationsList.value?.invitations.map((invitation) => invitation.email) ?? []

  return new Set([...users, ...invitations])
})

watch(scraperPendingInviteUsers, (result) => {
  if (result?.scraperPendingInviteUsers) {
    const users = result.scraperPendingInviteUsers
    authorsList.value = users.map((user) => {
      return {
        name: user,
        email: '',
      }
    })
  }
})

function closeModal() {
  if (loading.value) return
  isOpen.value = false
  router.replace(`/${props.clientId}/articles/desks/all`)
}

const schema = yupObject().shape({
  email: yupArray().of(
    yupString()
      .email()
      .label('This')
      .test('existed', 'This user is already in your team', (value) => !existingEmails.value.has(value)),
  ),
})

const { handleSubmit } = useForm({
  validationSchema: schema,
})
const onInviteUsers = handleSubmit(async () => {
  // if user does not fill in any email and submit, close the dialog directly
  const findInvitedEmail = authorsList.value.some((author) => author.email)
  if (!findInvitedEmail) {
    closeModal()
    return
  }

  try {
    await Promise.all(
      authorsList.value
        .filter((author) => author.email)
        .map((author) => {
          return mutate({
            input: {
              email: author.email,
              role_id: defaultRole.value!.id,
              desk_id: defaultDesks.value,
            },
          })
        }),
    )
    // close dialog and show notification after inviting user
    closeModal()
    notifications?.({
      title: 'User invited',
      type: 'primary',
      content: 'Invitation email sent. Ask them to check their inbox!',
    })
  } catch (error) {
    Sentry.captureException(error)
  }
})
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-40" @close="closeModal">
      <!-- backdrop -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-stone-800 bg-opacity-75" />
      </TransitionChild>
      <!-- dialog -->
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="layer-2 relative flex h-[37.725rem] w-[50rem] transform overflow-hidden rounded-lg align-middle transition-all"
            >
              <!-- close dialog button -->
              <div role="button" class="fixed right-4 top-3" @click="closeModal">
                <Icon icon-name="cross_thin" class="text-[0.75rem] text-stone-400 hover:text-stone-600" />
              </div>
              <!-- left background -->
              <div class="flex-1 bg-[url('@assets/mesh-gradient.png')] bg-cover bg-center bg-no-repeat p-8">
                <DialogTitle as="h3" class="text-display-x-large mb-4 text-white">
                  Invite the rest of your team
                </DialogTitle>
                <span class="text-heading text-stone-200">
                  We’ve finished your migration — Storipress is better with your squad.
                </span>
              </div>
              <!-- right form -->
              <form class="flex flex-1 flex-col overflow-scroll bg-white p-8" @submit="onInviteUsers">
                <fieldset class="flex-auto">
                  <legend class="text-display-small mb-4 text-stone-900">
                    Provide their email and these users will be added as Authors.
                  </legend>
                  <Inputs
                    v-for="(author, key) in authorsList"
                    :key="key"
                    v-model="author.email"
                    :input-id="`new-author-${key}`"
                    :label="author.name"
                    placeholder="hello@storipress.com"
                    class="mb-3 w-full"
                    :html-name="`email[${key}]`"
                    autocomplete="email"
                  />
                </fieldset>
                <!-- submit button -->
                <Buttons
                  is-shadow
                  is-border
                  color="primary"
                  :is-loading="loading"
                  html-type="submit"
                  class="mt-11 w-full font-normal"
                >
                  Invite users to your publication
                </Buttons>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
