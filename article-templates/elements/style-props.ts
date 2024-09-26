import { computed } from '@vue/composition-api'
import { isUndefined, omitBy, pick } from 'lodash-es'
import type { PropType } from 'vue'

export type StyleObject<T> = Record<string, T>

type Style<T> = T | StyleObject<T>
type StyleProp<T> = PropType<Style<T | undefined>>

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
  bold: { type: [Boolean, Object] as StyleProp<boolean>, default: undefined },
  italic: { type: [Boolean, Object] as StyleProp<boolean>, default: undefined },
  underline: { type: [Boolean, Object] as StyleProp<boolean>, default: undefined },
  uppercase: { type: [Boolean, Object] as StyleProp<boolean>, default: undefined },
  lowercase: { type: [Boolean, Object] as StyleProp<boolean>, default: undefined },
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

const styleKeys = Object.keys(styleProps)

export function useStyles(props: StyleProps) {
  return computed(() => pick(omitBy(props, isUndefined), styleKeys))
}
