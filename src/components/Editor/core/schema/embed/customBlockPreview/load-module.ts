import type { TCustomModule } from '~/utils/customLayout/types'
import { injectRequire } from '~/utils/editor/inject-require'

export interface CustomModule {
  exports: TCustomModule
}

export async function loadModule(url: string) {
  const jsFile = await import(/* @vite-ignore */ url)
  const module: CustomModule = { exports: {} as TCustomModule }
  jsFile.default.factory(module, injectRequire(false))
  return module
}
