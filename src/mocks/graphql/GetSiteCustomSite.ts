import { defineGraphQLMock } from '../define-graphql-mock'
import { GetSiteCustomSiteDocument } from '~/graphql-operations'

export default defineGraphQLMock(GetSiteCustomSiteDocument, {
  site: {
    id: 'D6RX98VXN',
    name: "Jack's Blog",
    plan: 'publisher',
    custom_site_template: false,
    newstand_key: 'newstand_key',
    typesense_search_only_key: 'typesense_search_only_key',
  },
})
