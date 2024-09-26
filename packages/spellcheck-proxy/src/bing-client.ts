import { z } from 'zod'
import { initClient, initContract } from '@ts-rest/core'
import { SpellcheckResponseSchema } from '../schema'

const c = initContract()

const spellCheckContract = c.router({
  getSuggestions: {
    method: 'POST',
    path: '/v7.0/spellcheck',
    contentType: 'application/x-www-form-urlencoded',
    body: z.object({
      mkt: z.enum(['en-US', 'ja-JP']).optional(),
      mode: z.enum(['proof', 'spell']),
      text: z.string(),
    }),
    responses: {
      200: SpellcheckResponseSchema,
    },
  },
})

export function createBingClient(key: string) {
  return initClient(spellCheckContract, {
    baseUrl: 'https://api.bing.microsoft.com',
    baseHeaders: {
      'Ocp-Apim-Subscription-Key': key,
      'X-MSEdge-ClientID': '00B4230B74496E7A13CC2C1475056FF4',
      'X-MSEdge-ClientIP': '11.22.33.44',
    },
  })
}
