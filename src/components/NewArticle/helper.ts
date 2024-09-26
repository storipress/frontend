import type { Desk, NewArticleInput, ResolvedNewArticleInput } from './definitions'
import type { CreateArticleInput, CreateArticleMutation, Exact } from '~/graphql-operations'
import { ArticlePlan, CreateArticleDocument } from '~/graphql-operations'
import { useMutation } from '~/lib/apollo'
import { useDesks, useStages } from '~/composables'

function isDeskLike(x: object): x is Desk {
  return 'id' in x && 'name' in x
}

export function resolveInput(input: string | Desk | NewArticleInput | undefined): ResolvedNewArticleInput {
  if (input == null) {
    return { desk: input, openEditor: true }
  } else if (typeof input === 'string') {
    return { desk: input, openEditor: true }
  } else if (isDeskLike(input)) {
    return { desk: input, openEditor: true }
  }
  return { ...input, openEditor: input.openEditor ?? true }
}

export function useCreateArticle() {
  const { desks } = useDesks()
  const stages = useStages()
  const defaultStage = computed(
    () =>
      stages.value.find((stage) => stage.default) || {
        id: '1',
        name: 'Draft',
        color: 'transparent',
        order: 0,
        icon: '',
        ready: false,
        default: true,
      },
  )
  const { mutate } = useMutation(CreateArticleDocument, {})

  return {
    mutate,
    optimisticResponse: ({
      input: { title, blurb, desk_id },
    }: Exact<{ input: CreateArticleInput }>): CreateArticleMutation => ({
      __typename: 'Mutation',
      createArticle: {
        __typename: 'Article',
        id: 'temp-id',
        stage: defaultStage.value,
        desk: desks.value.find((desk) => desk.id === desk_id) ?? { id: '', name: '', slug: '' },
        plan: ArticlePlan.Free,
        title: title || '',
        blurb,
        published: false,
        scheduled: false,
        published_at: null,
        seo: null,
      },
    }),
  }
}
