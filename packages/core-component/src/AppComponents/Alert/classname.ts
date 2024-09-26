import type { AlertTypeClassMap } from './definition'

export const classname: AlertTypeClassMap = {
  info: {
    iconName: 'info',
    textColor: 'text-emerald-500',
    borderColor: 'border-emerald-500/30',
    backgroundColor: 'bg-emerald-500/5',
  },
  warning: {
    iconName: 'warning',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
    backgroundColor: 'bg-yellow-500/5',
  },
  danger: {
    iconName: 'warning',
    textColor: 'text-red-700',
    borderColor: 'border-red-700/30',
    backgroundColor: 'bg-red-700/5',
  },
}
