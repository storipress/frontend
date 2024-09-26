<script lang="ts" setup>
import vueFilePond from 'vue-filepond'
import type { ProgressServerConfigFunction } from 'filepond'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import { Icon, Buttons as SpButton, Checkbox as SpCheckbox } from '@storipress/core-component'
import * as Sentry from '@sentry/vue'
import type { IMembersSetupState } from '../definition'
import { SetupStep, SymbolMembersSetupState } from '../definition'
import { ImportSubscribersFromCsvFileDocument } from '~/graphql-operations'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { useNotification } from '~/composables'

const emit = defineEmits<(event: 'updateStep', step: SetupStep) => void>()

const state = inject<IMembersSetupState>(SymbolMembersSetupState) as IMembersSetupState

function goBack() {
  return emit('updateStep', state.offerPaidSubscriptions ? SetupStep.Stripe : SetupStep.Default)
}

const FilePond = vueFilePond(FilePondPluginFileValidateType)

const label = /* html */ `
  <div>
    <div class="text-button layer-1 mx-auto w-max rounded bg-emerald-700 p-4 text-center text-white">
      Select CSV file
    </div>
    <p class="text-caption mt-2 text-center text-stone-500">Or drag and drop here</p>
  </div>
`

const { mutate: mutateImport, loading: importing } = useMutation(ImportSubscribersFromCsvFileDocument)

const pondRef = ref()
const myFile = ref('')
const termsChecked = ref(false)

function onAddFile(error: any, { filename }: any) {
  if (error) return (myFile.value = '')
  myFile.value = filename
}

const [showErrorPopup] = useConfirmFunction([
  {
    type: 'warning',
    title: 'Invalid CSV file',
    description: 'Uploaded CSV invalid — missing email field.',
    // okText: 'OK',
    okButtonClass: 'hidden',
    cancelButtonClass: 'hidden',
  },
])

const { create: notifications } = useNotification()
const serverOption = {
  fetch: null,
  revert: null,
  process: (
    fieldName: string,
    file: File,
    metadata: Record<string, any>,
    load: (p: string | Record<string, any>) => void,
    error: (errorText: string) => void,
    progress: ProgressServerConfigFunction,
    abort: () => void,
  ) => {
    // reference document: https://pqina.nl/filepond/docs/api/server/#process-1

    Array.from({ length: 9 }, (n, i) => i + 1).forEach(async (n) => {
      const nextTick = () => new Promise((resolve) => setTimeout(resolve, 10))
      await nextTick()
      progress(true, n, 10)
    })
    mutateImport({ file })
      .then(() => {
        notifications({
          title: 'Subscribers uploaded.',
          type: 'primary',
          iconName: 'refresh',
          content: 'Subscribers upload in progress. This may up to an hour.',
        })
        return load('Upload complete')
      })
      .catch((e) => {
        abort()
        error(e)
        showErrorPopup()
      })

    // Should expose an abort method so the request can be cancelled
    return {
      abort: () => {
        // Let FilePond know the request has been cancelled
        abort()
      },
    }
  },
}

async function onImport() {
  const { processFile } = pondRef.value
  try {
    await processFile(0)
    setTimeout(() => emit('updateStep', SetupStep.Confirmation), 1000)
  } catch (error) {
    Sentry.captureException(error)
  }
}
</script>

<template>
  <div class="flex w-96 flex-col">
    <p class="text-heading mb-1.5 mt-4 text-stone-800">Bring your list from Substack, Mailchimp and more</p>
    <p class="text-body mb-6 text-stone-500">
      Begin by first downloading and adding your subscribers to
      <a
        href="https://drive.google.com/file/d/1HjL9j_4REG5PYvDvfRnmUhs6FS6KFZPa/view?usp=sharing"
        target="blank"
        class="text-sky-700"
        rel="noopener noreferrer prefetch"
        >Storipress' member import .csv file</a
      >.
    </p>
    <FilePond
      ref="pondRef"
      class="h-52 overflow-hidden border-2 border-dashed border-gray-300 bg-black/0"
      name="test"
      accepted-file-types="text/csv"
      credits=""
      label-button-process-item="test"
      :label-idle="label"
      :allow-process="false"
      :server="serverOption"
      :instant-upload="false"
      @addfile="onAddFile"
      @removefile="myFile = ''"
    />
    <p class="text-body mt-4 text-stone-500">
      Members added to Storipress will get emails of articles marked for newsletters and can access members-only web
      content.
    </p>
    <p class="text-body mt-4 italic text-stone-500">
      By importing your list, you confirm all contacts have opted in for communication from you. Sending spam will
      result in the automated instant closure of your account.
    </p>
    <form v-if="myFile" class="mt-6 flex items-center" @submit.prevent>
      <SpCheckbox id="flexCheckDefault" v-model="termsChecked" class="mb-1 mr-4" />
      <label class="text-caption block" for="flexCheckDefault">
        Everyone on this list has opted in to get email from me
      </label>
    </form>
    <div class="flex-1" />
    <div class="flex gap-2">
      <SpButton is-shadow is-border class="h-11 w-20" @click="goBack">
        <icon icon-name="arrow_left" class="text-stone-400" />
      </SpButton>
      <SpButton
        v-if="myFile"
        is-shadow
        default="Button"
        type="main"
        color="primary"
        class="h-11 flex-1"
        :disabled="!termsChecked || importing"
        @click="onImport"
      >
        Import
        <icon icon-name="arrow_right" icon-right />
      </SpButton>
      <SpButton
        v-else
        is-shadow
        default="Button"
        type="main"
        color="primary"
        class="h-11 flex-1 bg-stone-800 text-white hover:bg-stone-900"
        @click="emit('updateStep', SetupStep.Confirmation)"
      >
        Skip
        <icon icon-name="arrow_right" icon-right />
      </SpButton>
    </div>
  </div>
</template>

<style src="filepond/dist/filepond.min.css"></style>

<style lang="postcss" scoped>
:deep(.filepond--action-process-item) {
  display: none;
}
:deep(.filepond--drop-label) {
  @apply h-52 bg-black/0;
}
</style>
