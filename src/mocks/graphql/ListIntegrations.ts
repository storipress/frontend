import { defineGraphQLMock } from '../define-graphql-mock'
import { ListIntegrationsDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListIntegrationsDocument, {
  integrations: [
    {
      key: 'code-injection',
      data: '{"header":"<div>Global default<\\/div>\\n<script>console.log(\'default\')<\\/script>","footer":""}',
      activated_at: '2023-05-10T23:53:51+00:00',
      configuration: {
        __typename: 'IntegrationIgnoreConfiguration',
        key: null,
      },
      __typename: 'Integration',
    },
    {
      key: 'facebook',
      data: '[]',
      activated_at: null,
      configuration: {
        __typename: 'FacebookConfiguration',
        pages: [],
      },
      __typename: 'Integration',
    },
    {
      key: 'google-adsense',
      data: '{"code":"        <script async src=\\"https:\\/\\/pagead2.googlesyndication.com\\/pagead\\/js\\/adsbygoogle.js?client=ca-pub-1234\\"\\n     crossorigin=\\"anonymous\\"><\\/script>\\n","ads.txt":"foo bar ads\\n","scopes":{"articles":false,"front-page":true,"undefined":true}}',
      activated_at: '2023-04-11T04:57:10+00:00',
      configuration: {
        __typename: 'IntegrationIgnoreConfiguration',
        key: null,
      },
      __typename: 'Integration',
    },
    {
      key: 'google-analytics',
      data: '{"tracking_id":"G-HYQBZRZ1C6","anonymous":false}',
      activated_at: '2023-04-11T09:43:09+00:00',
      configuration: {
        __typename: 'IntegrationIgnoreConfiguration',
        key: null,
      },
      __typename: 'Integration',
    },
    {
      key: 'mailchimp',
      data: '{"action":"https:\\/\\/rajeshkasturirangan.us7.list-manage.com\\/subscribe\\/post?u=699b08d02abda767e43f7b742&id=e40c64e31a"}',
      activated_at: null,
      configuration: {
        __typename: 'IntegrationIgnoreConfiguration',
        key: null,
      },
      __typename: 'Integration',
    },
    {
      key: 'slack',
      data: '{"id":"TLPT5V4S2","name":"Storipress","thumbnail":"https:\\/\\/avatars.slack-edge.com\\/2021-01-20\\/1653977248163_741b0b395aaedc02ea88_230.png","published":[],"stage":[],"notifyAuthors":false}',
      activated_at: null,
      configuration: null,
      __typename: 'Integration',
    },
    {
      key: 'zapier',
      data: '[]',
      activated_at: null,
      configuration: {
        __typename: 'IntegrationIgnoreConfiguration',
        key: null,
      },
      __typename: 'Integration',
    },
  ],
})
