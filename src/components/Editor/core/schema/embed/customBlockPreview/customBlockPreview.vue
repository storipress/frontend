<script lang="ts" setup>
import { logicAnd, logicNot } from '@vueuse/math'
import { debounce, identity, sortBy } from 'lodash-es'
import { useRouteParams } from '@vueuse/router'
import { Icon } from '@storipress/core-component'
import { hash } from 'ohash'
import { useContentBlock } from './use-content-block'
import { useProvideCustomFieldFromMeta } from './meta-to-preview'
import type { CustomModule } from './load-module'
import { loadModule } from './load-module'
import { useRender } from './render-component'
import MissingWarning from './missing-warning.vue'
import { useLayouts } from '~/pages/[clientID]/articles/[id]/edit/utils'
import type { RepeatCustomFieldValue } from '~/components/CustomField/definition'
import CustomField from '~/components/CustomField/CustomField.vue'
import { useCustomFields, useHasUserActivity, useTogglePopup } from '~/composables'
import OpenTransition from '~/components/Transitions/open-transition.vue'

const props = withDefaults(
  defineProps<{
    blockName: string
    uuid: string
    nowSubmit: any
  }>(),
  {
    blockName: '',
    uuid: '',
    nowSubmit: undefined,
  },
)
const emit = defineEmits<{
  (event: 'update', html: string): void
  (event: 'updateNowSubmit', submit: any): void
  (event: 'delete'): void
}>()

const { isLoading, getCustomBlock } = useLayouts()
const exportModule = shallowRef<CustomModule>({ exports: undefined } as unknown as CustomModule)
const articleID = useRouteParams('id', '' as string)
const { reference, popup, open, togglePopup } = useTogglePopup({
  options: {
    placement: 'right',
    modifiers: [{ name: 'offset', options: { offset: [4, 0] } }],
  },
})

const root = ref<HTMLElement>()
const hasUserActivity = useHasUserActivity(root)
const { refetch, version, fields, values, blocksMap, blocksMapField, fieldIds, hasBlockMap } = useContentBlock(
  props.blockName,
  props.uuid,
  // Safety: there should have value before editor load
  articleID.value,
)
const {
  meta,
  isEdited,
  editedValues,
  repeatValue,
  handleSubmit,
  createCustomFieldValue,
  editCustomFieldValue,
  createCustomFieldValueMutate,
  updateCustomFieldValueMutate,
} = useCustomFields(fields, values)

const state = useProvideCustomFieldFromMeta(meta)

const customBlock = getCustomBlock(toRef(props, 'blockName'))
const serverModule = shallowRef(null as CustomModule | null)

const { render } = useRender(serverModule)

watch(customBlock, async (blockInfo) => {
  if (!blockInfo) {
    return
  }

  const { clientBlock, serverBlock } = blockInfo
  exportModule.value = await loadModule(clientBlock.url)
  serverModule.value = await loadModule(serverBlock.url)
})

async function submit() {
  if (!hasUserActivity.value) {
    return
  }

  const { ids } = await createCustomFieldValue(articleID.value)
  await editCustomFieldValue()
  const newFieldIds = [...ids, ...meta.value.map(({ id }) => id).filter((id): id is string => Boolean(id))]
  fieldIds.value = sortBy<string>(newFieldIds, identity)
  await refetch()
  await updateBlockMap(fieldIds.getMap())
  version.value = hash(state)
  emit('update', await render(state))
}
submit()
const beHandledSubmit = handleSubmit(submit)

function onRepeatValue(val: RepeatCustomFieldValue, index: number) {
  repeatValue(val, index)
  submit()
}

async function updateBlockMap(map: Record<string, string[]>) {
  if (!hasBlockMap.value) {
    await createCustomFieldValueMutate({
      input: {
        id: blocksMapField.value.id,
        target_id: articleID.value,
        value: JSON.stringify(map),
      },
    })
  } else {
    await updateCustomFieldValueMutate({
      input: {
        id: blocksMap.value.id as string,
        value: JSON.stringify(map),
      },
    })
  }
}

async function updateValue() {
  if (!isEdited.value) {
    return
  }
  await beHandledSubmit()
}

// when it's preview mode, trigger update
whenever(logicAnd(exportModule, logicNot(open)), updateValue)

const debounceCall = debounce(async () => {
  if (!props.nowSubmit) {
    emit(
      'updateNowSubmit',
      updateValue().then(() => {
        debounceCall.cancel()
        emit('updateNowSubmit', undefined)
      }),
    )
  } else {
    debounceCall.cancel()
  }
}, 500)

function deleteBlock() {
  debounceCall.cancel()
  emit('delete')
}

onBeforeUnmount(() => {
  debounceCall.cancel()
})

watch(state, debounceCall, { deep: true })
</script>

<template>
  <div ref="root" class="mb-4 rounded-lg border border-black border-opacity-5 shadow-1-layer">
    <div class="flex items-center justify-between bg-gray-100 px-2">
      <div class="flex items-center pt-2">
        <MissingWarning v-if="!isLoading && !exportModule.exports" class="pl-2 pt-1" />
        <div class="text-heading pl-2.5 text-stone-800 text-opacity-75">{{ blockName }}</div>
      </div>
      <button class="size-9 rounded-full p-2 transition-colors duration-75 hover:bg-gray-200" @click="deleteBlock">
        <Icon icon-name="delete" class="text-stone-500 text-opacity-75" />
      </button>
    </div>
    <template v-if="!exportModule.exports">
      <CustomField
        class="bg-gray-100 p-4 opacity-75"
        :meta="meta"
        :edited-values="editedValues"
        @repeat-value="onRepeatValue"
      />
    </template>
    <template v-else>
      <div ref="reference" class="relative cursor-pointer" @click="togglePopup">
        <component :is="exportModule.exports" />
        <div class="absolute inset-0 size-full"></div>
      </div>
      <div ref="popup">
        <OpenTransition>
          <CustomField
            v-show="open"
            class="layer-2 w-[30rem] rounded-lg bg-gray-100 p-4 opacity-75"
            :meta="meta"
            :edited-values="editedValues"
            @repeat-value="onRepeatValue"
          />
        </OpenTransition>
      </div>
    </template>
  </div>
</template>
