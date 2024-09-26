import 'core-js/es/object/has-own'

// register vue composition api globally
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { ViteSSG } from 'vite-ssg'
import { defineAsyncComponent } from 'vue'
import { env } from './env'
import { initOpenReplay } from './lib/vendors/openreplay'
import { initPostHog } from './lib/vendors/posthog'
import type { UserModule } from '~/types'

// your custom styles here
import '~/components/Editor/core/content.scss'
import './styles/main.css'

import '@storipress/common-style/style.scss'
import '@article-templates/article-components'

initOpenReplay()
initPostHog()

const routes = setupLayouts(generatedRoutes)

const appPromise = import('./App.vue')

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  defineAsyncComponent(() => appPromise),
  { routes, base: env.BASE_URL },
  (ctx) => {
    // install all modules under `modules/`
    Object.values(import.meta.glob<{ install?: UserModule }>('./modules/*.ts', { eager: true })).forEach((i) =>
      i.install?.(ctx),
    )
  },
)
