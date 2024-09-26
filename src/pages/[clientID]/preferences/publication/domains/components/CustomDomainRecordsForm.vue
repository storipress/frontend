<script setup lang="ts">
import { HoverHint, Tooltip } from '@storipress/core-component'
import copy from 'copy-to-clipboard'
import type { CustomDomain } from '~/graphql-operations'

const props = withDefaults(
  defineProps<{
    domainRecords?: CustomDomain[]
    rootDomain: string
  }>(),
  { domainRecords: () => [] },
)

const copyStatus = ref(false)

// perform the conversion when providing a domain name, removing the hostname to reduce the possibility of user configuration errors
const convertDomainRecords = computed(() =>
  props.domainRecords.map((record) => {
    const hostname = extractHostname(record.hostname)
    return { ...record, hostname }
  }),
)

function onCopyValue(value?: string) {
  if (!value) {
    return
  }
  const result = copy(value)
  if (result) {
    copyStatus.value = true
  }
}

function extractHostname(hostname: string) {
  const result = hostname.replace(props.rootDomain, '')
  return result ? result.replace(/\.$/, '') : '@'
}
</script>

<template>
  <div class="text-body w-full text-stone-800">
    <div class="mb-6">2. With your Domain Registrar: Create DNS records with these values:</div>

    <ul class="mb-4 grid grid-cols-[20%_24%_31%_1fr] gap-x-4 font-semibold">
      <li>Record Type</li>
      <li>Host</li>
      <li>Value</li>
      <li>TTL</li>
    </ul>
    <template v-if="domainRecords.length">
      <ul
        v-for="(item, index) in convertDomainRecords"
        :key="index"
        class="mt-4 grid grid-cols-[20%_24%_31%_1fr] gap-x-4"
      >
        <li class="flex items-center gap-2">
          <Tooltip v-if="item.group === 'mail'">
            <div class="w-[21rem] p-4">
              <div class="text-button mb-1.5 text-stone-800">Email records</div>
              <div class="text-body text-stone-400">
                These are used to send newsletters using your custom domain from Storipress.
              </div>
            </div>
          </Tooltip>
          <span>
            {{ item.type }}
          </span>
        </li>
        <li class="w-full" data-testid="dns-host">
          <HoverHint
            placement="right"
            :offset="14"
            popup-class="before:content-[''] before:absolute before:border before:-left-3 before:border-[6px] before:border-r-stone-700 before:border-y-transparent before:border-l-transparent delay-75"
            reference-class="w-full truncate"
          >
            <span
              class="cursor-pointer px-1.5 py-1 duration-[50ms] hover:rounded hover:bg-gray-100"
              @click="onCopyValue(item.hostname)"
              @mouseleave="copyStatus = false"
            >
              {{ item.hostname }}
            </span>
            <template #content>
              {{ copyStatus ? 'Copied!' : 'Click to copy' }}
            </template>
          </HoverHint>
        </li>
        <li data-testid="dns-value" class="w-full">
          <HoverHint
            placement="right"
            :offset="14"
            popup-class="before:content-[''] before:absolute before:border before:-left-3 before:border-[6px] before:border-r-stone-700 before:border-y-transparent before:border-l-transparent delay-75"
            reference-class="w-full truncate"
          >
            <span
              class="cursor-pointer px-1.5 py-1 duration-[50ms] hover:rounded hover:bg-gray-100"
              @click="onCopyValue(item.value)"
              @mouseleave="copyStatus = false"
            >
              {{ item.value }}
            </span>
            <template #content>
              {{ copyStatus ? 'Copied!' : 'Click to copy' }}
            </template>
          </HoverHint>
        </li>
        <li>10 Minutes</li>
      </ul>
    </template>

    <div class="mt-8 text-gray-500">
      After these records are added, click the button below to activate your domain. It may take up to 48 hours from
      adding these records to Storipress being able to verify your domain.
    </div>
  </div>
</template>

<style scoped></style>
