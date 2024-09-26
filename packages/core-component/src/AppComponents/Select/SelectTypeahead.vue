<script lang="ts">
import type { ComponentPublicInstance, PropType } from 'vue'
import { computed, defineComponent, ref, toRefs, watch } from 'vue'
import SimpleTypeahead from 'vue3-simple-typeahead'
import { useVModel, whenever } from '@vueuse/core'
import Icon from '../Icon/index.vue'
import Checkbox from '../Checkbox/index.vue'
import type { TypeaheadData } from './definition'
import { waitForAddTagId } from './setting'

const PLACEHOLDER_TAG = Symbol('placeholder')

export default defineComponent({
  name: 'SpSelectTypeahead',
  components: {
    SimpleTypeahead,
    Icon,
    Checkbox,
  },
  props: {
    type: {
      type: String,
      default: 'line',
      validator: (value: string) => {
        return ['line', 'input', 'inputTag'].includes(value)
      },
    },
    label: {
      type: String,
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    optionLabelProp: {
      type: String,
    },
    modelValue: {
      type: Array as PropType<(TypeaheadData | string)[]>,
      default: () => [],
      required: true,
    },
    defaultValue: {
      type: Array as PropType<(TypeaheadData | string)[]>,
      default: () => [],
    },
    inputValue: {
      type: String,
      default: '',
    },
    noMatchMessage: {
      type: String,
      default: 'No match found',
    },
    allOption: {
      type: Boolean,
      default: false,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    placementLeft: {
      type: Boolean,
      default: false,
    },
    uniqueKey: {
      type: String,
    },
    additionalFilters: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'update:inputValue', 'addTag', 'removeTag', 'createTag', 'blur', 'focus'],
  setup(props, { emit }) {
    const AllKey = Symbol('All')

    const { modelValue } = toRefs(props)
    const inputValue = useVModel(props, 'inputValue', emit, {
      passive: true,
      defaultValue: '',
    })
    const oldInputValue = ref('')
    const showHint = ref(false)
    const blockDelete = ref(false)

    const selectedItems = ref(new Map())
    const childInputValue = ref<
      ComponentPublicInstance<{
        input: string
        filteredItems: TypeaheadData[]
      }>
    >()

    const matchedResult = computed(() => {
      const initialChar = inputValue.value[0].toUpperCase()

      return props.items.filter((val: any) => {
        const result = props.optionLabelProp ? val[props.optionLabelProp] : val

        const additionalFilters = props.additionalFilters && val[props.additionalFilters]

        const libraryCharSet = new Set([result?.[0].toUpperCase(), additionalFilters?.[0].toUpperCase()])

        return libraryCharSet.has(initialChar)
      })
    })
    const hintItem = computed(() => {
      return showHint.value && props.type === 'inputTag'
        ? [
            {
              [PLACEHOLDER_TAG]: true,
              id: waitForAddTagId,
              name: `Add new tag '${inputValue.value}'`,
            },
          ]
        : []
    })
    const data = computed(() => {
      if (inputValue.value) {
        return [...matchedResult.value, ...hintItem.value]
      } else {
        return props.allOption ? [AllKey, ...props.items] : props.items
      }
    })
    const optionLabel = computed(() => (item: any) => {
      return props.optionLabelProp ? item[props.optionLabelProp] : item
    })
    const isSelectedAll = computed(() => {
      return (
        Boolean(props.items.length) &&
        props.items.every((item: any) => {
          const mapKey = getUniqueKey(item)
          return selectedItems.value.has(mapKey)
        })
      )
    })

    function onSelect(item: any) {
      modelValue.value = []

      const mapKey = getUniqueKey(item)
      if (item === AllKey) {
        if (!isSelectedAll.value) {
          props.items.forEach((item: any) => {
            const mapKey = getUniqueKey(item)
            selectedItems.value.set(mapKey, item)
          })
        } else {
          selectedItems.value.clear()
        }
      } else if (selectedItems.value.has(mapKey)) {
        selectedItems.value.delete(mapKey)
        emit('removeTag', item)
      } else {
        if (item.id === waitForAddTagId) {
          onInputTag()
        } else {
          selectedItems.value.set(mapKey, item)
          emit('addTag', item)
        }
      }
      emit('update:modelValue', [...selectedItems.value.values()])
      if (childInputValue.value) {
        childInputValue.value.$el.firstChild.focus()
        childInputValue.value.input = ''
        inputValue.value = ''
      }
    }

    const matchedInputResult = ref([])
    function onInput({ input, items }: any) {
      inputValue.value = input
      matchedInputResult.value = items
    }
    function onBlur({ items }: any) {
      matchedInputResult.value = items
      emit('blur')
    }
    function onFocus() {
      emit('focus')
    }
    function onClick() {
      childInputValue.value?.$el.firstChild.focus()
    }

    function itemsProjection(item: any) {
      if (item === AllKey) {
        return 'All'
      }
      if (typeof item === 'object' && item && item[PLACEHOLDER_TAG]) {
        return item.name
      }
      if (props.optionLabelProp) {
        if (props.additionalFilters)
          return `${item[props.optionLabelProp] ?? ''} ${item[props.additionalFilters] ?? ''}`
        return item[props.optionLabelProp] ?? ''
      }
      return item ?? ''
    }

    function itemsProjectionForDisplay(item: any) {
      if (item === AllKey) {
        return 'All'
      }
      if (typeof item === 'object' && item && item[PLACEHOLDER_TAG]) {
        return item.name
      }
      if (props.optionLabelProp) return item[props.optionLabelProp] ?? ''
      return item ?? ''
    }

    function onInputTag() {
      addValue(inputValue.value)
      if (childInputValue.value) {
        childInputValue.value.input = ''
        inputValue.value = ''
      }
    }

    function onRemoveSelectTag(item: any) {
      const deletedTag = item
      const mapKey = getUniqueKey(item)
      selectedItems.value.delete(mapKey)
      emit('update:modelValue', [...selectedItems.value.values()])
      emit('removeTag', deletedTag)
    }
    function onDeleteTag() {
      // If user just delete inputting value, we should block user continously delete existed tag at that time
      if (oldInputValue.value) {
        blockDelete.value = true
      }

      if (blockDelete.value) {
        blockDelete.value = false
        oldInputValue.value = ''
      } else if (!inputValue.value && modelValue.value.length > 0) {
        const deletedTag = modelValue.value[modelValue.value.length - 1]
        const mapKey = getUniqueKey(deletedTag)
        selectedItems.value.delete(mapKey)
        emit('update:modelValue', [...selectedItems.value.values()])
        emit('removeTag', deletedTag)
      }
    }

    function handlePaste(event: ClipboardEvent) {
      event.preventDefault()
      const clipboardData = event.clipboardData
      if (!clipboardData) return

      const value = clipboardData.getData('text')
      const splitValue = value.split(',')

      for (const v of splitValue) {
        addValue(v.trim())
      }
    }

    function addValue(value: string) {
      if (!value.trim()) return
      if (value && props.type === 'inputTag') {
        const optionLabelProp = props.optionLabelProp
        if (optionLabelProp) {
          const existed = modelValue.value.find((item) => (item as TypeaheadData)[optionLabelProp] === value)
          if (!existed) {
            selectedItems.value.set(value, {
              [props.optionLabelProp]: value,
            })
            modelValue.value.push({
              [props.optionLabelProp]: value,
            })
          }
        } else {
          if (!modelValue.value.includes(value)) {
            selectedItems.value.set(value, value)
            modelValue.value.push(value)
          }
        }
        emit('update:modelValue', [...selectedItems.value.values()])
        emit('createTag', value)
      }
    }

    const typeaheadId = randstr('typeahead-')
    function randstr(prefix = '') {
      return Math.random().toString(36).replace('0.', prefix)
    }

    function boldMatchText(text: string) {
      const escapeRegExp = inputValue.value?.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') || ''
      const regexp = new RegExp(escapeRegExp ? `(${escapeRegExp})` : '(\b)', 'ig')
      return text.replace(regexp, '<strong>$1</strong>')
    }

    function getUniqueKey(item: string | TypeaheadData) {
      return props.uniqueKey && typeof item === 'object' ? item[props.uniqueKey] : optionLabel.value(item)
    }

    whenever(
      () => props.defaultValue.length,
      () => {
        selectedItems.value.clear()
        for (const item of props.defaultValue) {
          const mapKey = getUniqueKey(item)
          selectedItems.value.set(mapKey, item)
        }
      },
      { immediate: true },
    )
    watch(inputValue, (val, oldVal) => {
      oldInputValue.value = oldVal

      if (val === '' && childInputValue.value) {
        childInputValue.value.input = ''
      } else if (childInputValue.value) {
        if (
          childInputValue.value.filteredItems?.length === 0 ||
          childInputValue.value.filteredItems?.[0]?.id === waitForAddTagId
        ) {
          showHint.value = true
        } else {
          showHint.value = false
        }
      }
    })

    return {
      hintItem,
      data,
      matchedResult,
      matchedInputResult,
      childInputValue,
      modelInputValue: inputValue,
      AllKey,
      optionLabel,
      isSelectedAll,
      selectedItems,
      typeaheadId,
      onClick,
      onSelect,
      onInput,
      onBlur,
      onFocus,
      onInputTag,
      onDeleteTag,
      onRemoveSelectTag,
      itemsProjection,
      itemsProjectionForDisplay,
      boldMatchText,
      handlePaste,
    }
  },
})
</script>

<template>
  <div class="typeahead">
    <label v-if="label" class="text-body mb-1 block text-stone-800">
      {{ label }}
    </label>

    <div
      class="typeahead-wrap text-body relative size-full rounded-md border border-stone-400 bg-white p-2 focus:border-sky-600 focus:outline-none focus:ring-1 focus:ring-sky-600"
      :class="{ 'typeahead-wrap-padding pb-1': selectedItems.size }"
    >
      <label :for="typeaheadId" class="typeahead-label absolute cursor-text text-black/25">
        <span v-if="!modelInputValue && !selectedItems.size">
          {{ placeholder }}
        </span>
      </label>
      <ul class="flex w-full cursor-text flex-wrap" @click="onClick">
        <li
          v-for="(item, index) in [...selectedItems.values()]"
          :key="index"
          class="typeahead-tag text-stone-00 mb-1 mr-1 flex w-fit cursor-default items-center rounded bg-stone-100 px-2 py-0.5"
        >
          <span>
            {{ optionLabel(item) }}
          </span>
          <Icon
            icon-name="cross_thin"
            role="button"
            aria-label="remove"
            class="ml-[0.285rem] cursor-pointer text-[0.5rem]"
            @click.stop="onRemoveSelectTag(item)"
          />
        </li>
        <li class="flex-1">
          <SimpleTypeahead
            :id="typeaheadId"
            ref="childInputValue"
            :min-input-length="0"
            :items="data"
            :item-projection="itemsProjection"
            @select-item="onSelect"
            @on-input="onInput"
            @on-focus="onFocus"
            @on-blur="onBlur"
            @keyup.enter="onInputTag"
            @keyup.delete="onDeleteTag"
            @paste="handlePaste"
          >
            <template #list-item-text="{ item }">
              <slot
                name="typeahead-item"
                v-bind="{
                  item,
                  boldMatchText,
                  itemProjection: itemsProjectionForDisplay,
                  AllKey,
                  isSelectedAll,
                  selectedItems,
                }"
              >
                <slot
                  v-bind="{
                    item,
                    boldMatchText,
                    itemProjection: itemsProjectionForDisplay,
                  }"
                >
                  <span :class="{ 'order-2': placementLeft }" v-html="boldMatchText(itemsProjectionForDisplay(item))" />
                </slot>

                <template v-if="checkbox">
                  <span :class="{ 'flex grow justify-end': !placementLeft }">
                    <Checkbox
                      v-if="item === AllKey"
                      :model-value="isSelectedAll"
                      class="mt-0"
                      :class="{ 'order-1 mr-2': placementLeft }"
                    />
                    <Checkbox
                      v-else
                      :model-value="selectedItems.has(uniqueKey ? item[uniqueKey] : optionLabel(item))"
                      class="mt-0"
                      :class="{ 'order-1 mr-2': placementLeft }"
                    />
                  </span>
                </template>
                <template v-else>
                  <Icon
                    v-if="item === AllKey"
                    icon-name="check"
                    :class="[
                      placementLeft ? 'order-1 mr-2' : 'flex grow justify-end',
                      isSelectedAll ? 'visible' : 'invisible',
                    ]"
                  />
                  <Icon
                    v-else
                    icon-name="check"
                    :class="[
                      placementLeft ? 'order-1 mr-2' : 'flex grow justify-end',
                      selectedItems.has(uniqueKey ? item[uniqueKey] : optionLabel(item)) ? 'visible' : 'invisible',
                    ]"
                  />
                </template>
              </slot>
            </template>
          </SimpleTypeahead>
        </li>
        <li
          v-if="
            modelInputValue &&
            !hintItem.length &&
            (![...matchedResult, ...hintItem].length || !matchedInputResult.length)
          "
        >
          <div class="simple-typeahead-list" style="padding-bottom: 0.75rem">
            <div
              v-if="allOption"
              class="simple-typeahead-list-item flex items-center border-b border-stone-200"
              @click="onSelect(AllKey)"
            >
              <Checkbox :model-value="isSelectedAll" class="mb-1 mr-2" />
              <span>All</span>
            </div>
            <slot name="no-match-message">
              <div class="text-body px-4 pt-3 text-stone-800/75">
                {{ noMatchMessage }}
              </div>
            </slot>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep .simple-typeahead {
  &-input {
    @apply w-full bg-transparent outline-none;
  }
  &-list {
    @apply absolute left-0 top-full z-[1] mt-px max-h-60 w-full overflow-scroll rounded-md bg-white py-0.5;
    box-shadow: 5px 10px 30px 0 rgba(0, 0, 0, 0.15);
    &-item {
      @apply relative cursor-pointer px-4 py-2  text-stone-800/75 hover:bg-stone-100 focus:bg-stone-100 focus-visible:bg-stone-100;
      font-size: 0.875rem;
      font-weight: normal;
      line-height: 1.25rem;
      &-active {
        @apply bg-stone-100;
      }
      &-text {
        @apply flex items-center;
      }
    }
  }
}
</style>
