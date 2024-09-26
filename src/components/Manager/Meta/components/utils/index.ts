import type { IDefineYdocMapReturn, MediaEnableSetting, MediaUserSettingCard } from '../../utils'
import type { IntegrationsData } from '../../utils/types'
import type { LinkedInAuthors } from '~/graphql-operations'

export const DEFAULT_ENABLE: MediaEnableSetting = {
  Facebook: false,
  Twitter: false,
  LinkedIn: false,
}

export function updateYdocEnable(
  enable: boolean,
  ydocEnable: IDefineYdocMapReturn<MediaEnableSetting>,
  mediaName: string,
) {
  const changedEnable = {
    ...(ydocEnable.get() || DEFAULT_ENABLE),
    [mediaName]: !enable,
  }
  ydocEnable.set(changedEnable)
}

export const DEFAULT_USER: MediaUserSettingCard = {
  Facebook: {
    id: '',
    name: '',
    thumbnail: '',
  },
  Twitter: {
    id: '',
    name: '',
    thumbnail: '',
  },
  LinkedIn: {
    id: '',
    name: '',
    thumbnail: '',
  },
}

export function updateYdocUser(
  id: string,
  ydocUser: IDefineYdocMapReturn<MediaUserSettingCard>,
  mediaName: string,
  list: IntegrationsData[] | LinkedInAuthors[],
) {
  const changedUser = {
    ...(ydocUser.get() || DEFAULT_USER),
    [mediaName]: list.find((item: IntegrationsData | LinkedInAuthors) => item.id === id),
  }
  ydocUser.set(changedUser)
}
