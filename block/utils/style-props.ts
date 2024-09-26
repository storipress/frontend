import type { Prop, PropType } from 'vue'
import { computed } from 'vue'

export interface StyleObject<T> {
  [K: string]: T
}

type Style<T> = T | StyleObject<T>
type StyleProp<T> = PropType<Style<T | undefined>>
type StyleOptions<T> = Prop<Style<T | undefined>>

export interface Props {
  fontSize?: Style<number>
  fontFamily?: Style<string>
  bold?: Style<boolean>
  italic?: Style<boolean>
  underline?: Style<boolean>
  uppercase?: Style<boolean>
  lowercase?: Style<boolean>
  align?: Style<string>
  color?: Style<string>
  lineHeight?: Style<number>
  hoverColor?: Style<string>
}

export const styleProps = {
  fontSize: [Number, Object] as StyleProp<number>,
  fontFamily: [String, Object] as StyleProp<string>,
  bold: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  italic: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  underline: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  uppercase: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  lowercase: { type: [Boolean, Object], default: undefined } as StyleOptions<boolean>,
  align: [String, Object] as StyleProp<string>,
  color: [String, Object] as StyleProp<string>,
  lineHeight: [Number, Object] as StyleProp<number>,
  hoverColor: [String, Object] as StyleProp<string>,
}

export const compositionStyleProps = {
  fontSize: [Number, Object],
  fontFamily: [String, Object],
  bold: { type: [Boolean, Object], default: undefined },
  italic: { type: [Boolean, Object], default: undefined },
  underline: { type: [Boolean, Object], default: undefined },
  uppercase: { type: [Boolean, Object], default: undefined },
  lowercase: { type: [Boolean, Object], default: undefined },
  align: [String, Object],
  color: [String, Object],
  lineHeight: [Number, Object],
}

export interface StyleProps {
  fontSize?: unknown
  fontFamily?: unknown
  bold?: unknown
  italic?: unknown
  underline?: unknown
  uppercase?: unknown
  lowercase?: unknown
  align?: unknown
  color?: unknown
  lineHeight?: unknown
}

export function useStyles(props: StyleProps) {
  return computed(() => {
    const { fontSize, fontFamily, bold, italic, underline, uppercase, lowercase, align, color, lineHeight } = props

    return {
      fontSize,
      fontFamily,
      bold,
      italic,
      underline,
      uppercase,
      lowercase,
      align,
      color,
      lineHeight,
    }
  })
}
