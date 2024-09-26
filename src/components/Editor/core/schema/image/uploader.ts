import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { UploadImageInput } from '~/composables'
import { useUploadImage } from '~/composables'

interface ResumableUpload<T> {
  file: Blob
  uploadPromise: Promise<Awaited<T>>
}

export const useUploaderStore = defineStore('imageUploader', () => {
  const uploadImage = useUploadImage()
  const resumeStore = new Map<string, ResumableUpload<ReturnType<typeof uploadImage>>>()

  return {
    resumeStore,
    resume(id: string) {
      return resumeStore.get(id)
    },
    upload(input: UploadImageInput) {
      const resumeId = nanoid()
      const promise = uploadImage(input)
      resumeStore.set(resumeId, {
        file: input.file,
        uploadPromise: promise,
      })

      promise.finally(() => {
        setTimeout(() => {
          // delay remove to prevent possible edge case
          // like image need resume exactly when it just finished uploading
          resumeStore.delete(resumeId)
        }, 300)
      })

      return {
        resumeId,
        promise,
      }
    },
  }
})
