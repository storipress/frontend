import SettingPanel from './SettingPanel.vue'
import { render } from '~/test-helpers'

it('renders correctly', () => {
  const { getByRole, getAllByRole } = render(SettingPanel, {
    props: {
      integrationData: {},
      isActivated: true,
    },
  })

  const updateSettingButton = getByRole('button', { name: 'Update settings' })
  expect(updateSettingButton).toBeVisible()

  expect(getAllByRole('textbox')).toHaveLength(1)
  expect(getAllByRole('tab')).toHaveLength(2)
})
