export interface ResizeConfig {
  name: string
  width: number
  media?: string
}

export const PRESETS: ResizeConfig[] = [
  {
    name: 'xl',
    width: 2000,
    media: '(min-width: 1150px)',
  },
  {
    name: 'l',
    width: 1000,
    media: '(min-width: 768px)',
  },
  {
    name: 'm',
    width: 600,
    media: '(min-width: 375px)',
  },
  {
    name: 's',
    width: 300,
  },
]
