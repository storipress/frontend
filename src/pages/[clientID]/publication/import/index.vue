<script setup lang="ts">
import * as Yup from 'yup'
import { useForm } from 'vee-validate'
import { NOTIFICATION_KEY, Buttons as SpButton, Inputs as SpInput } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import { useCheckFeature } from '~/hooks/useRedirect'
import { Flags, featureLoaded, useFeatureFlag } from '~/lib/feature-flag'
import { CreateScraperDocument, RunScraperDocument, UpdateScraperDocument } from '~/graphql-operations'

const props = defineProps<{ clientID: string }>()

useHead({
  title: 'Storipress migrator setup',
})

const router = useRouter()

const enabledScrapeMigrator = useFeatureFlag(Flags.ScrapeMigrator)
useCheckFeature(enabledScrapeMigrator, `/${props.clientID}/`, featureLoaded)

const schema = {
  url: Yup.string().url('Url must be a valid url').required('Url is a required field'),
}
const { handleSubmit } = useForm({
  initialValues: {
    url: '',
  },
  validationSchema: schema,
})

const notifications = inject(NOTIFICATION_KEY)
const { mutate: createScraper } = useMutation(CreateScraperDocument)
const { mutate: updateScraper } = useMutation(UpdateScraperDocument)
const { mutate: runScraper } = useMutation(RunScraperDocument)
const onSubmit = handleSubmit(async ({ url }, actions) => {
  const setErrorMessage = () => actions.setFieldError('url', 'A server error occurred. Please refresh and retry.')

  const token = (await createScraper())?.data?.createScraper
  if (!token) return setErrorMessage()

  interface UpdateScraperInputData {
    url: string
  }
  const updateScraperInputData: UpdateScraperInputData = { url }
  const updateScraperInput = { token, data: JSON.stringify(updateScraperInputData) }
  const data = await updateScraper({ input: updateScraperInput })
  if (!data) return setErrorMessage()

  await runScraper({ token })
  notifications?.({
    title: 'We’re migrating your content.',
    type: 'primary',
    content: 'You’ll receive an email when we’re done!',
  })
  router.push(`/${props.clientID}/`)
})
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-stone-50">
    <router-link :to="`/${clientID}/`" class="absolute left-[3.5rem] top-[5.5rem]">
      <img :src="spLogo" alt="Storipress logo" class="h-8" />
    </router-link>
    <div class="w-[32.938rem]">
      <p class="text-display-small mb-4 text-stone-800">Enter the site which you want to copy content across</p>
      <form class="flex" @submit.prevent="onSubmit">
        <SpInput placeholder="https://..." html-type="url" html-name="url" class="mr-2 flex-auto" />
        <SpButton color="primary" html-type="submit">Start</SpButton>
      </form>
    </div>
  </div>
</template>
