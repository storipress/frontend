import { cva } from 'class-variance-authority'

export const sectionContentBlock = cva('layer-1 h-fit w-[34rem] rounded-lg bg-white', {
  variants: {
    variant: {
      default: 'py-5',
      thin: 'p-5',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
