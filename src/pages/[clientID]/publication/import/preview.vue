<script setup lang="ts">
import pRetry from 'p-retry'
import { LoadingSpinner, Buttons as SpButton } from '@storipress/core-component'
import spLogo from '@storipress/core-component/assets/images/icons/settings/sp-logo-white.svg'
import {
  CreateScraperDocument,
  CreateScraperSelectorDocument,
  DeleteScraperArticleDocument,
  RunScraperDocument,
  ScraperDocument,
  ScraperState,
  UpdateScraperDocument,
} from '~/graphql-operations'

const props = defineProps<{ clientID: string }>()

useHead({
  title: 'Storipress migrator confirmation',
})

const router = useRouter()

const urlParams = new URLSearchParams(window.location.search)
const token = urlParams.get('token') ?? ''
if (!token) router.replace(`/${props.clientID}`)

const previewPath = `/${props.clientID}/publication/preview?token=${token}`

const { result: scraperResult } = useQuery(ScraperDocument, { token })
const { mutate: deleteArticle } = useMutation(DeleteScraperArticleDocument)
const { mutate: updateScraper } = useMutation(UpdateScraperDocument)
async function backToExtension() {
  await updateScraper({ input: { token, state: ScraperState.Initialized } })
  const { url } = JSON.parse(scraperResult.value?.scraper?.data ?? '{}') as { url: string }

  const deleteArticlePromises = scraperResult.value?.scraper?.articles?.data?.map(({ id }) =>
    pRetry(() => deleteArticle({ token, id }), { retries: 3 }),
  )
  if (deleteArticlePromises) {
    await Promise.all(deleteArticlePromises)
  }

  const urlSymbol = /\?/.test(url) ? '&' : '?'
  window.open(`${url}${urlSymbol}sp-token=${token}`)
  router.replace(`/${props.clientID}/`)
}

const isDone = ref(false)
const { mutate: createScraper } = useMutation(CreateScraperDocument)
const { mutate: createSelector } = useMutation(CreateScraperSelectorDocument)
const { mutate: runScraper } = useMutation(RunScraperDocument)
whenever(isDone, async () => {
  const newToken = (await createScraper())?.data?.createScraper
  if (!newToken) return (isDone.value = false)

  const updateScraperInput = { token: newToken, data: scraperResult.value?.scraper?.data }
  const updateScraperResult = await updateScraper({ input: updateScraperInput })
  if (!updateScraperResult?.data) return (isDone.value = false)

  const createSelectorPromises = scraperResult.value?.scraper?.selectors?.map(({ type, value, data }) =>
    pRetry(() => createSelector({ input: { token: newToken, type, value, data } }), { retries: 3 }),
  )
  if (!createSelectorPromises) return
  await Promise.all(createSelectorPromises)

  await runScraper({ token: newToken })

  setTimeout(() => router.replace(`/${props.clientID}/`), 7_000)
})
</script>

<template>
  <div class="flex h-screen bg-stone-50">
    <div class="px-14 py-[5.5rem]">
      <router-link :to="`/${clientID}/`" class="block">
        <img :src="spLogo" alt="Storipress logo" class="h-8" />
      </router-link>
      <h2 class="text-display-large mt-[5.125rem] w-[28.5rem] font-medium text-stone-800">Does everything look ok?</h2>
      <p class="text-body mb-8 mt-[0.938rem] text-stone-500">
        <span class="font-bold">Have a scroll of your new publication 👉</span>
        <br />
        If you need to make some changes, click the button below:
      </p>
      <div class="flex gap-4">
        <SpButton class="bg-stone-200 hover:bg-stone-300" @click="backToExtension"
          >I need to make some changes</SpButton
        >
        <SpButton color="primary" @click="isDone = true">I’m good to go</SpButton>
      </div>
    </div>
    <div class="flex-1 shadow-2-layer">
      <iframe :src="previewPath" frameborder="0" height="100%" width="100%" class="overflow-x-hidden" />
    </div>
  </div>

  <Transition
    mode="out-in"
    enter-active-class="transition duration-1000 ease-out"
    enter-from-class="transform translate-y-3/4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-500 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    appear
  >
    <div
      v-if="isDone"
      class="z-99999 fixed inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-xl backdrop-filter"
    >
      <LoadingSpinner :show="true" />

      <p class="text-display-x-large my-8 text-stone-800">
        We’re migrating the rest of your content.
        <br />
        You’ll receive an email when we’re done!
      </p>

      <p class="m-0 h-10 text-center text-stone-500">
        This page will automatically
        <br />
        redirect you to Storipress
      </p>
    </div>
  </Transition>
</template>
