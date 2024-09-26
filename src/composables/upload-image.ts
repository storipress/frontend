import SparkMD5 from 'spark-md5'
import { Base64 } from 'js-base64'
import ky from 'ky'
import invariant from 'tiny-invariant'
import { captureException } from '@sentry/vue'
import { useMutation } from '~/lib/apollo'

import type { RequestPresignedUploadUrlMutation, UploadImage } from '~/graphql-operations'
import { RequestPresignedUploadUrlDocument, UploadImageDocumentDocument } from '~/graphql-operations'
import { isInvalidImage } from '~/utils/file'
import { useRemoteDialog } from '~/modules/editor/remote-dialog/composite'

export interface UploadImageInput {
  id: string
  file: Blob
  type: UploadImage
}

export function useUploadImageWithState(notification?: () => Promise<void> | void) {
  const uploadImage = useUploadImage(notification)
  const { execute, isLoading, isReady } = useAsyncState(
    uploadImage,
    {
      url: '',
      width: 0,
      height: 0,
    },
    {
      immediate: false,
      resetOnExecute: false,
    },
  )

  return {
    isReady,
    isLoading,
    uploadImage: (input: UploadImageInput): Promise<{ url: string; width: number; height: number; key?: string }> =>
      execute(0, input),
  }
}

export function useUploadImage(notification?: () => Promise<void> | void) {
  const { open } = useRemoteDialog('error-notification')
  async function defaultNotification() {
    await open({ type: 'imageUpload' })
  }
  const notify = notification ?? defaultNotification

  const { mutate: requestPresignedUploadURL } = useMutation(RequestPresignedUploadUrlDocument)
  const { mutate: uploadImage } = useMutation(UploadImageDocumentDocument)

  return async ({ id, file, type }: UploadImageInput) => {
    if (await isInvalidImage(file)) {
      await notify()
      return { url: '', width: 0, height: 0 }
    }

    const hash = await toMD5(file)
    const md5 = Base64.btoa(hash)

    let presignedUrlData: RequestPresignedUploadUrlMutation['requestPresignedUploadURL']
    try {
      const presignedURLResponse = await requestPresignedUploadURL({ md5 })
      invariant(presignedURLResponse?.data, 'cannot create presigned url')
      const presignedUploadURL = presignedURLResponse.data.requestPresignedUploadURL
      const { key, signature, url: uploadURL } = presignedUploadURL
      presignedUrlData = presignedUploadURL

      await ky.put(uploadURL, {
        body: file,
        headers: {
          'Content-Type': file.type,
          'Content-MD5': md5,
        },
        timeout: false,
      })

      const res = await uploadImage({
        input: {
          key,
          signature,
          target_id: id,
          type,
        },
      })
      invariant(res?.data, 'cannot upload image')
      const { url, width, height, key: imageKey } = res.data.uploadImage
      // preload image to prevent user from seeing a loading status
      await preloadImage(url)
      return { url, width, height, key: imageKey }
    } catch (error) {
      captureException(new Error('Image upload error', { cause: error as Error }), (scope) => {
        scope.setContext('upload-data', { ...presignedUrlData, md5 })
        return scope
      })
      await notify()
      return { url: '', width: 0, height: 0, key: '' }
    }
  }
}

export function toMD5(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const spark = new SparkMD5()
      spark.appendBinary(reader.result as string)
      resolve(spark.end(true))
    }
    reader.readAsBinaryString(file)
  })
}

function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = reject
    image.src = src
  })
}
