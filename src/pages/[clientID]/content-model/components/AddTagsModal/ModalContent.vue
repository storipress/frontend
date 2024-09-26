<script lang="ts" setup>
import pRetry from 'p-retry'
import type { SubmissionHandler } from 'vee-validate'
import { Form } from 'vee-validate'
import * as Yup from 'yup'
import { Icon, Inputs, Buttons as SpButton } from '@storipress/core-component'
import {
  CreateTagDocument,
  CustomFieldGroupsDocument,
  GetTagsDocument,
  SyncGroupableToCustomFieldGroupDocument,
} from '~/graphql-operations'

const props = withDefaults(defineProps<{ open?: boolean; groupId: string }>(), {
  open: false,
})

const emit = defineEmits<(event: 'close') => void>()

const { result: tagsResult } = useQuery(GetTagsDocument)

const alreadyHaveTags = reactive<string[]>([])
const newTags = reactive<string[]>([])
const tagsSet = computed(() => {
  const tagList = tagsResult.value?.tags.map(({ name }) => name) ?? []
  return new Set([...tagList, ...newTags])
})

const schema = {
  tag: Yup.string().test('check-tag-unused', 'This tag has already been created', (tag) => {
    const tags = new Set([...alreadyHaveTags, ...newTags])
    return !tags.has((tag ?? '').trim())
  }),
}

const addTag: SubmissionHandler = ({ tag }, { setFieldValue }) => {
  if (!tag) return
  const tagName = (tag as string).trim()
  tagsSet.value.has(tagName) ? alreadyHaveTags.push(tagName) : newTags.push(tagName)
  setFieldValue('tag', '')
}

const { mutate: mutateCreateTag } = useMutation(CreateTagDocument)
const { mutate: mutateSyncGroup } = useMutation(SyncGroupableToCustomFieldGroupDocument)
const { refetch } = useQuery(CustomFieldGroupsDocument)
async function createTag() {
  const alreadyHaveTagsId = alreadyHaveTags
    .map((tagName) => {
      return tagsResult.value?.tags.find(({ name }) => tagName === name)?.id
    })
    .filter(Boolean) as string[]

  const createTagPromises = newTags.map((name) => pRetry(() => mutateCreateTag({ name }), { retries: 3 }))

  const createTagResult = await Promise.all(createTagPromises)
  const targetIds = [
    ...alreadyHaveTagsId,
    ...(createTagResult.map((tag) => tag?.data?.createTag.id).filter(Boolean) as string[]),
  ]
  await mutateSyncGroup({ input: { id: props.groupId, target_ids: targetIds, detaching: false } })

  await refetch()
  emit('close')
}

function deleteTag(index: number) {
  const target = alreadyHaveTags.length > index ? alreadyHaveTags : newTags
  const targetIndex = target === alreadyHaveTags ? index : index - alreadyHaveTags.length
  target.splice(targetIndex, 1)
}
</script>

<template>
  <div class="w-[32rem] rounded-lg border border-gray-100 bg-white p-6 shadow-2-layer">
    <div class="mx-auto flex size-[3.125rem] items-center justify-center rounded-full bg-emerald-600/25">
      <Icon icon-name="tag" class="text-2xl text-emerald-600" />
    </div>
    <h3 class="my-3 text-center text-xl font-semibold leading-6 text-stone-800">Create tags in group</h3>
    <Form class="flex items-start" :validation-schema="schema" @submit="addTag">
      <Inputs
        class="flex-1"
        label="Enter the name of a tag and press enter"
        placeholder="Enter a tag and press enter …"
        html-type="text"
        html-name="tag"
      >
        <template #default="{ errorMessage }">
          <div class="text-caption text-red-700">
            {{ errorMessage }}
          </div>
        </template>
      </Inputs>
      <SpButton is-shadow is-border class="mx-2 mt-6" html-type="submit">Add tag</SpButton>
    </Form>
    <div class="mt-2 flex flex-wrap items-center gap-1">
      <p
        v-for="(tag, i) of [...alreadyHaveTags, ...newTags]"
        :key="tag"
        class="text-caption flex items-center justify-between rounded bg-[#d8d8d8]/25 px-[.375rem] py-[.125rem]"
      >
        {{ tag }}
        <Icon
          icon-name="cross_thin"
          class="ml-[.285rem] block text-xs leading-3 text-stone-400"
          @click="deleteTag(i)"
        />
      </p>
    </div>
    <div class="mt-7 flex gap-3">
      <SpButton class="flex-1" is-shadow is-border @click="emit('close')">Cancel</SpButton>
      <SpButton
        class="flex-1"
        :disabled="[...alreadyHaveTags, ...newTags].length === 0"
        is-shadow
        is-border
        color="primary"
        @click="createTag"
      >
        Create tag(s)
      </SpButton>
    </div>
  </div>
</template>
