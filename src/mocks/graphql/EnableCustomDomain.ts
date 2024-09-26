import { defineGraphQLMock } from '../define-graphql-mock'
import { EnableCustomDomainDocument } from '~/graphql-operations'

export default defineGraphQLMock(EnableCustomDomainDocument, (req) => ({
  enableCustomDomain: {
    id: 'D6RX98VXN',
    custom_domain: req.variables.input.value,
    custom_domain_email: [
      {
        hostname: '20220617081255pm._domainkey.www.ksjdfhksdhfkasjhdfhsjakf.com',
        type: 'TXT',
        value:
          'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJxCP6xGRXSZEMVQAx4kr87A6kYM6nwY3RTLUKS9Ne028RbcDmbvNrey9P7mm6Ma0hdh1zbKifLIyt5p3jvfX2yeCuJ8+nLNnzz0G6viEvMflhKCcbBycn6qZOzLFakt+RKtQRSeyr0cWzH/PUwYgPOEZVRuk04AGdI8gIDWvRLwIDAQAB',
        __typename: 'EmailDNSRecord' as const,
      },
      {
        hostname: 'pm-bounces.www.ksjdfhksdhfkasjhdfhsjakf.com',
        type: 'CNAME',
        value: 'pm.mtasv.net',
        __typename: 'EmailDNSRecord' as const,
      },
    ],
    __typename: 'Site' as const,
  },
}))
