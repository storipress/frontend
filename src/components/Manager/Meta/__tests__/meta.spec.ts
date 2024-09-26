import { Select } from '@storipress/core-component'
import { featuredList } from '../setting'

import { render } from '~/test-helpers'

const blur = vi.fn()
it('change featured only trigger once blur event', async () => {
  const nowFeatured = ref('Unfeatured')
  const { getByText } = render(Select, {
    props: {
      items: featuredList,
      modelValue: nowFeatured,
      onBlur: blur,
      'onUpdate:modelValue': (value: string) => {
        nowFeatured.value = value
      },
    },
  })

  await getByText('Unfeatured').click()
  await getByText('Featured').click()
  expect(nowFeatured.value).toBe('Featured')
  expect(blur).toBeCalledTimes(1)
})
