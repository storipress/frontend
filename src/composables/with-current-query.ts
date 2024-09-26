import { withQuery } from 'ufo'

export function useWithCurrentQuery() {
  const route = useRoute()

  return {
    withQuery: (path: string) => {
      return withQuery(path, route.query)
    },
    queryString: computed(() => {
      const query = new URLSearchParams(
        Object.entries(route.query).filter((x): x is [string, string] => typeof x[1] === 'string'),
      ).toString()
      return `?${query}`
    }),
  }
}
