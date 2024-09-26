<script lang="ts" setup>
import type { PropType } from 'vue'
import { Buttons, Inputs } from '@storipress/core-component'
import { useForm } from 'vee-validate'
import type { DeskInterface, EventSubmitDataInterface } from './definition'
import SlideOver from '~/components/SlideOver'
import { createDeskNameSchema } from '~/composables'

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
    default: false,
  },
  loading: {
    type: Boolean,
    required: true,
    default: false,
  },
  parent: {
    type: Object as PropType<DeskInterface>,
    required: true,
  },
})
const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', newSubDesk: EventSubmitDataInterface): void
}>()

const name = ref('')
const description = ref('')
whenever(
  () => !props.show,
  () => {
    name.value = ''
    description.value = ''
  },
)

const { handleSubmit } = useForm({
  validationSchema: createDeskNameSchema('name'),
})
const submit = handleSubmit(() => {
  emit('submit', {
    name: name.value,
    description: description.value,
    parentId: props.parent.id,
  })
})
</script>

<template>
  <SlideOver
    class="add-sub-desk-slide-over"
    :show="show"
    :title="`Create New Sub-Desk in ${parent?.name}`"
    :click-outside-to-close="!loading"
    @close="$emit('close')"
    @submit="!loading && submit()"
  >
    <SectionContent
      sub-title="Subdesk settings"
      content="The subdesk name is used in your live site for section headings and navigation."
    >
      <template #content>
        <div>
          <Inputs v-model="name" label="Subdesk name" html-type="text" html-name="name" />
        </div>
        <div class="mt-4">
          <Inputs v-model="description" label="Subdesk description" html-type="text" html-name="description" />
        </div>
      </template>
    </SectionContent>
    <template #footer>
      <Buttons type="main" color="primary" html-type="submit" :is-loading="loading"> Create new desk </Buttons>
    </template>
  </SlideOver>
</template>

<style lang="scss">
.add-sub-desk-slide-over {
  .slide-over__footer {
    @apply justify-end;
  }
}
</style>
