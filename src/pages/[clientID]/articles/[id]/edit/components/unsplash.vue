<script lang="ts" setup>
import { UnsplashPicker } from '~/components/Editor/unsplash-picker'
import type { UnsplashClient } from '~/utils/editor/clients/unsplash'
import {
  UnsplashDownloadPhotoDocument,
  UnsplashListPhotosDocument,
  UnsplashSearchPhotosDocument,
} from '~/graphql-operations'
import { useApolloClient } from '~/lib/apollo'

const { client } = useApolloClient()
const unsplashClient: UnsplashClient = {
  async listPhotos(page = 1) {
    const { data } = await client.query({ query: UnsplashListPhotosDocument, variables: { page } })
    return JSON.parse(data.unsplashList)
  },
  async searchPhotos(query, page = 1) {
    const { data } = await client.query({
      query: UnsplashSearchPhotosDocument,
      variables: { input: { keyword: query, page } },
    })
    return JSON.parse(data.unsplashSearch)
  },
  async downloadPhoto(id) {
    await client.query({
      query: UnsplashDownloadPhotoDocument,
      variables: { id },
    })
  },
}
</script>

<template>
  <UnsplashPicker :client="unsplashClient" />
</template>
