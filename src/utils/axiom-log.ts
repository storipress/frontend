import { Axiom } from '@axiomhq/js'
import { captureException } from '@sentry/vue'
import { env } from '~/env'

const axiom = new Axiom({
  token: env.VITE_AXIOM_API_ERROR_TOKEN,
})

const browserInfo = {
  user_agent: navigator.userAgent,
  brands: navigator.userAgentData?.brands,
  platform: navigator.userAgentData?.platform,
  mobile: navigator.userAgentData?.mobile,
}

const defaultLog = {
  type: 'error',
  source: 'manager',
  ...browserInfo,
}

export function sendLog(log: Record<string, unknown>) {
  try {
    axiom.ingest(env.VITE_AXIOM_API_ERROR_DATASET, {
      ...defaultLog,
      ...log,
    })
  } catch (error) {
    captureException(error)
  }
}
