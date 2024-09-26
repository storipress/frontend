import type { ButtonTypeClassMap } from './definition'

const focusRing = ['focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2']
const transparent = ['bg-transparent', 'border']

export const classname: ButtonTypeClassMap = {
  disabled: ['bg-stone-200', 'text-stone-500', 'cursor-not-allowed'],
  main: {
    default: [
      'text-stone-800',
      'bg-white',
      'hover:bg-stone-50',
      'transition-colors',
      'duration-200',
      'focus:ring-stone-400',
      ...focusRing,
    ],
    primary: [
      'text-white',
      'bg-primary',
      'hover:bg-emerald-900',
      'transition-colors',
      'duration-200',
      'focus:ring-emerald-500',
      ...focusRing,
    ],
    info: [
      'text-white',
      'bg-info',
      'hover:bg-sky-700',
      'transition-colors',
      'duration-200',
      'focus:ring-sky-500',
      ...focusRing,
    ],
    warning: [
      'text-white',
      'bg-warning',
      'hover:bg-red-900',
      'transition-colors',
      'duration-200',
      'focus:ring-red-500',
      ...focusRing,
    ],
  },
  transparent: {
    default: [
      'text-white',
      'border-white/[.5]',
      'hover:border-white',
      'transition-colors',
      'duration-200',
      'focus:ring-stone-400',
      ...transparent,
      ...focusRing,
    ],
    primary: [
      'text-primary',
      'border-primary/[.5]',
      'hover:bg-stone-50',
      'transition-colors',
      'duration-200',
      'focus:ring-emerald-800',
      ...transparent,
      ...focusRing,
    ],
    info: [
      'text-info',
      'border-info/[.5]',
      'hover:bg-stone-50',
      'transition-colors',
      'duration-200',
      'focus:ring-sky-600',
      ...transparent,
      ...focusRing,
    ],
    warning: [
      'text-warning',
      'border-warning/[.5]',
      'hover:bg-stone-50',
      'transition-colors',
      'duration-200',
      'focus:ring-red-700',
      ...transparent,
      ...focusRing,
    ],
  },
}
