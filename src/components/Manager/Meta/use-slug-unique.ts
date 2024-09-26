import { UpdateArticleDocument } from '~/graphql-operations'
import { warning } from '~/lib/linter'

export function useSlugUnique(id: string, setError: (message: string | undefined) => void) {
  const { mutate: mutateUpdateArticle } = useMutation(UpdateArticleDocument)

  const hasSlugError: Ref<boolean> = ref(false)

  return async (slug: string) => {
    if (!slug) {
      hasSlugError.value = false
      setError(undefined)
      return true
    }

    try {
      await mutateUpdateArticle({
        id,
        slug,
      })
      hasSlugError.value = false
      setError(undefined)
    } catch {
      hasSlugError.value = true
      setError(warning.slugUnigue)
      return false
    }
    return true
  }
}
