import delay from 'delay'

export interface LoadingOptions {
  loadingIcon?: boolean
  show?: boolean
  title?: string
  currentDescription?: string
  interval?: number
  isDescriptionShow?: boolean
}

export interface DescriptionOptions {
  interval?: number
  descriptions: string[]
}

const loadingInfo = reactive<LoadingOptions>({
  loadingIcon: true,
  show: false,
  title: '',
  currentDescription: '',
  interval: 0,
  isDescriptionShow: false,
})

function loading({ title = 'Logging in', loadingIcon = true, interval = 0 }: LoadingOptions = {}) {
  Object.assign(loadingInfo, { title, show: true, loadingIcon })
  return sleep(interval)
}

async function sleep(interval: number) {
  return await delay(interval)
}

async function processDescription(description: string, interval = 3000) {
  loadingInfo.currentDescription = description
  loadingInfo.isDescriptionShow = true
  await sleep(interval)
  loadingInfo.isDescriptionShow = false
}

async function transformDescription({ descriptions, interval = 3000 }: DescriptionOptions) {
  for (const description of descriptions) {
    await processDescription(description, interval)
  }
}

function ready() {
  loadingInfo.show = false
}

export function useLoading() {
  return {
    loadingInfo,
    loading,
    showDescription: processDescription,
    transformDescription,
    ready,
  }
}
