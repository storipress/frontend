import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'text-variant' | 'layer'>({
  extend: {
    classGroups: {
      layer: [
        {
          layer: ['1', '2', '3'],
        },
      ],
      'text-variant': [
        {
          text: [
            'display-x-large',
            'display-large',
            'display-medium',
            'pageheading',
            'display-small',
            'heading',
            'medium',
            'inputs',
            'button',
            'body',
            'style-2',
            'style-3',
            'subheading',
            'caption',
            'style',
          ],
        },
      ],
    },
  },
})

export function mergeTailwind(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// alias
export const cn = mergeTailwind
