<template>
  <div class="p-5">
    <div class="layer-1 rounded-lg bg-gray-100/75">
      <slot name="content" />
    </div>

    <slot name="outsideContent" />
  </div>

  <div class="flex justify-end border-t border-stone-200 px-5 py-4">
    <slot name="footer" />
  </div>
</template>
