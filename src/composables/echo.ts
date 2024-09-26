import type { Channel } from 'laravel-echo'
import Echo from 'laravel-echo'
import { createEventHook } from '@vueuse/core'
import { useAuthStore } from '~/stores/auth'
import { useMeStore } from '~/stores/me'
import { env } from '~/env'
import 'pusher-js'

export const EchoEvent = {
  site: {
    deployment: {
      started: 'site.deployment.started',
      succeeded: 'site.deployment.succeeded',
      failed: 'site.deployment.failed',
    },
  },
} as const

type DeploymentEvent = (typeof EchoEvent)['site']['deployment']
type DeploymentEventType = DeploymentEvent[keyof DeploymentEvent]

interface DeploymentEventData {
  release_id: number | null
}

type EventData = DeploymentEventData

interface NotificationEvent {
  data: EventData
  id: string
  tenant_id: string | null
  type: DeploymentEventType
}

const echo = shallowReactive<Record<string, Echo>>({})
const authEndpoint = `${env.VITE_API_HOST}/broadcasting/auth`

export function useEcho() {
  const authStore = useAuthStore()
  const meStore = useMeStore()

  const notificationEvent = createEventHook<NotificationEvent>()
  const channel = shallowRef<Channel>()

  watch(
    () => meStore.userIdentification?.intercom_hash_identity,
    (intercomHashIdentity, expiredId) => {
      if (intercomHashIdentity === expiredId) return

      if (expiredId) {
        echo[expiredId]?.disconnect()
        Reflect.deleteProperty(echo, expiredId)
      }

      if (!intercomHashIdentity) return

      echo[intercomHashIdentity] ??= new Echo({
        broadcaster: 'pusher',
        key: env.VITE_PUSHER_KEY,
        cluster: 'us3',
        forceTLS: true,
        authEndpoint,
        authorizer: (channel: { name: string }) => {
          return {
            authorize: (socketId: string, callback: (...args: any[]) => void) => {
              fetch(authEndpoint, {
                method: 'POST',
                headers: {
                  'content-type': 'application/json',
                  Authorization: `Bearer ${authStore?.token}`,
                },
                body: JSON.stringify({
                  socket_id: socketId,
                  channel_name: channel.name,
                }),
              })
                .then((response) => response.json())
                .then((data) => {
                  callback(null, data)
                })
                .catch((error) => {
                  callback(error)
                })
            },
          }
        },
      })

      channel.value = echo[intercomHashIdentity].private(`n.${intercomHashIdentity}`)
      channel.value.notification((event: NotificationEvent) => {
        notificationEvent.trigger(event)
      })
    },
    { immediate: true },
  )

  return {
    EchoEvent,
    echo,
    channel,
    onNotification: notificationEvent.on,
  }
}
