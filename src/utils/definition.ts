export enum Role {
  Owner = 'owner',
  Admin = 'admin',
  Editor = 'editor',
  Author = 'author',
  Contributor = 'contributor',
}

export enum RoleCode {
  owner = 1,
  admin = 2,
  editor = 3,
  author = 4,
  contributor = 5,
}

export type RoleKeys = keyof typeof RoleCode

const GettingStarted = {
  Migrae:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/migrating-content-to-storipress/gXEEXVsgVR54W7RRAvWpc2#migrating-from-other-platforms-substack-medium-a-custom-cms',
  Desks: 'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/what-are-desks/4hpDXZkJEyUFnJh5jvUGL7',
  NewPublication:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/creating-a-new-publication/8F6d46nFhTbnYSzV1yEVU3',
  DesigningPublication:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/designing-your-publication/tqSUMiZ7QMKzYRXg6HvJnP',
  CustomDomain:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/connecting-a-custom-domain/mAukNJYm68NxDfkE8zf32e',
  Newsletters:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/gating-content--sending-newsletters/wxadMuHRQ5VaWyQFTVif7T',
  Sitemap:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/submitting-your-sitemap/qQ9uBuBgM6joYFFPmgHtWt',
  Advertising:
    'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/no-code-advertising-support/t7GnYHDY4p3MqCK4ypbPwE',
  Seo: 'https://help.storipress.com/getting-started/dGuU7UrYXbhoFZKB7WtKtN/a-guide-to-seo/prdmMwBpdm5azgnvcMrtDq',
}
const CustomFields = {
  Basics:
    'https://help.storipress.com/custom-fields--content-modelling/hwive2EKH9np765xdQTToe/content-modelling-basics/drz22eX8FqrfEQ3JsfVFRs',
  ModelTypes:
    'https://help.storipress.com/custom-fields--content-modelling/hwive2EKH9np765xdQTToe/types-of-content-models/tnDELXYQd2KV5dvZ7P4ciy',
}
const Billing = {
  Index: 'https://help.storipress.com/billing--subscriptions/8r6xESbtjtYoKn1FPFZB48',
}
const Shopify = {
  Index: 'https://help.storipress.com/shopify-integration/rJZWQTYeP3YtntrCBi8cWb',
}
const Webflow = {
  Index: 'https://help.storipress.com/webflow-integration/a9QoSRLZz7iVPwDPg2hpKb',
  Connecting:
    'https://help.storipress.com/webflow-integration/a9QoSRLZz7iVPwDPg2hpKb/connecting-webflow/t6hh3YqyHshvpdroRaTGGX',
}
const Zapier = {
  Index: 'https://help.storipress.com/zapier-integration/7KFMcyVCfei6u9QpPgPSaz',
  Connecting:
    'https://help.storipress.com/zapier-integration/7KFMcyVCfei6u9QpPgPSaz/connecting-zapier/eg2cmAWQ1hvQS4gbCh2sTF',
}

export const HelpCategories = {
  GettingStarted,
  CustomFields,
  Billing,
  Shopify,
  Webflow,
  Zapier,
}
