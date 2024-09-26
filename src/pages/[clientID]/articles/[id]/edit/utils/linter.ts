import { filterHTMLTag } from '~/utils'
import { useLinterStore } from '~/stores/linter'
import { warning } from '~/lib/linter'

export function useLinter() {
  const linterStore = useLinterStore()

  function titleLinter(value: string) {
    const title = filterHTMLTag(value)
    if (title?.length < 50) {
      linterStore.issues.title = warning.shortTitle
    } else if (title?.length > 60) {
      linterStore.issues.title = warning.longTitle
    } else {
      linterStore.issues.title = warning.none
    }
  }

  function coverLinter(value: string) {
    if (!value) {
      linterStore.issues.coverUrl = warning.coverUrl
    } else {
      linterStore.issues.coverUrl = warning.none
    }
  }

  return {
    titleLinter,
    coverLinter,
  }
}
