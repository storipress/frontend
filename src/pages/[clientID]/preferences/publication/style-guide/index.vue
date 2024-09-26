<script setup lang="ts">
import { Icon, LoadingSpinner, NavbarSave } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import { array as yupArray, object as yupObject, string as yupString } from 'yup'
import { reactive } from 'vue'
import StyleGuideForm from './components/StyleGuideForm.vue'
import type { StyleGuideRule } from './definition'
import StyleGuide from '~/components/StyleGuide/StyleGuide.vue'
import { OpenTransition } from '~/components/Transitions'
import {
  CreateLinterDocument,
  DeleteLinterDocument,
  ListLintersDocument,
  UpdateLinterDocument,
} from '~/graphql-operations'
import type { CreateLinterInput, UpdateLinterInput } from '~/graphql-operations'
import { useCheckFeature } from '~/hooks/useRedirect'
import { Flags, featureLoaded, useFeatureFlag } from '~/lib/feature-flag'
import { useUserSubscription } from '~/composables'

const props = defineProps<{
  publicationName: string
  clientID: string
}>()

const { isPlusPlan, ready } = useUserSubscription()
const enableAILinter = useFeatureFlag(Flags.AiLinter)

useCheckFeature(
  computed(() => enableAILinter.value && isPlusPlan.value),
  `/${props.clientID}/preferences/publication/details`,
  computed(() => featureLoaded.value && ready.value),
)

sendTrack('ai_linter_setting_view')

const isChanged = ref(false)

const linters = reactive<{ edges: StyleGuideRule[] }>({ edges: [] })

const rules = {
  errorTitle: '',
  instructions: '',
  showPreview: false,
}

const { result, refetch, loading } = useQuery(ListLintersDocument)

watch(
  () => result.value?.linters.edges,
  () => {
    linters.edges = getRawLinters()
  },
)

const isDefaultRule = computedEager(() => linters.edges.length === 1)

const schema = yupObject().shape({
  styleGuide: yupArray().of(
    yupObject().shape({
      errorTitle: yupString().required().max(200).label('This'),
      instructions: yupString().required().max(200).label('This'),
    }),
  ),
})

const createList = ref<Map<string, Omit<CreateLinterInput, 'description'>>>(new Map([]))
const updateList = ref<Map<string, Omit<UpdateLinterInput, 'description'>>>(new Map([]))
const deleteList = ref<Set<string>>(new Set())

const { mutate: createLinterMutation } = useMutation(CreateLinterDocument)
const { mutate: updateLinterMutation } = useMutation(UpdateLinterDocument)
const { mutate: deleteLinterMutation } = useMutation(DeleteLinterDocument)

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
})

const onSave = handleSubmit(async () => {
  const newLintersPromise = []
  const editLintersPromise = []
  const deleteLintersPromise = []

  createList.value.size &&
    newLintersPromise.push(
      Array.from(createList.value.values()).map((input) =>
        createLinterMutation({
          input: {
            // We have removed description field
            description: '',
            ...input,
          },
        }),
      ),
    )

  updateList.value.size &&
    editLintersPromise.push(Array.from(updateList.value.values()).map((input) => updateLinterMutation({ input })))

  deleteList.value.size &&
    deleteLintersPromise.push(Array.from(deleteList.value).map((id) => deleteLinterMutation({ id })))

  await Promise.all([...newLintersPromise, ...editLintersPromise, ...deleteLintersPromise])
  await refetch()

  sendTrack('ai_linter_setting_updated')

  initList()

  isChanged.value = false
})

function onAddRule() {
  linters.edges.push(Object.assign({}, { ...rules, key: Date.now().toString(36) }))
  isChanged.value = true
}

function onDiscard() {
  linters.edges = getRawLinters()
  initList()
  isChanged.value = false
}

function onDelete(index: number, rule: StyleGuideRule) {
  linters.edges.splice(index, 1)
  if (rule.id) {
    if (updateList.value.get(rule.id)) {
      updateList.value.delete(rule.id)
    }
    deleteList.value.add(rule.id)
  } else if (rule.key) {
    createList.value.delete(rule.key)
  }
  isChanged.value = true
}

function initList() {
  createList.value.clear()
  updateList.value.clear()
  deleteList.value.clear()
}

function getRawLinters() {
  if (!result.value?.linters.edges.length) {
    return [Object.assign({}, { ...rules, key: Date.now().toString(36) })]
  }
  return result.value.linters.edges.map(({ node: { id, title, prompt } }) => {
    return {
      id,
      errorTitle: title,
      instructions: prompt,
      showPreview: false,
    }
  })
}
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out origin-top"
    enter-from-class="transform scale-y-95 opacity-0"
    enter-to-class="transform scale-y-100 opacity-100"
    leave-active-class="transition duration-75 ease-in origin-top"
    leave-from-class="transform scale-y-100 opacity-100"
    leave-to-class="transform scale-y-95 opacity-0"
  >
    <NavbarSave class="fixed left-0" :show="isChanged" @on-discard="onDiscard" @on-save="onSave" />
  </transition>

  <Section title="Your Style Guide" class="w-full">
    <div v-if="loading" class="flex h-1/2 items-center justify-center">
      <LoadingSpinner show spin-width="w-8" />
    </div>

    <SectionContent
      v-else
      :sub-title="`${publicationName}’s Style Guide`"
      content="Have Storipress' A.I. enforce style rules in the editor, such as preventing confidential name usage and maintaining tone consistency."
    >
      <div class="w-[34rem]">
        <div v-for="(rule, index) in linters.edges" :key="index" class="relative">
          <StyleGuideForm
            v-model="linters.edges[index]"
            :index="index"
            :hide-dropdown="isDefaultRule && !rule.id"
            class="mb-4"
            :errors="errors"
            @change-rule="isChanged = true"
            @update-rule="updateList.set($event.input.id, $event.input)"
            @create-rule="createList.set($event.key, $event.input)"
            @delete-rule="onDelete(index, rule)"
            @show-preview="rule.showPreview = true"
            @hide-preview="rule.showPreview = false"
          />
          <!-- preview -->
          <OpenTransition>
            <div
              v-if="rule.showPreview"
              class="absolute left-[-18.5rem] top-1/2 max-h-48 w-[19rem] -translate-y-1/2 overflow-hidden rounded-2xl px-2 pb-2 pt-11 shadow-3-layer before:fixed before:left-0 before:top-0 before:-z-10 before:size-full before:bg-white before:bg-[url('@assets/style-guide-preview-bg.svg')] before:bg-cover before:bg-no-repeat"
            >
              <StyleGuide
                :error-title="rule.errorTitle"
                :error-description="rule.instructions"
                class="max-h-36 overflow-scroll"
              />
            </div>
          </OpenTransition>
        </div>

        <button class="mx-4 mt-6 flex items-center" @click="onAddRule">
          <Icon icon-name="plus_circle" class="mr-2 text-emerald-700" />
          <span class="text-caption text-emerald-700">Add another rule</span>
        </button>
      </div>
    </SectionContent>
  </Section>
</template>
