<script setup lang="ts">
import { defineProps } from 'vue'
import { useRedirect } from '~/hooks/useRedirect'

const props = defineProps<{ clientID: string }>()
useRedirect(`/${props.clientID}/preferences/publication/details`)
</script>
