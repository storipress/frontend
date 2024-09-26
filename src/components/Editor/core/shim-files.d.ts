declare module '*.png' {
  const path: string

  export default path
}

declare module '*.module.scss' {
  const style: Record<string, string>

  export default style
}

declare module '*.eta' {
  import type { compile } from 'eta'

  const template: ReturnType<typeof compile>

  export default template
}

declare module '@iarna/word-count'
