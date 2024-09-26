import { Integrations } from '~/composables/integration'

export { Integrations }

export const INTEGRATIONS_INFO = {
  [Integrations.Disqus]: {
    name: 'Disqus',
    info: 'Activate comments on Storipress',
  },
  [Integrations.Facebook]: {
    name: 'Facebook',
    info: 'Automatically share your articles to your Facebook Page',
  },
  [Integrations.GoogleAdsense]: {
    name: 'AdSense',
    info: 'Monetise your publication with ads',
  },
  [Integrations.GoogleAnalytics]: {
    name: 'Google Analytics',
    info: 'Track how many people read and interact with your publication',
  },
  [Integrations.HeaderFooterCode]: {
    name: 'Header/Footer Code',
    info: 'Inject code into the <head> or <foot> tag of your publication',
  },
  [Integrations.LinkedIn]: {
    name: 'LinkedIn',
    info: 'Manage your content on LinkedIn',
  },
  [Integrations.Mailchimp]: {
    name: 'Mailchimp',
    info: 'Collect emails using Storipress’ subscription blocks',
  },
  [Integrations.Shopify]: {
    name: 'Shopify',
    info: 'Manage your content on Shopify',
  },
  [Integrations.Slack]: {
    name: 'Slack',
    info: 'Send Slack messages with article feedback + stage changes',
  },
  [Integrations.Twitter]: {
    name: 'Twitter',
    info: 'Automatically share your articles to your Twitter Account',
  },
  [Integrations.Webflow]: {
    name: 'Webflow',
    info: 'Manage your content on Webflow',
  },
  [Integrations.WordPress]: {
    name: 'WordPress',
    info: 'Manage your content on WordPress',
  },
  [Integrations.Zapier]: {
    name: 'Zapier',
    info: 'Zapier empowers you to automate your work across 5,000+ apps',
  },
}
