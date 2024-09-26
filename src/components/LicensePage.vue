<script setup lang="ts">
import { Buttons, Inputs } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import type { LicenseSource } from '~/composables'
import { useLicenseCode, useNotification } from '~/composables'

const props = defineProps<{
  source: LicenseSource
}>()

const { updateWithErrorNotify } = useLicenseCode(toRef(props, 'source'))

const schema = yup.object({
  license: yup.string().required().uuid('invalid license code'),
})
const { defineField, handleSubmit } = useForm({
  validationSchema: schema,
})

const [licenseCode, licenseAttrs] = defineField('email')

const { create } = useNotification()

const onActivate = handleSubmit(async () => {
  if (!licenseCode.value) {
    return
  }

  const isValid = await updateWithErrorNotify(licenseCode.value)

  if (!isValid) {
    return
  }

  create({
    title: 'Your license has been successfully activated',
  })
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      <h2 class="text-pageheading text-stone-800">Welcome to Storipress</h2>
      <p class="text-caption text-stone-600">Please input your license code below and click activate</p>
    </div>
    <div class="flex gap-2">
      <Inputs v-model="licenseCode" v-bind="licenseAttrs" html-name="license" class="w-full" />
      <Buttons color="primary" @click="onActivate">Activate</Buttons>
    </div>
  </div>
</template>
