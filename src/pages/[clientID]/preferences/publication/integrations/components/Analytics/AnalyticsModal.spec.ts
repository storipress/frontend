import AnalyticsModal from './AnalyticsModal.vue'
import { render } from '~/test-helpers'

it('analyticsModal work', () => {
  const { getByLabelText } = render(AnalyticsModal, {
    props: {
      modelValue: true,
      label: 'Test Label',
      info: 'Test info',
      img: 'https://example.com/analytics.png',
      activatedTime: true,
      integrationData: {
        anonymous: false,
        tracking_id: 'test_code',
      },
    },
  })

  const input = getByLabelText('Google Analytics Tracking ID')

  expect(input).toBeVisible()
  expect(input).toHaveValue('test_code')
})
