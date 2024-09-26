export interface MemberDataInterface {
  id: string
  name: string
  avatar: string
  status: string
  role: string
  desks: { id: string; name: string }[]
  suspended: boolean
}

export interface DeskSettingDataInterface {
  id: string
  name: string
  openAccess: boolean
  description: string
  members: MemberDataInterface[]
  editTime?: Date
}

export type EventSubmitDataInterface = DeskSettingDataInterface
