<script lang="ts">
import { defineComponent } from 'vue'
import { mergeTailwind } from '../../plugins/MergeTailwindPlugin'
import SpButton from '../../AppComponents/Buttons/index.vue'

export default defineComponent({
  name: 'NavbarSave',
  components: { SpButton },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['onDiscard', 'onSave'],
  setup(props, { emit }) {
    function onDiscard() {
      emit('onDiscard')
    }
    function onSave() {
      emit('onSave')
    }
    return {
      onDiscard,
      onSave,
      mergeTailwind,
    }
  },
})
</script>

<template>
  <div
    v-if="show"
    :class="
      mergeTailwind([
        'absolute top-0 z-[29] flex h-[3.5rem] w-full items-center justify-between bg-stone-800 px-[1.375rem]',
        $attrs.class,
      ])
    "
  >
    <div class="text-body text-white">Unsaved changes</div>
    <div>
      <SpButton type="transparent" class="mr-2" @click="onDiscard"> Discard </SpButton>
      <SpButton type="main" color="primary" @click="onSave"> Save </SpButton>
    </div>
  </div>
</template>
