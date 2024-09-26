<script lang="ts" setup>
import { Buttons as SpButton } from '@storipress/core-component'

const emit = defineEmits<(event: 'addField') => void>()
</script>

<template>
  <main class="flex-grow-0">
    <div class="relative flex h-full items-stretch overflow-hidden bg-stone-50">
      <div class="flex h-[calc(100vh-3.5rem+1px)] w-60 border-r border-solid border-stone-200 px-5 pt-[1.375rem]">
        <ul class="flex w-full flex-col gap-y-8">
          <li class="flex flex-col">
            <span class="text-subheading mb-4 border-b border-stone-200 pb-1 text-stone-600">Fields</span>
            <SpButton color="info" @click="emit('addField')">Add Field</SpButton>
          </li>
          <li class="flex flex-col">
            <span class="text-subheading mb-4 border-b border-stone-200 pb-1 text-stone-600">Documentation</span>
            <span class="text-body mr-2.5 text-stone-800">
              Read more about content types in our
              <a
                href="https://developers.storipress.com/karbon/2gLtVFS6QEkdvKF7fkRng1/content-modelling/qbTKo524jew8wHxWkGDBzJ"
                target="_blank"
                class="text-sky-600"
              >
                guide to content modelling.
              </a>
              <br />
              <br />
              Check out the <a class="text-sky-600">field lifecycle</a> to learn about the various ways of disabling and
              deleting fields.
            </span>
          </li>
        </ul>
      </div>
      <div class="relative h-[calc(100vh-3.5rem)] flex-grow overflow-x-auto bg-stone-50"></div>
    </div>
  </main>
</template>

<style lang="scss" scoped></style>
