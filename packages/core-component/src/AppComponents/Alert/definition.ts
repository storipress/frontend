export type AlertType = 'info' | 'warning' | 'danger'

interface Alert {
  iconName: string
  textColor: string
  borderColor: string
  backgroundColor: string
}

export type AlertTypeClassMap = {
  [key in AlertType]: Record<keyof Alert, string>
}
