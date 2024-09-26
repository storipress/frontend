export interface Plan {
  enabled: boolean
  title: string
  subtitle: string
  price: string
  buttonText: string
  contentTitle: string
  list: string[]
  onButtonClick: () => void
}
