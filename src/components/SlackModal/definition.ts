export type ChangeType = 'stage' | 'published'

export interface SlackChannel {
  id: string
  name: string
  is_private: boolean
}

export interface CompareChannels {
  add: SlackChannel['id'][]
  del: SlackChannel['id'][]
}

export interface UpdateSlackChannels {
  key: ChangeType
  channels: CompareChannels
}
