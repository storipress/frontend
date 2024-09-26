export interface TCustomModule {
  __name: string
  setup: () => void
}

export interface TCustomComponent {
  exports: TCustomModule
  url: string
}
