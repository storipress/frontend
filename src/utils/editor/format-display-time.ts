import type { Locale } from 'date-fns'
import { formatRelative } from 'date-fns'
import locale from 'date-fns/locale/en-US'

const LOCALE: { locale: Locale } = {
  locale: {
    localize: locale.localize,
    formatLong: locale.formatLong,

    formatRelative: (token) => {
      switch (token) {
        case 'today':
          return "kk:mm 'Today'"

        case 'yesterday':
          return "kk:mm 'Yesterday'"

        case 'lastWeek':
          return 'kk:mm eee'
      }
      return 'kk:mm dd MMM'
    },
  },
}

export function formatDisplayTime(date: Date): string {
  return formatRelative(date, new Date(), LOCALE)
}
