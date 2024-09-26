<script setup lang="ts">
import { Buttons } from '@storipress/core-component'
import ScrapbookInput from '~/components/ScrapbookInput.vue'
import { usePublicationPermission } from '~/composables/permission/publication'
import { Flags, useFeatureValue } from '~/lib/feature-flag'
import { GenerateNewstandKeyDocument, GetSiteCustomSiteDocument } from '~/graphql-operations'
import { HelpButton, HelpCategories } from '~/components/HelpButton'
import { BasicDialog, FormView } from '~/components/Integrations'

const props = defineProps<{
  modelValue: boolean
  label: string
  info: string
  img: string
  isActivated: boolean
}>()
const emit = defineEmits<{
  'update:modelValue': [val: boolean]
  deactivate: []
  activate: []
}>()

const visible = useVModel(props, 'modelValue', emit)

const zapierZapsList = useFeatureValue('zapier-zaps-list')

const { canGetApiKay } = usePublicationPermission()
const { result: siteQuery, refetch: refetchSite } = useFeatureFlaggedQuery(Flags.CustomSite, GetSiteCustomSiteDocument)
const { mutate: generateNewstandKey } = useMutation(GenerateNewstandKeyDocument)
watch(
  () => siteQuery.value?.site.newstand_key,
  async (key) => {
    if (key !== null) return
    await generateNewstandKey()
    await refetchSite()
  },
)
const newstandKey = computed(() => {
  if (!canGetApiKay.value) return ''
  return siteQuery.value?.site.newstand_key ?? ''
})
</script>

<template>
  <BasicDialog v-model="visible" :img="img" :integration-name="label" :info="info">
    <template #label>
      {{ label }}
      <HelpButton :to="HelpCategories.Zapier.Connecting" />
    </template>

    <FormView :is-activated="isActivated">
      <div>
        <div class="border-b border-stone-200 p-5">
          <div class="mb-3.5 w-full">
            <div class="text-subheading mb-4">1. Copy Newstand API key</div>
            <ScrapbookInput :input-value="newstandKey" label="Newstand API key" class="w-full" />
          </div>

          <span class="text-body text-stone-400">
            Connect the Newstand API to Zapier to create WebHooks. For more info on the Newstand API,
            <a href="https://api.storipress.com" target="blank" class="text-sky-700">read our developer docs here.</a>
          </span>
        </div>

        <div class="flex max-h-80 flex-col gap-y-4 overflow-y-scroll p-5">
          <zapier-zap-templates
            v-for="id in zapierZapsList"
            :key="id"
            :theme.prop="'light'"
            :ids.prop="id"
            :limit.prop="5"
            :use-this-zap.prop="'show'"
          ></zapier-zap-templates>
        </div>
      </div>

      <template #formFooter>
        <template v-if="isActivated">
          <Buttons type="main" color="warning" class="mr-2" @click="$emit('deactivate')"> Deactivate </Buttons>
        </template>

        <template v-else>
          <Buttons type="main" color="primary" html-type="submit" @click="$emit('activate')"> Activate </Buttons>
        </template>
      </template>
    </FormView>
  </BasicDialog>
</template>
