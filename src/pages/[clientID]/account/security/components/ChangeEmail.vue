<script setup lang="ts">
import { Alert, Buttons, Icon, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import { logicNot } from '@vueuse/math'
import * as Yup from 'yup'
import type { SubmissionContext } from 'vee-validate'
import { ApolloError } from '@apollo/client/core'
import { BasicDialog, FormView } from '~/components/Integrations'
import { useMe } from '~/composables/permission/account'
import { ChangeAccountEmailDocument, ResendConfirmEmailDocument } from '~/graphql-operations'

useHead({
  title: 'Storipress account profile',
})

const me = useMe()
const isReady = computed(() => me.value !== undefined)

const { onDone: onDoneChangeAccountEmail, mutate: mutateChangeAccountEmail } = useMutation(ChangeAccountEmailDocument)

interface UserEmailChangeForm {
  newEmail: string
  password: string
}
interface ErrorValidation {
  email: [keyof typeof errorMessage]
}

function initForm() {
  return {
    newEmail: '',
    password: '',
  }
}
const errorMessage = {
  unique: 'The email address has already been allocated to another user',
}
const errorValidation = ref<keyof typeof errorMessage>()

const form = reactive<UserEmailChangeForm>(initForm())
const visible = ref(false)

const notifications = inject(NOTIFICATION_KEY)

whenever(logicNot(visible), () => Object.assign(form, initForm()))

onDoneChangeAccountEmail(() => {
  visible.value = false
  notifications?.({
    title: 'Your email has been successfully changed',
    type: 'primary',
  })
  Object.assign(form, initForm())
})
async function onChangeEmail(_values: Record<string, unknown>, ctx: SubmissionContext) {
  if (form.newEmail === me.value?.email) {
    ctx.setFieldError('email', 'You cannot change email to the email you currently use')
    return
  }

  try {
    await mutateChangeAccountEmail({
      input: {
        email: form.newEmail,
        password: form.password,
      },
    })
  } catch (e: unknown) {
    if (e instanceof ApolloError) {
      errorValidation.value = (e.graphQLErrors[0].extensions.validation as ErrorValidation)?.email?.[0]
      errorValidation.value
        ? ctx.setFieldError('email', errorMessage[errorValidation.value])
        : ctx.setFieldError('currentPassword', 'Password is incorrect')
    }
  }
}
const schema = Yup.object().shape({
  email: Yup.string().email().required().label('Email'),
  currentPassword: Yup.string().required().min(8).label('Password'),
})

const { mutate: resendConfirmEmail } = useMutation(ResendConfirmEmailDocument)
async function onResendVerification() {
  await resendConfirmEmail()
  notifications?.({
    title: 'Email verification resent',
    type: 'primary',
    content: 'Check your inbox!',
  })
}
</script>

<template>
  <SectionContent sub-title="Email">
    <div class="flex flex-col">
      <Alert v-if="isReady && !me?.verified" message="Verify your email address." type="warning" class="mb-4">
        <template #description>
          <div class="text-body text-stone-800">
            You need to verify your email before you can create a publication. Check your inbox or
            <div role="button" class="contents" @click="onResendVerification">
              <u>resend verification email</u>
              <i class="icon-goto-url ml-1 text-xs" />
            </div>
          </div>
        </template>
      </Alert>

      <div class="layer-1 h-fit w-[34rem] rounded-lg bg-white p-5">
        <div class="text-body mb-5 text-stone-800">
          <div class="mb-1">Email</div>
          <div class="text-stone-500">{{ me?.email }}</div>
        </div>
        <Buttons is-shadow is-border type="main" @click="visible = true">Change email</Buttons>
      </div>
    </div>
  </SectionContent>

  <BasicDialog
    v-model="visible"
    integration-name="Change your email"
    info="This email is used for all communications and your login"
  >
    <template #icon>
      <Icon icon-name="email" class="mr-4 text-[2.75rem] text-stone-600" />
    </template>
    <FormView :validation-schema="schema">
      <div class="border-b border-stone-200 p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">1. Enter a new email address</div>
          <Inputs
            v-model="form.newEmail"
            input-id="new-email"
            label="New email"
            placeholder="hello@storipress.com"
            class="w-full"
            html-name="email"
            autocomplete="email"
          />
        </div>
      </div>

      <div class="p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">2. Enter your password</div>
          <Inputs
            v-model="form.password"
            input-id="password"
            label="Password"
            class="w-full"
            html-type="password"
            html-name="currentPassword"
            autocomplete="current-password"
          />
        </div>
      </div>

      <template #formFooter="{ handleSubmit }">
        <Buttons type="main" color="primary" aria-label="submit" @click="handleSubmit($event, onChangeEmail)">
          Change email
        </Buttons>
      </template>
    </FormView>
  </BasicDialog>
</template>

<style scoped></style>
