import LinkedInNotify from '../LinkedInNotify.vue'
import { useGlobalIntegration } from '~/stores/global-integration'
import { render, useTestEnv } from '~/test-helpers'

useTestEnv()

it('can render linkedin notify', async () => {
  const { getByText, queryByText } = render(LinkedInNotify)
  const globalIntegration = useGlobalIntegration()

  expect(queryByText('Setting up your Linkedin Organizations')).not.toBeInTheDocument()

  globalIntegration.linkedInNotify = true

  await nextTick()

  expect(getByText('Setting up your Linkedin Organizations')).toBeVisible()
})
