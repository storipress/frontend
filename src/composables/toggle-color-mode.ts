import type { BasicColorMode } from '@vueuse/core'

export function useToggleColorMode() {
  const colorMode = useColorMode()
  const icon = ref(colorMode.state.value === 'light' ? 'line-md:sunny-outline' : 'line-md:moon')
  const currentColorMode = computed(() => colorMode.state.value)

  async function toggleColorMode() {
    const nextMode = getNextColorMode(currentColorMode.value)
    icon.value = nextMode.icon
    await nextTick()
    colorMode.value = nextMode.mode
  }

  return {
    colorMode,
    icon,
    currentColorMode,
    toggleColorMode,
  }
}

interface GetNextColorModeReturn {
  mode: BasicColorMode
  icon: string
}

const nextColorMode: Record<BasicColorMode, GetNextColorModeReturn> = {
  light: {
    mode: 'dark',
    icon: 'line-md:sunny-outline-to-moon-transition',
  },
  dark: {
    mode: 'light',
    icon: 'line-md:moon-to-sunny-outline-transition',
  },
}

export function getNextColorMode(current: BasicColorMode): GetNextColorModeReturn {
  return nextColorMode[current]
}
