<script setup lang="ts">
import WordPressGroup from '@assets/group-wordpress.webp'
import { InfoDialog } from '~/components/Integrations'

function onClick() {
  sendTrack('wordpress_onboarding_started', { source: 'integration' })
}
</script>

<template>
  <!-- WIP, click button to go plugin installation -->
  <InfoDialog
    :img="WordPressGroup"
    title="Connect Storipress to your WordPress"
    content="Experience the full power of Storipress on WordPress"
    button-text="Connect account"
    href="https://wordpress.org/plugins/storipress/"
    class="pb-14"
    @click-button="onClick"
  >
    <div class="text-caption m-auto mt-6 w-3/4 text-center text-stone-400">
      If you have installed the Wordfence Security plugin, you need to enable Application Password in the settings
      before starting the connection.
      <a
        href="https://help.storipress.com/wordpress-integraion/tR65bkyGCm8iq6XLKF4TWQ/connecting-storipress-whilst-using-wordfence-security/fwaZov7bhoQTCGZHRzij9Y"
        rel="noopener noreferrer"
        target="_blank"
        class="text-sky-700"
      >
        Learn more.
      </a>
    </div>
  </InfoDialog>
</template>
