export type ButtonType = 'main' | 'transparent'
export type ButtonColor = 'default' | 'primary' | 'info' | 'warning'
export type ButtonHTMLType = 'submit' | 'button' | 'reset'

type ColorClassMap = {
  [key in ButtonType]: Record<ButtonColor, string[]>
}

export type ButtonTypeClassMap = ColorClassMap & {
  disabled: string[]
}
