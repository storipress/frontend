import { defineGraphQLMock } from '../define-graphql-mock'
import { CheckCustomDomainDnsStatusDocument, CustomDomainGroup } from '~/graphql-operations'

export default defineGraphQLMock(CheckCustomDomainDnsStatusDocument, {
  checkCustomDomainDnsStatus: {
    mail: [
      {
        domain: 'www.joesblog.storipress.dev',
        group: CustomDomainGroup.Mail,
        hostname: '20230602053200pm._domainkey.www.joesblog.storipress.dev',
        ok: false,
        type: 'TXT',
        value:
          'k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1RG+F584xu1j9xHYUrLCCtM+eb/yF1gww8oB11fZzVjIIcF0hgdyaCai2E6RlVALphG7dtu0qh/Jf6rA8oFAUZDuBGurzohkMzwrKot81RUd6y30h9fTYICeGBZnBMsmMCc5ZNL2wIsjfau5WOUETtC7YNz0OwLvTTR1Wu2s0swIDAQAB',
        __typename: 'CustomDomain',
      },
      {
        domain: 'www.joesblog.storipress.dev',
        group: CustomDomainGroup.Mail,
        hostname: '20230602053200pm._domainkey.www.joesblog.storipress.dev',
        ok: false,
        type: 'CNAME',
        value: 'pm.mtasv.net',
        __typename: 'CustomDomain',
      },
    ],
    redirect: [
      {
        domain: 'www.joesblog.storipress.dev',
        group: CustomDomainGroup.Redirect,
        hostname: 'www.www.joesblog.storipress.dev',
        ok: false,
        type: 'CNAME',
        value: 'cdn.storipress.com',
        __typename: 'CustomDomain',
      },
    ],
    site: [
      {
        domain: 'www.joesblog.storipress.dev',
        group: CustomDomainGroup.Site,
        hostname: 'www.joesblog.storipress.dev',
        ok: false,
        type: 'CNAME',
        value: 'cdn.storipress.com',
        __typename: 'CustomDomain',
      },
    ],
  },
})
