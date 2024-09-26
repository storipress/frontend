export interface MemberDataInterface {
  id: string
  name: string
  avatar: string
  status: string
  role: string
  desks: { id: string; name: string }[]
  suspended?: boolean
}

export interface DeskSettingDataInterface {
  name: string
  openAccess: boolean
  description: ''
  members: MemberDataInterface[]
}

export type EventSubmitDataInterface = DeskSettingDataInterface
