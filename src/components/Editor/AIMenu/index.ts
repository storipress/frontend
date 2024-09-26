import Commands from './commands'
import CreateMenuOption from './create-menu-option'
import { WriteMenu } from './writing-menu-plugin'

export { default as AIMenuShell } from './AIMenuShell.vue'
export { default as Commands } from './commands'
export { default as Suggestion } from './create-menu-option'
export { WriteMenu } from './writing-menu-plugin'
export { writeMenuOptions } from './write-menu-options'
export { default as MenuButton } from './MenuButton.vue'

export const AIMenu = Commands.configure({
  suggestion: CreateMenuOption,
})

export const AIWritingMenu = WriteMenu
