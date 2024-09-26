<script setup lang="ts">
import { Buttons, Icon, Inputs, NOTIFICATION_KEY } from '@storipress/core-component'
import { logicNot } from '@vueuse/math'
import * as Yup from 'yup'
import type { SubmissionContext } from 'vee-validate'
import { BasicDialog, FormView } from '~/components/Integrations'
import { ChangeAccountPasswordDocument } from '~/graphql-operations'

useHead({
  title: 'Storipress account profile',
})

const { mutate: mutateChangeAccountPassword } = useMutation(ChangeAccountPasswordDocument)

interface UserPasswordChangeForm {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

function initForm() {
  return {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  }
}

const form = reactive<UserPasswordChangeForm>(initForm())
const visible = ref(false)

const notifications = inject(NOTIFICATION_KEY)

whenever(logicNot(visible), () => Object.assign(form, initForm()))

async function onChangePassword(_values: Record<string, unknown>, ctx: SubmissionContext) {
  const result = await mutateChangeAccountPassword({
    input: {
      current: form.currentPassword,
      future: form.newPassword,
      confirm: form.newPasswordConfirm,
    },
  })

  if (result?.data?.changeAccountPassword) {
    visible.value = false
    notifications?.({
      title: 'Your password has been successfully changed',
      type: 'primary',
    })
    Object.assign(form, initForm())
  } else {
    ctx.setFieldError('currentPassword', 'Password is incorrect')
  }
}

const schema = Yup.object().shape({
  currentPassword: Yup.string().required().min(8).label('Current password'),
  newPassword: Yup.string().required().min(8).label('New password'),
  confirmNewPassword: Yup.string()
    .required()
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
    .label('Confirm new password'),
})
</script>

<template>
  <SectionContent sub-title="Password">
    <template #content>
      <div class="text-body mb-5 text-stone-800">You last changed your password x days ago</div>
      <Buttons is-shadow is-border type="main" @click="visible = true">Change password</Buttons>
    </template>
  </SectionContent>

  <BasicDialog
    v-model="visible"
    integration-name="Change password"
    info="Change the password used to login to Storipress"
  >
    <template #icon>
      <Icon icon-name="lock-filled" class="mr-4 text-[2.75rem] text-stone-600" />
    </template>
    <FormView :validation-schema="schema">
      <div class="border-b border-stone-200 p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">1. Enter your current password</div>
          <Inputs
            v-model="form.currentPassword"
            input-id="current-password"
            label="Current password"
            class="w-full"
            html-type="password"
            html-name="currentPassword"
            autocomplete="current-password"
          />
        </div>
      </div>

      <div class="p-5">
        <div class="w-full">
          <div class="text-subheading mb-4">2. Enter your new password</div>
          <Inputs
            v-model="form.newPassword"
            input-id="new-password"
            label="New password"
            class="mb-4 w-full"
            html-type="password"
            html-name="newPassword"
            autocomplete="new-password"
          />
          <Inputs
            v-model="form.newPasswordConfirm"
            input-id="confirm-current-password"
            label="Confirm new password"
            class="w-full"
            html-type="password"
            html-name="confirmNewPassword"
            autocomplete="new-password"
          />
        </div>
      </div>

      <template #formFooter="{ handleSubmit }">
        <Buttons type="main" color="primary" aria-label="submit" @click="handleSubmit($event, onChangePassword)">
          Change password
        </Buttons>
      </template>
    </FormView>
  </BasicDialog>
</template>

<style scoped></style>
