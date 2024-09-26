import invariant from 'tiny-invariant'
import type { Instance, Plugin } from 'tippy.js'
import type { MenuCommands } from './definitions'
import { menuCommandsList } from './definitions'

export function isMenuType(keyInput: MenuCommands) {
  return menuCommandsList.includes(keyInput)
}

export const preventPopperHide: Plugin = {
  name: 'preventPopperHide',
  defaultValue: true,
  fn(instance: Instance) {
    return {
      onCreate() {
        instance.popper.addEventListener('focusout', () => {
          instance.show()
        })
      },
    }
  },
}

export const fadeInOut: Plugin = {
  name: 'fadeInOut',
  defaultValue: true,
  fn() {
    return {
      onHide(instance) {
        const { firstElementChild } = instance.popper
        invariant(firstElementChild, 'expect have popper element')
        firstElementChild.classList.remove('opacity-100')
      },
      onMount(instance) {
        const { firstElementChild } = instance.popper
        invariant(firstElementChild, 'expect have popper element')
        firstElementChild.classList.add('opacity-100')
        firstElementChild.classList.remove('opacity-0')
      },
      onShow(instance) {
        const { firstElementChild } = instance.popper
        invariant(firstElementChild, 'expect have popper element')
        firstElementChild.classList.add('transition-opacity', 'opacity-0')
      },
    }
  },
}
