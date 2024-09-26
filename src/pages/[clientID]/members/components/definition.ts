import type { EmptyObject } from 'type-fest'

export { SubscriptionType } from '~/graphql-operations'

export const SymbolMembersSetupState = Symbol('membersSetupState')

export interface IMembers {
  id: string
  avatar: string
  subscriber: string
  subscriptionType: SubscriptionTypeMap
  activity: number
  subscriptionDate: string
  revenue: string
  bounced: boolean
  newsletter: boolean
}

export interface IColumnInfo {
  key: keyof IMembers
  title?: string
  sortable?: boolean
}

export enum SetupStep {
  Default = 'Default',
  Stripe = 'Stripe',
  Import = 'Import',
  Confirmation = 'Confirmation',
}

export interface IMembersSetupState {
  offerPaidSubscriptions: boolean
  emailNewsletters: boolean
  email: string
  currency: string
  monthlyPrice: string
  yearlyPrice: string
}

export enum SubscriptionTypeMap {
  Paid = 'Paid',
  PaidManual = 'Paid (manual)',
  Free = 'Free',
  Unsubscribed = 'Unsubscribed',
}

export interface SubscriberEventsDataType {
  'email.received': EmptyObject
  'email.bounced': {
    code: number
    description: string | null
  }
  'email.opened': {
    first_open: boolean
  }
  'email.link_clicked': {
    link: string
  }
  'article.seen': {
    referer: string | null
  }
  'article.shared': {
    platform: string
  }
  'article.link.clicked': {
    link: string | null
  }
  'page.seen': {
    referer: string | null
  }
  'desk.seen': {
    referer: string | null
  }
  'author.seen': {
    referer: string | null
  }
  'home.seen': {
    referer: string | null
  }
  'article.hyperlink.clicked': {
    href: string
  }
  'article.text.copied': {
    text_copy: string
  }
  'article.text.selected': {
    text_selection: string
  }
  'article.read': {
    percentage: number
  }
  'page.viewed': {
    pathname: string
  }
  'article.commented': EmptyObject
  'auth.signed_up': EmptyObject
  'auth.signed_in': EmptyObject
  'auth.signed_out': EmptyObject
  'subscription.subscribed': EmptyObject
  'subscription.invoice_paid': EmptyObject
  'subscription.canceled': EmptyObject
}
