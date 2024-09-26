import { defineGraphQLMock } from '../define-graphql-mock'
import { ListWebflowSitesDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListWebflowSitesDocument, {
  webflowSites: [
    {
      id: '1',
      displayName: 'Example Site',
      defaultDomain: 'https://example.webflow.io',
      customDomains: [
        {
          id: '2',
          url: 'https://example.com',
        },
      ],
    },
  ],
})
