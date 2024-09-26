<script setup lang="ts">
import { Buttons, Icon } from '@storipress/core-component'
import type { GetMeEmailQuery } from '~/graphql-operations'
import { ConfirmEmailDocument, GetMeEmailDocument } from '~/graphql-operations'
import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'

const route = useRoute()
const router = useRouter()
const store = useAuthStore()
const workspaceStore = useWorkspaceStore()
const { email, expire_on, signature } = route.query
const expired = Number(expire_on)
const verifiedFail = ref(false)

const { mutate } = useMutation(ConfirmEmailDocument)
async function confirmEmail() {
  try {
    const result = await mutate(
      {
        input: {
          email,
          expire_on: expired,
          signature: signature as string,
        },
      },
      {
        refetchQueries: [GetMeEmailDocument],
        awaitRefetchQueries: true,
        update(cache, { data }) {
          if (!data || !data.confirmEmail) {
            return
          }
          cache.updateQuery({ query: GetMeEmailDocument }, (query): GetMeEmailQuery | void => {
            if (!query || !query.me) {
              return
            }

            const { me } = query
            return {
              __typename: 'Query',
              me: {
                __typename: 'User',
                ...me,
                verified: true,
              },
            }
          })
        },
      },
    )
    if (result?.data?.confirmEmail) {
      workspaceStore.workspaces?.length
        ? router.replace('/workspaces')
        : router.replace('/workspaces/create-first-publication')
    } else {
      verifiedFail.value = true
    }
  } catch (e) {
    verifiedFail.value = true
  }
}

if (store.isAuth) confirmEmail()
</script>

<template>
  <div v-if="verifiedFail" class="flex h-full items-center">
    <div class="m-auto flex w-fit flex-col items-center">
      <Icon icon-name="circle-cancel" class="mb-8 text-5xl text-red-700" />
      <div class="text-display-medium mb-2 text-stone-800">Error</div>
      <div class="text-body text-stone-500">Your email address could not be verified.</div>

      <Buttons type="main" color="primary" class="mt-4">
        <a href="https://storipress.com">Return to home</a>
      </Buttons>
    </div>
  </div>
</template>

<style scoped></style>
