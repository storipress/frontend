import { NOTIFICATION_KEY } from '@storipress/core-component'
import { useConfirmFunction } from '~/components/ConfirmModalProvider/useConfirmModal'
import { ImportSiteContentFromWordPressDocument } from '~/graphql-operations'

const FILE_SIZE_LIMIT = 100 * 1024 * 1024 // 100 MB

export function useUploadOtherCMS() {
  const isLoading = ref(false)
  const uploadInputRef = ref<HTMLInputElement>()
  const notifications = inject(NOTIFICATION_KEY)
  const { mutate } = useMutation(ImportSiteContentFromWordPressDocument)

  // skipcq: JS-0333
  const doneHook = createEventHook<void>()

  async function uploadOtherCMS(e: Event) {
    const $el = e.target as HTMLInputElement
    const file = $el.files?.[0] as File
    if (!file) return

    let compressedFile: File
    const fileType = await checkFileType(file)
    if (fileType === 'gzip') {
      compressedFile = file
    } else {
      compressedFile = await compressFile(file)
    }

    if (compressedFile.size > FILE_SIZE_LIMIT) {
      $el.value = ''
      onError()
      return
    }
    isLoading.value = true
    try {
      const res = await mutate({ input: { file: compressedFile } })

      if (!res?.data) throw new Error('mutate ImportSiteContentFromWordPress failed.')

      notifications?.({
        title: 'Import started',
        type: 'primary',
        content: 'Imported content will appear in 5-20 minutes',
      })

      doneHook.trigger()
    } catch (error) {
      $el.value = ''
      await onError()
    }
    isLoading.value = false
  }

  const [showErrorPopup] = useConfirmFunction([
    {
      type: 'warning',
      title: 'Invalid file',
      description:
        'An issue occurred whilst importing your WordPress file. Please use the in-app chat on the bottom right hand corner and send us your files and we will get an Engineer to assist you with your import.',
      okText: 'OK',
      cancelButtonClass: 'hidden',
    },
  ])
  async function onError() {
    await showErrorPopup()
    window.Intercom('showNewMessage', 'Hi team,\n\nI am having trouble importing my WordPress files successfully.')
  }

  return {
    onDone: doneHook.on,
    isLoading,
    uploadInputRef,
    uploadOtherCMS,
  }
}

async function compressFile(file: File) {
  const reader = new FileReader()

  await new Promise<void>((resolve, reject) => {
    reader.onload = () => resolve()
    reader.onerror = (error) => reject(error)

    reader.readAsArrayBuffer(file)
  })

  const fileContent = new Uint8Array(reader.result as ArrayBuffer)

  const compressionStream = new CompressionStream('gzip')
  const compressionWriter = compressionStream.writable.getWriter()
  compressionWriter.write(fileContent)
  compressionWriter.close()

  const compressedContent = await new Response(compressionStream.readable).arrayBuffer()

  const compressedFile = new File([compressedContent], `${file.name}.gz`, {
    type: 'application/gzip',
    lastModified: Date.now(),
  })

  return compressedFile
}

const MagicNumberData = {
  gzip: [0x1f, 0x8b],
  other: [],
}
type FileType = keyof typeof MagicNumberData
const MagicNumberMap = new Map(Object.entries(MagicNumberData) as [FileType, number[]][])

async function checkFileType(file: File): Promise<FileType> {
  const reader = new FileReader()

  await new Promise<void>((resolve, reject) => {
    reader.onload = () => resolve()
    reader.onerror = (error) => reject(error)

    reader.readAsArrayBuffer(file)
  })

  const view = new DataView(reader.result as ArrayBuffer)

  for (const [key, magicNumber] of MagicNumberMap) {
    const isMatch = magicNumber.every((val, i) => view.getUint8(i) === val)
    if (isMatch) return key
  }

  return 'other'
}
