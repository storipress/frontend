import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  EmailString: { input: any; output: any; }
  JSON: { input: any; output: any; }
  Mixed: { input: any; output: any; }
  Upload: { input: any; output: any; }
};

/** add author to article form */
export type AddAuthorToArticleInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** user id(author id) */
  user_id: Scalars['ID']['input'];
};

export type AddSlackChannelsInput = {
  /** notify channels */
  channels: Array<Scalars['String']['input']>;
  /** notify condition */
  key: Scalars['ID']['input'];
};

/** add tag to article form */
export type AddTagToArticleInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** tag id */
  tag_id: Scalars['ID']['input'];
};

export type AppSubscriptionPlans = {
  __typename?: 'AppSubscriptionPlans';
  /** price currency */
  currency: Scalars['String']['output'];
  /**
   * plan group,
   * possible values: blogger, publisher
   */
  group: Scalars['String']['output'];
  /**
   * price id, use in price_id field when calling
   * createAppSubscription or updateAppSubscription
   */
  id: Scalars['ID']['output'];
  /**
   * billing period type,
   * possible values: month, year
   */
  interval: Scalars['String']['output'];
  /** billing period value */
  interval_count: Scalars['Int']['output'];
  /**
   * price value, string type of integer with two decimal points,
   * e.g. 1800 means $18.00
   */
  price: Scalars['String']['output'];
  /** possible values: licensed, metered */
  usage_type: Scalars['String']['output'];
};

export type ApplyCouponCodeToAppSubscriptionInput = {
  promotion_code: Scalars['String']['input'];
};

export type ApplyDealFuelCodeInput = {
  code: Scalars['String']['input'];
};

export type ApplyViededingueCodeInput = {
  code: Scalars['String']['input'];
};

/** Publication Articles */
export type Article = {
  __typename?: 'Article';
  /** article's authors */
  authors: Array<User>;
  /** auto post data */
  auto_posting?: Maybe<Scalars['JSON']['output']>;
  /** article description */
  blurb?: Maybe<Scalars['String']['output']>;
  /** custom fields for content block */
  content_blocks: Array<CustomField>;
  /** cover image and its properties */
  cover?: Maybe<Scalars['JSON']['output']>;
  /** article created time */
  created_at: Scalars['DateTime']['output'];
  /** article desk */
  desk: Desk;
  /** article content, prosemirror format */
  document?: Maybe<Scalars['JSON']['output']>;
  /** determinate article is in draft stage or not */
  draft: Scalars['Boolean']['output'];
  /** article content encryption key */
  encryption_key: Scalars['String']['output'];
  /** determinate article is featured or not */
  featured: Scalars['Boolean']['output'];
  /** article content, html format */
  html?: Maybe<Scalars['String']['output']>;
  /** article id */
  id: Scalars['ID']['output'];
  /** layout this article used */
  layout?: Maybe<Layout>;
  /** custom fields for metafield */
  metafields: Array<CustomField>;
  /** newsletter is on or not for this article */
  newsletter: Scalars['Boolean']['output'];
  /** when the newsletter is on, the time that the email has been sent */
  newsletter_at?: Maybe<Scalars['DateTime']['output']>;
  /** use for kanban sorting, group with desk_id field */
  order: Scalars['Int']['output'];
  /** article url pathname history */
  pathnames?: Maybe<Scalars['JSON']['output']>;
  /** article content, plaintext format */
  plaintext?: Maybe<Scalars['String']['output']>;
  /** determinate article is free, member or subscriber */
  plan: ArticlePlan;
  /** determinate article publish type is right now, schedule or none */
  publish_type: ArticlePublishType;
  /** determinate article is in published stage or not */
  published: Scalars['Boolean']['output'];
  /** article published time */
  published_at?: Maybe<Scalars['DateTime']['output']>;
  /** related articles */
  relevances: Array<Article>;
  /** determinate article is in scheduled stage or not */
  scheduled: Scalars['Boolean']['output'];
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>;
  /** article shadow authors(no real account authors) */
  shadow_authors?: Maybe<Array<Scalars['String']['output']>>;
  /** article string id */
  sid: Scalars['ID']['output'];
  /**
   * use for article url,
   * e.g. /posts/{slug}
   */
  slug: Scalars['String']['output'];
  /** current article stage */
  stage: Stage;
  /** article's tags */
  tags: Array<Tag>;
  /** editing note threads */
  threads: Array<ArticleThread>;
  /** article title */
  title: Scalars['String']['output'];
  /** article last updated time, all modified opteration will update this field */
  updated_at: Scalars['DateTime']['output'];
  /** article url */
  url: Scalars['String']['output'];
};

/** A paginated list of Article edges. */
export type ArticleConnection = {
  __typename?: 'ArticleConnection';
  /** A list of Article edges. */
  edges: Array<ArticleEdge>;
  /** Pagination information about the list of edges. */
  pageInfo: PageInfo;
};

/** An edge that contains a node of type Article and a cursor. */
export type ArticleEdge = {
  __typename?: 'ArticleEdge';
  /** A unique cursor that can be used for pagination. */
  cursor: Scalars['String']['output'];
  /** The Article node. */
  node: Article;
};

/** A paginated list of Article items. */
export type ArticlePaginator = {
  __typename?: 'ArticlePaginator';
  /** A list of Article items. */
  data: Array<Article>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Plan */
export enum ArticlePlan {
  /** public accessible article */
  Free = 'free',
  /** login required article */
  Member = 'member',
  /** paid member only article */
  Subscriber = 'subscriber'
}

/** Publish type */
export enum ArticlePublishType {
  /** Immediate */
  Immediate = 'immediate',
  /** None */
  None = 'none',
  /** Schedule */
  Schedule = 'schedule'
}

/** Sort by */
export enum ArticleSortBy {
  /** Article name */
  ArticleName = 'articleName',
  /** Article name desc */
  ArticleNameDesc = 'articleNameDesc',
  /** Date created */
  DateCreated = 'dateCreated',
  /** Date created desc */
  DateCreatedDesc = 'dateCreatedDesc',
  /** Date updated */
  DateUpdated = 'dateUpdated',
  /** Date updated desc */
  DateUpdatedDesc = 'dateUpdatedDesc'
}

export type ArticleThread = {
  __typename?: 'ArticleThread';
  /** article id */
  article_id: Scalars['ID']['output'];
  /** thread create time */
  created_at: Scalars['DateTime']['output'];
  /** thread id */
  id: Scalars['ID']['output'];
  /** notes owned by the article's thread */
  notes: Array<ArticleThreadNote>;
  /** thread position in document */
  position: Scalars['JSON']['output'];
  /** thread resolve(delete) time */
  resolved_at?: Maybe<Scalars['DateTime']['output']>;
  /** thread last update time */
  updated_at: Scalars['DateTime']['output'];
};


export type ArticleThreadNotesArgs = {
  hasThread?: InputMaybe<WhereConditions>;
};

/** article thread note */
export type ArticleThreadNote = {
  __typename?: 'ArticleThreadNote';
  /** article which owns this note */
  article: Article;
  /** note content */
  content: Scalars['String']['output'];
  /** note create time */
  created_at: Scalars['DateTime']['output'];
  /** note id */
  id: Scalars['ID']['output'];
  /** article thread which owns this note */
  thread: ArticleThread;
  /** note last update time */
  updated_at: Scalars['DateTime']['output'];
  /** user who owns this note */
  user: User;
};


/** article thread note */
export type ArticleThreadNoteArticleArgs = {
  trashed?: InputMaybe<Trashed>;
};


/** article thread note */
export type ArticleThreadNoteThreadArgs = {
  trashed?: InputMaybe<Trashed>;
};

export type AssignUserToDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input'];
  /** user id */
  user_id: Scalars['ID']['input'];
};

export type AuthToken = {
  __typename?: 'AuthToken';
  /** access token */
  access_token: Scalars['String']['output'];
  expires_in: Scalars['Int']['output'];
  token_type: Scalars['String']['output'];
  user_id: Scalars['ID']['output'];
};

/** State */
export enum AutoPostingState {
  /** the auto posting was aborted */
  Aborted = 'aborted',
  /** the auto posting was cancelled */
  Cancelled = 'cancelled',
  /** the auto posting was initialized */
  Initialized = 'initialized',
  /** the auto posting was past */
  None = 'none',
  /** the auto posting was posted */
  Posted = 'posted',
  /** the auto posting was waiting for post */
  Waiting = 'waiting'
}

export type Billing = {
  __typename?: 'Billing';
  /**
   * user's stripe account balance
   * @deprecated No longer supported
   */
  account_balance: Scalars['String']['output'];
  /** subscription is canceled or not */
  canceled: Scalars['Boolean']['output'];
  /** user's storipress credit balance */
  credit_balance: Scalars['String']['output'];
  /**
   * discount(coupon) applies to current invoice
   * @deprecated use next_pm_discounts
   */
  discount: Scalars['String']['output'];
  /** subscription ending time */
  ends_at?: Maybe<Scalars['DateTime']['output']>;
  has_historical_subscriptions: Scalars['Boolean']['output'];
  /** user has a payment method or not */
  has_pm: Scalars['Boolean']['output'];
  has_prophet: Scalars['Boolean']['output'];
  /** user id */
  id: Scalars['ID']['output'];
  /**
   * billing cycle,
   * possible values: monthly(stripe), yearly(stripe), lifetime(appsumo)
   */
  interval?: Maybe<Scalars['String']['output']>;
  /** next upcoming invoice time */
  next_pm_date?: Maybe<Scalars['DateTime']['output']>;
  /** next upcoming invoice discounts */
  next_pm_discounts: Array<BillingDiscount>;
  /** next upcoming invoice total price(tax excluded) */
  next_pm_subtotal?: Maybe<Scalars['String']['output']>;
  /** next upcoming invoice tax price */
  next_pm_tax?: Maybe<Scalars['String']['output']>;
  /** next upcoming invoice taxes details */
  next_pm_taxes: Array<BillingTax>;
  /** next upcoming invoice total price(tax included) */
  next_pm_total?: Maybe<Scalars['String']['output']>;
  /** canceled subscription is still in grace period or not */
  on_grace_period: Scalars['Boolean']['output'];
  /** user is during the trial period or not */
  on_trial: Scalars['Boolean']['output'];
  /**
   * subscription plan info:
   * - blogger(stripe)
   * - publisher(stripe)
   * - storipress_tier1(appsumo)
   * - storipress_tier2(appsumo)
   * - storipress_tier3(appsumo)
   * - storipress_bf_tier1(appsumo)
   * - storipress_bf_tier2(appsumo)
   * - storipress_bf_tier3(appsumo)
   * - storipress_bf_tier3(viededingue)
   * - storipress_bf_tier3(dealfuel)
   * - prophet
   */
  plan?: Maybe<Scalars['String']['output']>;
  /** subscription plan id */
  plan_id?: Maybe<Scalars['String']['output']>;
  /** card last 4 number */
  pm_last_four?: Maybe<Scalars['String']['output']>;
  /** card brand */
  pm_type?: Maybe<Scalars['String']['output']>;
  /** user's publications number */
  publications_count: Scalars['Int']['output'];
  /** user's publications quota */
  publications_quota: Scalars['Int']['output'];
  /** subscription editor seats */
  quantity?: Maybe<Scalars['Int']['output']>;
  /** possible values: prophet, viededingue, dealfuel, appsumo, stripe */
  referer?: Maybe<Scalars['String']['output']>;
  /** in used editors number */
  seats_in_use: Scalars['Int']['output'];
  /**
   * subscription source,
   * possible values: stripe, appsumo
   */
  source?: Maybe<Scalars['String']['output']>;
  /** user has active subscription or not */
  subscribed: Scalars['Boolean']['output'];
  /** free trail ending time */
  trial_ends_at?: Maybe<Scalars['DateTime']['output']>;
};

export type BillingDiscount = {
  __typename?: 'BillingDiscount';
  /**
   * discount amount,
   * e.g. 500
   */
  amount?: Maybe<Scalars['String']['output']>;
  /**
   * fixed type of discount value,
   * e.g. 300 means $3.00
   */
  amount_off?: Maybe<Scalars['String']['output']>;
  /**
   * discount name,
   * e.g. 10% off for 3 months
   */
  name: Scalars['String']['output'];
  /**
   * percentage type of discount value,
   * e.g. 10.0 means 10%
   */
  percent_off?: Maybe<Scalars['Float']['output']>;
};

export type BillingTax = {
  __typename?: 'BillingTax';
  /**
   * the total tax that will be paid,
   * e.g. 1650
   */
  amount: Scalars['String']['output'];
  /**
   * the jurisdiction for the tax rate,
   * e.g. Australia
   */
  jurisdiction?: Maybe<Scalars['String']['output']>;
  /**
   * tax name,
   * e.g. GST
   */
  name: Scalars['String']['output'];
  /**
   * the tax rate percent out of 100,
   * e.g. 10.0
   */
  percentage?: Maybe<Scalars['Float']['output']>;
};

export type Block = {
  __typename?: 'Block';
  /** block create time */
  created_at: Scalars['DateTime']['output'];
  /** block id */
  id: Scalars['ID']['output'];
  /** block last update time */
  updated_at: Scalars['DateTime']['output'];
  /** block uuid */
  uuid: Scalars['String']['output'];
};

/** A paginated list of Block items. */
export type BlockPaginator = {
  __typename?: 'BlockPaginator';
  /** A list of Block items. */
  data: Array<Block>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** email update form */
export type ChangeAccountEmailInput = {
  /** new account email field */
  email: Scalars['EmailString']['input'];
  /** current password field */
  password: Scalars['String']['input'];
};

export type ChangeArticleStageInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** stage id */
  stage_id: Scalars['ID']['input'];
};

export type ChangeRoleInput = {
  /** user id */
  id: Scalars['ID']['input'];
  /** role id */
  role_id: Scalars['ID']['input'];
};

export type CheckCustomDomainAvailabilityInput = {
  /** domain name */
  value: Scalars['String']['input'];
};

export type CheckCustomDomainAvailabilityResponse = {
  __typename?: 'CheckCustomDomainAvailabilityResponse';
  /** whether this domain is available or not */
  available: Scalars['Boolean']['output'];
  /** whether this domain is available for mailing or not */
  mail: Scalars['Boolean']['output'];
  /** whether this domain is available for redirect or not */
  redirect: Scalars['Boolean']['output'];
  /** whether this domain is available for static site or not */
  site: Scalars['Boolean']['output'];
};

/** email confirm form */
export type ConfirmEmailInput = {
  /** email field */
  email: Scalars['EmailString']['input'];
  /** link expired time field */
  expire_on: Scalars['Int']['input'];
  /** hmac for inputs */
  signature: Scalars['String']['input'];
};

export type ConfirmProphetCheckoutInput = {
  checkout_id: Scalars['String']['input'];
};

export type ConfirmProphetCheckoutResponse = {
  __typename?: 'ConfirmProphetCheckoutResponse';
  email: Scalars['String']['output'];
  exists: Scalars['Boolean']['output'];
  first_name?: Maybe<Scalars['String']['output']>;
  last_name?: Maybe<Scalars['String']['output']>;
};

export type CreateAppSubscriptionInput = {
  price_id: Scalars['String']['input'];
  promotion_code?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateArticleInput = {
  /** author ids(user id) */
  author_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** article description */
  blurb?: InputMaybe<Scalars['String']['input']>;
  /** desk id */
  desk_id: Scalars['ID']['input'];
  /** article published_at */
  published_at?: InputMaybe<Scalars['DateTime']['input']>;
  /** article title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type CreateArticleThreadInput = {
  /** article id */
  article_id: Scalars['ID']['input'];
  /** position in article document */
  position: Scalars['JSON']['input'];
};

export type CreateBlockInput = {
  /** block archive file */
  file?: InputMaybe<Scalars['Upload']['input']>;
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>;
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type CreateCustomFieldGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  /** custom field group key */
  key: Scalars['String']['input'];
  /** custom field group name */
  name: Scalars['String']['input'];
  /** custom field group type */
  type: CustomFieldGroupType;
};

export type CreateCustomFieldInput = {
  /** custom field group id */
  custom_field_group_id: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  /** custom field key */
  key: Scalars['String']['input'];
  /** custom field name */
  name: Scalars['String']['input'];
  /** custom field options */
  options?: InputMaybe<Scalars['JSON']['input']>;
  /** custom field type */
  type: CustomFieldType;
};

export type CreateCustomFieldValueInput = {
  /** custom field id */
  id: Scalars['ID']['input'];
  /** target id */
  target_id: Scalars['ID']['input'];
  /** custom field value */
  value?: InputMaybe<Scalars['Mixed']['input']>;
};

export type CreateDeskInput = {
  /** desk description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** parent desk id */
  desk_id?: InputMaybe<Scalars['ID']['input']>;
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>;
  /** desk name */
  name: Scalars['String']['input'];
  /** determinate desk is open_access or not */
  open_access?: InputMaybe<Scalars['Boolean']['input']>;
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>;
};

export type CreateInvitationInput = {
  /** desk id */
  desk_id: Array<Scalars['ID']['input']>;
  /** email */
  email: Scalars['EmailString']['input'];
  /** role id */
  role_id: Scalars['ID']['input'];
};

export type CreateLayoutInput = {
  /** layout data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** layout name */
  name: Scalars['String']['input'];
  /** template id */
  template: Scalars['String']['input'];
};

export type CreateLinkInput = {
  source: LinkSource;
  target_id?: InputMaybe<Scalars['ID']['input']>;
  target_type?: InputMaybe<LinkTarget>;
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateLinterInput = {
  /** linter description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** linter prompt */
  prompt: Scalars['String']['input'];
  /** linter title */
  title: Scalars['String']['input'];
};

export type CreateNoteInput = {
  /** note content */
  content: Scalars['String']['input'];
  /** thread id */
  thread_id: Scalars['ID']['input'];
};

export type CreatePageInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>;
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>;
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>;
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>;
  /**
   * page title,
   * e.g. About Us
   */
  title: Scalars['String']['input'];
};

export type CreateRedirectionInput = {
  /** path */
  path: Scalars['String']['input'];
  /** target */
  target: Scalars['String']['input'];
};

export type CreateScraperArticleInput = {
  /** articles' path */
  path: Array<Scalars['String']['input']>;
  /** scraper token */
  token: Scalars['String']['input'];
};

export type CreateScraperSelectorInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** scraper token */
  token: Scalars['String']['input'];
  /** selector type */
  type: Scalars['String']['input'];
  /** selector value */
  value?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSiteInput = {
  /** emails which will be invited to current publication */
  invites: Array<Scalars['EmailString']['input']>;
  /** publication name */
  name: Scalars['String']['input'];
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type CreateStageInput = {
  /** target stage id, place new stage after target stage id */
  after: Scalars['ID']['input'];
  /** stage color */
  color: Scalars['String']['input'];
  /** stage icon */
  icon: Scalars['String']['input'];
  /** stage name */
  name: Scalars['String']['input'];
};

export type CreateTagInput = {
  /** tag description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** tag name */
  name: Scalars['String']['input'];
};

export type CreateWebflowCollectionInput = {
  /** collection Type */
  type: WebflowCollectionType;
};

export type Credit = {
  __typename?: 'Credit';
  /** credit amount */
  amount: Scalars['String']['output'];
  /** credit remark */
  data?: Maybe<Scalars['JSON']['output']>;
  /**
   * credit earned at
   * (the time that state was from draft to available)
   */
  earned_at?: Maybe<Scalars['DateTime']['output']>;
  /**
   * credit earned source,
   * e.g. invitation
   */
  earned_from: Scalars['String']['output'];
  /** credit id */
  id: Scalars['ID']['output'];
  /** credit initialized at */
  initialized_at: Scalars['DateTime']['output'];
  /** credit state */
  state: CreditState;
  /** credit used or not */
  used: Scalars['Boolean']['output'];
  /** credit used at */
  used_at?: Maybe<Scalars['DateTime']['output']>;
};

/** A paginated list of Credit items. */
export type CreditPaginator = {
  __typename?: 'CreditPaginator';
  /** A list of Credit items. */
  data: Array<Credit>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** State */
export enum CreditState {
  /** Available */
  Available = 'available',
  /** Draft */
  Draft = 'draft',
  /** Used */
  Used = 'used',
  /** Void */
  Void = 'void'
}

export type CreditsOverview = {
  __typename?: 'CreditsOverview';
  /** default credit amount of current type */
  amount: Scalars['String']['output'];
  /** available credit number */
  count: Scalars['Int']['output'];
  /** total amount */
  total: Scalars['String']['output'];
  /**
   * type of credit,
   * e.g. invitation
   */
  type: Scalars['String']['output'];
};

export type CustomDomain = {
  __typename?: 'CustomDomain';
  domain: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  group: CustomDomainGroup;
  hostname: Scalars['String']['output'];
  ok: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type CustomDomainDnsStatus = {
  __typename?: 'CustomDomainDnsStatus';
  mail: Array<CustomDomain>;
  redirect: Array<CustomDomain>;
  site: Array<CustomDomain>;
};

/** Group */
export enum CustomDomainGroup {
  /** Mail */
  Mail = 'mail',
  /** Redirect */
  Redirect = 'redirect',
  /** Site */
  Site = 'site'
}

export type CustomField = {
  __typename?: 'CustomField';
  description?: Maybe<Scalars['String']['output']>;
  group: CustomFieldGroup;
  id: Scalars['ID']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<CustomFieldOptions>;
  type: CustomFieldType;
  values: Array<CustomFieldValue>;
};

export type CustomFieldBooleanOptions = {
  __typename?: 'CustomFieldBooleanOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldBooleanValue = {
  __typename?: 'CustomFieldBooleanValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['Boolean']['output']>;
};

export type CustomFieldColorOptions = {
  __typename?: 'CustomFieldColorOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldColorValue = {
  __typename?: 'CustomFieldColorValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type CustomFieldDateOptions = {
  __typename?: 'CustomFieldDateOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  time?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldDateValue = {
  __typename?: 'CustomFieldDateValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['DateTime']['output']>;
};

export type CustomFieldFileOptions = {
  __typename?: 'CustomFieldFileOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldFileValue = {
  __typename?: 'CustomFieldFileValue';
  id: Scalars['ID']['output'];
  value?: Maybe<CustomFieldFileValueAttributes>;
};

export type CustomFieldFileValueAttributes = {
  __typename?: 'CustomFieldFileValueAttributes';
  key: Scalars['ID']['output'];
  mime_type: Scalars['String']['output'];
  size: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type CustomFieldGroup = {
  __typename?: 'CustomFieldGroup';
  description?: Maybe<Scalars['String']['output']>;
  /** @deprecated https://github.com/nuwave/lighthouse/issues/332 */
  desks: Array<Desk>;
  fields: Array<CustomField>;
  id: Scalars['ID']['output'];
  key: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** @deprecated https://github.com/nuwave/lighthouse/issues/332 */
  tags: Array<Tag>;
  type: CustomFieldGroupType;
};

/** A paginated list of CustomFieldGroup items. */
export type CustomFieldGroupPaginator = {
  __typename?: 'CustomFieldGroupPaginator';
  /** A list of CustomFieldGroup items. */
  data: Array<CustomFieldGroup>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** Group type */
export enum CustomFieldGroupType {
  /** Article content block */
  ArticleContentBlock = 'articleContentBlock',
  /** Article metafield */
  ArticleMetafield = 'articleMetafield',
  /** Desk metafield */
  DeskMetafield = 'deskMetafield',
  /** Publication metafield */
  PublicationMetafield = 'publicationMetafield',
  /** Tag metafield */
  TagMetafield = 'tagMetafield'
}

export type CustomFieldIgnoreOptions = {
  __typename?: 'CustomFieldIgnoreOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldJsonOptions = {
  __typename?: 'CustomFieldJsonOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldJsonValue = {
  __typename?: 'CustomFieldJsonValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type CustomFieldNumberOptions = {
  __typename?: 'CustomFieldNumberOptions';
  float?: Maybe<Scalars['Boolean']['output']>;
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldNumberValue = {
  __typename?: 'CustomFieldNumberValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type CustomFieldOptions = CustomFieldBooleanOptions | CustomFieldColorOptions | CustomFieldDateOptions | CustomFieldFileOptions | CustomFieldIgnoreOptions | CustomFieldJsonOptions | CustomFieldNumberOptions | CustomFieldReferenceOptions | CustomFieldRichTextOptions | CustomFieldSelectOptions | CustomFieldTextOptions | CustomFieldUrlOptions;

export type CustomFieldReferenceOptions = {
  __typename?: 'CustomFieldReferenceOptions';
  collection_id?: Maybe<Scalars['String']['output']>;
  multiple?: Maybe<Scalars['Boolean']['output']>;
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  target?: Maybe<CustomFieldReferenceTarget>;
  type: CustomFieldType;
};

/** Reference target */
export enum CustomFieldReferenceTarget {
  /** Article */
  Article = 'article',
  /** Desk */
  Desk = 'desk',
  /** Tag */
  Tag = 'tag',
  /** User */
  User = 'user',
  /** Webflow */
  Webflow = 'webflow'
}

export type CustomFieldReferenceTargetValue = Article | Desk | Tag | User | WebflowReference;

export type CustomFieldReferenceValue = {
  __typename?: 'CustomFieldReferenceValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Array<CustomFieldReferenceTargetValue>>;
};

export type CustomFieldRichTextOptions = {
  __typename?: 'CustomFieldRichTextOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldRichTextValue = {
  __typename?: 'CustomFieldRichTextValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type CustomFieldSelectOptions = {
  __typename?: 'CustomFieldSelectOptions';
  choices?: Maybe<Scalars['Mixed']['output']>;
  multiple?: Maybe<Scalars['Boolean']['output']>;
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldSelectValue = {
  __typename?: 'CustomFieldSelectValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Array<Scalars['String']['output']>>;
};

export type CustomFieldTextOptions = {
  __typename?: 'CustomFieldTextOptions';
  max?: Maybe<Scalars['Int']['output']>;
  min?: Maybe<Scalars['Int']['output']>;
  multiline?: Maybe<Scalars['Boolean']['output']>;
  placeholder?: Maybe<Scalars['String']['output']>;
  regex?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldTextValue = {
  __typename?: 'CustomFieldTextValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

/** Type */
export enum CustomFieldType {
  /** Boolean */
  Boolean = 'boolean',
  /** Color */
  Color = 'color',
  /** Date */
  Date = 'date',
  /** File */
  File = 'file',
  /** Json */
  Json = 'json',
  /** Number */
  Number = 'number',
  /** Reference */
  Reference = 'reference',
  /** Rich text */
  RichText = 'richText',
  /** Select */
  Select = 'select',
  /** Text */
  Text = 'text',
  /** Url */
  Url = 'url'
}

export type CustomFieldUrlOptions = {
  __typename?: 'CustomFieldUrlOptions';
  placeholder?: Maybe<Scalars['String']['output']>;
  repeat?: Maybe<Scalars['Boolean']['output']>;
  required?: Maybe<Scalars['Boolean']['output']>;
  type: CustomFieldType;
};

export type CustomFieldUrlValue = {
  __typename?: 'CustomFieldUrlValue';
  id: Scalars['ID']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type CustomFieldValue = CustomFieldBooleanValue | CustomFieldColorValue | CustomFieldDateValue | CustomFieldFileValue | CustomFieldJsonValue | CustomFieldNumberValue | CustomFieldReferenceValue | CustomFieldRichTextValue | CustomFieldSelectValue | CustomFieldTextValue | CustomFieldUrlValue;

export type DateRange = {
  from: Scalars['DateTime']['input'];
  to: Scalars['DateTime']['input'];
};

export type DeleteScraperArticleInput = {
  /** scraper article id */
  id: Scalars['ID']['input'];
  /** scraper token */
  token: Scalars['String']['input'];
};

export type DeleteScraperSelectorInput = {
  /** scraper selector id */
  id: Scalars['ID']['input'];
  /** scraper token */
  token: Scalars['String']['input'];
};

export type DeleteSlackChannelsInput = {
  /** notify channels */
  channels: Array<Scalars['String']['input']>;
  /** notify condition */
  key: Scalars['ID']['input'];
};

export type Design = {
  __typename?: 'Design';
  /** live content */
  current?: Maybe<Scalars['JSON']['output']>;
  /** draft content */
  draft?: Maybe<Scalars['JSON']['output']>;
  /** design key */
  key: Scalars['ID']['output'];
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>;
};

export type Desk = {
  __typename?: 'Desk';
  /** articles number in this desk */
  articles_count: Scalars['Int']['output'];
  /** desk description */
  description?: Maybe<Scalars['String']['output']>;
  /** parent desk */
  desk?: Maybe<Desk>;
  /** child desks */
  desks: Array<Desk>;
  /** draft articles number in the desk(included sub-desks) */
  draft_articles_count: Scalars['Int']['output'];
  /** desk id */
  id: Scalars['ID']['output'];
  /** desk layout */
  layout?: Maybe<Layout>;
  /** custom fields for metafield */
  metafields: Array<CustomField>;
  /** desk name */
  name: Scalars['String']['output'];
  /** determinate desk is open_access or not */
  open_access: Scalars['Boolean']['output'];
  /** desk order */
  order: Scalars['Int']['output'];
  /** published articles number in the desk(included sub-desks) */
  published_articles_count: Scalars['Int']['output'];
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>;
  /** desk string id */
  sid: Scalars['ID']['output'];
  /**
   * desk slug, use for structure url,
   * e.g. /desks/{slug}
   */
  slug: Scalars['String']['output'];
  /** total articles number in the desk(included sub-desks) */
  total_articles_count: Scalars['Int']['output'];
};

export type DeskLayoutInput = {
  connect?: InputMaybe<Scalars['ID']['input']>;
  disconnect?: InputMaybe<Scalars['ID']['input']>;
};

export type Email = {
  __typename?: 'Email';
  /** email content(HTML format) */
  content: Scalars['String']['output'];
  /** email id */
  id: Scalars['ID']['output'];
  /** email subject(title) */
  subject: Scalars['String']['output'];
  /** email target */
  target?: Maybe<EmailTargetUnion>;
  /** email receiver(recipient) */
  to: Scalars['EmailString']['output'];
};

export type EmailDnsRecord = {
  __typename?: 'EmailDNSRecord';
  hostname: Scalars['String']['output'];
  type: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type EmailTargetUnion = Article;

export type EnableCustomDomainInput = {
  /**
   * domain name,
   * e.g. example.com
   */
  value: Scalars['String']['input'];
};

export type EnableSubscriptionInput = {
  /** subscription panel background color */
  accent_color?: InputMaybe<Scalars['String']['input']>;
  /** subscription currency */
  currency?: InputMaybe<Scalars['String']['input']>;
  /** support email */
  email?: InputMaybe<Scalars['EmailString']['input']>;
  /** subscription monthly price */
  monthly_price?: InputMaybe<Scalars['String']['input']>;
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['input'];
  /** enable paid subscription or not */
  subscription: Scalars['Boolean']['input'];
  /** subscription yearly price */
  yearly_price?: InputMaybe<Scalars['String']['input']>;
};

export type FacebookConfiguration = {
  __typename?: 'FacebookConfiguration';
  pages?: Maybe<Array<FacebookPage>>;
};

export type FacebookPage = {
  __typename?: 'FacebookPage';
  /** facebook page name */
  name: Scalars['String']['output'];
  /** facebook page id */
  page_id: Scalars['String']['output'];
  /** facebook page thumbnail */
  thumbnail: Scalars['String']['output'];
};

export type FacebookSearchPage = {
  __typename?: 'FacebookSearchPage';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type HubSpotInfo = {
  __typename?: 'HubSpotInfo';
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type IframelyIframelyInput = {
  /**
   * iframely params,
   * reference: https://iframely.com/docs/parameters
   */
  params: Scalars['JSON']['input'];
  /** target url */
  url: Scalars['String']['input'];
};

export type Image = {
  __typename?: 'Image';
  /** image caption */
  caption?: Maybe<Scalars['String']['output']>;
  /** image description */
  description?: Maybe<Scalars['String']['output']>;
  /** image height */
  height: Scalars['Int']['output'];
  /** mime type */
  mime: Scalars['String']['output'];
  /** filename */
  name: Scalars['String']['output'];
  /** image size */
  size: Scalars['Int']['output'];
  /** image title */
  title?: Maybe<Scalars['String']['output']>;
  /** identify token */
  token: Scalars['String']['output'];
  /** custom transformation */
  transformation?: Maybe<Scalars['JSON']['output']>;
  /** image url */
  url: Scalars['String']['output'];
  /** image width */
  width: Scalars['Int']['output'];
};

export type ImportSiteContentFromWordPressInput = {
  /** file exported from storipress wordpress plugin */
  file?: InputMaybe<Scalars['Upload']['input']>;
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>;
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type ImportSiteContentInput = {
  file: Scalars['Upload']['input'];
};

export type ImportSubscribersFromCsvFileInput = {
  /** csv file */
  file?: InputMaybe<Scalars['Upload']['input']>;
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>;
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type InitializeCustomDomainInput = {
  /** domain name for mailing */
  mail?: InputMaybe<Scalars['String']['input']>;
  /** domain for static site redirection */
  redirect: Array<Scalars['String']['input']>;
  /** domain name for static site */
  site?: InputMaybe<Scalars['String']['input']>;
};

export type InitializeSiteInput = {
  desks: Array<Scalars['String']['input']>;
  publication: Scalars['String']['input'];
};

export type Integration = {
  __typename?: 'Integration';
  /** determinate whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>;
  /** integration read-only data */
  configuration?: Maybe<IntegrationConfiguration>;
  /** integration data */
  data: Scalars['JSON']['output'];
  /** integration key */
  key: Scalars['ID']['output'];
};

export type IntegrationConfiguration = FacebookConfiguration | IntegrationIgnoreConfiguration | LinkedInConfiguration | ShopifyConfiguration | SlackConfiguration | TwitterConfiguration | WebflowConfiguration;

export type IntegrationIgnoreConfiguration = {
  __typename?: 'IntegrationIgnoreConfiguration';
  /** integration key */
  key?: Maybe<Scalars['String']['output']>;
};

export type Invitation = {
  __typename?: 'Invitation';
  /** desks belongs to the user */
  desks: Array<Desk>;
  /** email */
  email: Scalars['String']['output'];
  /** invitation id */
  id: Scalars['String']['output'];
  /** role */
  role: Scalars['String']['output'];
};

export type Layout = {
  __typename?: 'Layout';
  /** layout data */
  data?: Maybe<Scalars['JSON']['output']>;
  /** layout id */
  id: Scalars['ID']['output'];
  /** layout name */
  name: Scalars['String']['output'];
  /** layout preview image */
  preview?: Maybe<Image>;
  /** template id */
  template: Scalars['String']['output'];
};

export type Link = {
  __typename?: 'Link';
  /** link id */
  id: Scalars['ID']['output'];
  /** determinate the link is a reference(internal) or not */
  reference: Scalars['Boolean']['output'];
  /**
   * link source, e.g.
   * builder, editor
   */
  source: LinkSource;
  target?: Maybe<LinkTargetUnion>;
  value?: Maybe<Scalars['String']['output']>;
};

/** Source */
export enum LinkSource {
  /** builder link */
  Builder = 'builder',
  /** editor(article) link */
  Editor = 'editor'
}

/** Target */
export enum LinkTarget {
  /** Article */
  Article = 'article',
  /** Desk */
  Desk = 'desk',
  /** Page */
  Page = 'page',
  /** Tag */
  Tag = 'tag',
  /** User */
  User = 'user'
}

export type LinkTargetUnion = Article | Desk | Page | Tag | User;

export type LinkedInAuthors = {
  __typename?: 'LinkedInAuthors';
  /** linkedin author id */
  id: Scalars['String']['output'];
  /** linkedin author name */
  name: Scalars['String']['output'];
  /** linkedin author thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type LinkedInConfiguration = {
  __typename?: 'LinkedInConfiguration';
  /** linkedin authors */
  authors: Array<LinkedInAuthors>;
  /** linkedin email */
  email: Scalars['String']['output'];
  /** linkedin user id */
  id: Scalars['String']['output'];
  /** linkedin page name */
  name: Scalars['String']['output'];
  /** linkedin page thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type Linter = {
  __typename?: 'Linter';
  /** linter create time */
  created_at: Scalars['DateTime']['output'];
  /** linter description */
  description: Scalars['String']['output'];
  /** linter id */
  id: Scalars['ID']['output'];
  /** linter prompt */
  prompt: Scalars['String']['output'];
  /** linter title */
  title: Scalars['String']['output'];
  /** linter last update time */
  updated_at: Scalars['DateTime']['output'];
};

/** A paginated list of Linter edges. */
export type LinterConnection = {
  __typename?: 'LinterConnection';
  /** A list of Linter edges. */
  edges: Array<LinterEdge>;
  /** Pagination information about the list of edges. */
  pageInfo: PageInfo;
};

/** An edge that contains a node of type Linter and a cursor. */
export type LinterEdge = {
  __typename?: 'LinterEdge';
  /** A unique cursor that can be used for pagination. */
  cursor: Scalars['String']['output'];
  /** The Linter node. */
  node: Linter;
};

export type LiveUpdate = {
  __typename?: 'LiveUpdate';
  article_created?: Maybe<Article>;
  article_deleted?: Maybe<Article>;
  article_thread_created?: Maybe<ArticleThread>;
  article_thread_note_created?: Maybe<ArticleThreadNote>;
  article_thread_note_deleted?: Maybe<ArticleThreadNote>;
  article_thread_note_updated?: Maybe<ArticleThreadNote>;
  article_thread_resolved?: Maybe<ArticleThread>;
  article_thread_updated?: Maybe<ArticleThread>;
  article_updated?: Maybe<Article>;
  design_updated?: Maybe<Design>;
  desk_created?: Maybe<Desk>;
  desk_deleted?: Maybe<Desk>;
  desk_updated?: Maybe<Desk>;
  integration_updated?: Maybe<Integration>;
  invitation_created?: Maybe<Invitation>;
  invitation_deleted?: Maybe<Invitation>;
  invitation_updated?: Maybe<Invitation>;
  layout_created?: Maybe<Layout>;
  layout_deleted?: Maybe<Layout>;
  layout_updated?: Maybe<Layout>;
  page_created?: Maybe<Page>;
  page_deleted?: Maybe<Page>;
  page_updated?: Maybe<Page>;
  release_created?: Maybe<Release>;
  release_updated?: Maybe<Release>;
  site_updated?: Maybe<Site>;
  stage_created?: Maybe<Stage>;
  stage_deleted?: Maybe<Stage>;
  stage_updated?: Maybe<Stage>;
  tag_created?: Maybe<Tag>;
  tag_deleted?: Maybe<Tag>;
  tag_updated?: Maybe<Tag>;
  user_created?: Maybe<User>;
  user_deleted?: Maybe<User>;
  user_updated?: Maybe<User>;
};

export type Media = {
  __typename?: 'Media';
  /** image blurhash value */
  blurhash?: Maybe<Scalars['String']['output']>;
  /** media height */
  height: Scalars['Int']['output'];
  key: Scalars['ID']['output'];
  /** media mime type */
  mime: Scalars['String']['output'];
  /** media size */
  size: Scalars['Int']['output'];
  /** media url */
  url: Scalars['String']['output'];
  /** media width */
  width: Scalars['Int']['output'];
};

export type MoveArticleAfterInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** target article id */
  target_id: Scalars['ID']['input'];
};

export type MoveArticleBeforeInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** target article id */
  target_id: Scalars['ID']['input'];
};

export type MoveArticleToDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input'];
  /** article id */
  id: Scalars['ID']['input'];
};

export type MoveDeskAfterInput = {
  /** desk id */
  id: Scalars['ID']['input'];
  /** target desk id */
  target_id: Scalars['ID']['input'];
};

export type MoveDeskBeforeInput = {
  /** desk id */
  id: Scalars['ID']['input'];
  /** target desk id */
  target_id: Scalars['ID']['input'];
};

export type MoveDeskInput = {
  after_id?: InputMaybe<Scalars['ID']['input']>;
  before_id?: InputMaybe<Scalars['ID']['input']>;
  id: Scalars['ID']['input'];
  target_id?: InputMaybe<Scalars['ID']['input']>;
};

export type MovePageAfterInput = {
  /** page id */
  id: Scalars['ID']['input'];
  /** target page id */
  target_id: Scalars['ID']['input'];
};

export type MovePageBeforeInput = {
  /** page id */
  id: Scalars['ID']['input'];
  /** target page id */
  target_id: Scalars['ID']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** activate a specific integration */
  activateIntegration: Integration;
  /** activate the Webflow integration */
  activateWebflow: Scalars['Boolean']['output'];
  /** activate the WordPress integration */
  activateWordPress: Scalars['Boolean']['output'];
  /** add author to article */
  addAuthorToArticle: Article;
  /** add a slack channel as a notification channel for article updates */
  addSlackChannels: Integration;
  /** add tag to article */
  addTagToArticle: Article;
  applyCouponCodeToAppSubscription: Scalars['Boolean']['output'];
  applyDealFuelCode: Scalars['Boolean']['output'];
  applyViededingueCode: Scalars['Boolean']['output'];
  /** manually assign a subscription */
  assignSubscriberSubscription: Scalars['Boolean']['output'];
  /** assign an user to specific desk */
  assignUserToDesk: User;
  cancelAppSubscription: Scalars['Boolean']['output'];
  /** @deprecated No longer supported */
  cancelAppSubscriptionFreeTrial: Scalars['Boolean']['output'];
  /** cancel an existing subscription */
  cancelSubscriberSubscription: Scalars['Boolean']['output'];
  /** update account email */
  changeAccountEmail: User;
  /** update password */
  changeAccountPassword: Scalars['Boolean']['output'];
  /** change article stage */
  changeArticleStage: Article;
  /**
   * change an existing subscription for the subscriber,
   * the price_id can be found on siteSubscriptionInfo query
   */
  changeSubscriberSubscription: Scalars['Boolean']['output'];
  /** change user role */
  changeUserRole: User;
  /** change user role for testing purpose */
  changeUserRoleForTesting: User;
  checkCustomDomainAvailability: CheckCustomDomainAvailabilityResponse;
  checkCustomDomainDnsStatus: CustomDomainDnsStatus;
  /** Checks whether an email is being used by an existing user in Storipress */
  checkEmailExist: Scalars['Boolean']['output'];
  checkProphetRemaining: Scalars['Int']['output'];
  /** check whether Stripe Connect is connected */
  checkStripeConnectConnected: Scalars['Boolean']['output'];
  /** clear static site cache */
  clearSiteCache: Scalars['Boolean']['output'];
  confirmCustomDomain: Scalars['Boolean']['output'];
  /** confirm account email */
  confirmEmail: Scalars['Boolean']['output'];
  confirmProphetCheckout?: Maybe<ConfirmProphetCheckoutResponse>;
  /** initiate OAuth for HubSpot and return the redirect URL */
  connectHubSpot: Scalars['String']['output'];
  /** initiate OAuth for Webflow and return the redirect URL */
  connectWebflow: Scalars['String']['output'];
  createAppSubscription: Scalars['Boolean']['output'];
  /** create article */
  createArticle: Article;
  /** create article's thread */
  createArticleThread: ArticleThread;
  /** create a new custom editor block */
  createBlock: Block;
  /** create new custom field */
  createCustomField: CustomField;
  /** create new custom field group */
  createCustomFieldGroup: CustomFieldGroup;
  /** create new custom field value */
  createCustomFieldValue: CustomFieldValue;
  /** create new desk */
  createDesk: Desk;
  /** create an invitation */
  createInvitation: Scalars['Boolean']['output'];
  /** create a new layout */
  createLayout: Layout;
  /** create a new link */
  createLink: Link;
  /** create a new linter */
  createLinter: Linter;
  /** add note to article thread */
  createNote: ArticleThreadNote;
  /** create a new page */
  createPage: Page;
  /** create a new redirection */
  createRedirection: Redirection;
  /** create new scraper */
  createScraper: Scalars['String']['output'];
  /** create new article from scraper */
  createScraperArticle: Array<ScraperArticle>;
  /** create new scraper selector */
  createScraperSelector: ScraperSelector;
  /** create new publication */
  createSite: Scalars['String']['output'];
  /** create new stage */
  createStage: Stage;
  /**
   * create a new subscription for the subscriber,
   * the price_id can be found on siteSubscriptionInfo query
   */
  createSubscriberSubscription: Scalars['Boolean']['output'];
  /** create a new tag */
  createTag: Tag;
  createTrialAppSubscription: Scalars['Boolean']['output'];
  /** create webflow collection */
  createWebflowCollection: Scalars['Boolean']['output'];
  /** deactivates a specific integration */
  deactivateIntegration: Integration;
  /** deactivate the Webflow integration */
  deactivateWebflow: Scalars['Boolean']['output'];
  /** deactivate the WordPress integration */
  deactivateWordPress: Scalars['Boolean']['output'];
  /** delete account */
  deleteAccount: Scalars['Boolean']['output'];
  /** delete article */
  deleteArticle: Article;
  /** delete custom block */
  deleteBlock: Block;
  /** delete a custom field */
  deleteCustomField: CustomField;
  /** delete a custom field group */
  deleteCustomFieldGroup: CustomFieldGroup;
  /** delete a custom field value */
  deleteCustomFieldValue: CustomFieldValue;
  /** delete a desk */
  deleteDesk: Desk;
  /** delete a layout */
  deleteLayout: Layout;
  /** delete a linter */
  deleteLinter: Linter;
  /** delete article thread note */
  deleteNote: ArticleThreadNote;
  /** delete a page */
  deletePage: Page;
  /** delete a redirection */
  deleteRedirection: Redirection;
  /** delete scraper article */
  deleteScraperArticle: ScraperArticle;
  /** delete scraper selector */
  deleteScraperSelector: ScraperSelector;
  /** delete an existing publication */
  deleteSite: Scalars['Boolean']['output'];
  /** delete publication data */
  deleteSiteContent: Scalars['Boolean']['output'];
  /** Remove a channel from Slack notifications */
  deleteSlackChannels: Integration;
  /** delete a stage */
  deleteStage: Stage;
  /** delete existing subscribers */
  deleteSubscribers: Scalars['Boolean']['output'];
  /** delete a tag */
  deleteTag: Tag;
  /** delete a user */
  deleteUser: User;
  /** disable custom domain */
  disableCustomDomain: Site;
  /**
   * disable publication subscription
   * @deprecated No longer supported
   */
  disableSubscription: Site;
  /** disconnect HubSpot integration */
  disconnectHubSpot: Scalars['Boolean']['output'];
  /** disconnect specific integration */
  disconnectIntegration: Integration;
  disconnectParagon: Scalars['Boolean']['output'];
  /** disconnect stripe connect */
  disconnectStripeConnect: Scalars['Boolean']['output'];
  /** disconnect Webflow integration */
  disconnectWebflow: Scalars['Boolean']['output'];
  /** disconnect WordPress integration */
  disconnectWordPress: Scalars['Boolean']['output'];
  /** duplicate an article */
  duplicateArticle: Article;
  /** enable custom domain */
  enableCustomDomain: Site;
  /** export publication data */
  exportSiteContent: Scalars['JSON']['output'];
  /** export subscribers to csv string */
  exportSubscribers: Scalars['String']['output'];
  /** send password recovery email */
  forgotPassword: Scalars['Boolean']['output'];
  /**
   * generate a new newstand key,
   * and this will automatically delete the old one
   */
  generateNewstandKey: Scalars['String']['output'];
  /** generate Paragon auth token */
  generateParagonToken: Scalars['String']['output'];
  /** get slack channels list */
  getSlackChannelsList: Array<SlackChannel>;
  /** user hide current request publication */
  hidePublication: Scalars['Boolean']['output'];
  /** user impersonate */
  impersonate?: Maybe<Scalars['String']['output']>;
  /** @deprecated not works as expected */
  importSiteContent: Scalars['Boolean']['output'];
  /** import content from wordpress */
  importSiteContentFromWordPress: Scalars['Boolean']['output'];
  /** import subscriber from csv file */
  importSubscribersFromCsvFile: Scalars['Boolean']['output'];
  initializeCustomDomain: CustomDomainDnsStatus;
  initializeSite: Site;
  /** inject shopify theme template */
  injectShopifyThemeTemplate: Scalars['Boolean']['output'];
  /** launch publication subscription */
  launchSubscription: Site;
  /** user leave current request publication */
  leavePublication: Scalars['Boolean']['output'];
  /** @deprecated invalid api in manager v2 */
  makeStageDefault: Stage;
  /** move article order after target article id */
  moveArticleAfter: Scalars['Boolean']['output'];
  /** move article order before target article id */
  moveArticleBefore: Scalars['Boolean']['output'];
  /** move article to another desk */
  moveArticleToDesk: Article;
  moveDesk: Desk;
  /** move desk order after target desk id */
  moveDeskAfter: Desk;
  /** move desk order before target desk id */
  moveDeskBefore: Desk;
  /** move page order after target page id */
  movePageAfter: Page;
  /** move page order before target page id */
  movePageBefore: Page;
  /** opt in the WordPress feature */
  optInWordPressFeature: Scalars['Boolean']['output'];
  /** opt out the WordPress feature */
  optOutWordPressFeature: Scalars['Boolean']['output'];
  previewAppSubscription: PreviewAppSubscriptionType;
  /** publish(schedule) an article */
  publishArticle: Article;
  pullShopifyContent: Scalars['Boolean']['output'];
  pullShopifyCustomers: Scalars['Boolean']['output'];
  /** pull latest collections from Webflow */
  pullWebflowCollections: Array<WebflowCollection>;
  /** pull latest sites from Webflow */
  pullWebflowSites: Array<WebflowSite>;
  /** rebuild all sites */
  rebuildAllSites?: Maybe<Scalars['Boolean']['output']>;
  /** @deprecated No longer supported */
  refreshToken: AuthToken;
  /** remove author from article */
  removeAuthorFromArticle: Article;
  /** remove account avatar */
  removeAvatar: User;
  removeCustomDomain: Scalars['Boolean']['output'];
  /** remove all site template */
  removeSiteTemplate: Scalars['Boolean']['output'];
  /** remove tag from article */
  removeTagFromArticle: Article;
  requestAppSetupIntent: Scalars['String']['output'];
  /** request a presigned upload url for file upload */
  requestPresignedUploadURL: PresignedUploadUrl;
  /**
   * request a SetupIntent,
   * reference: https://stripe.com/docs/api/setup_intents
   */
  requestSetupIntent: Scalars['String']['output'];
  /** request a sign in to customer site */
  requestSignInSubscriber: Scalars['Boolean']['output'];
  /** start a stripe connect */
  requestStripeConnect: Scalars['String']['output'];
  /** resend confirmation email */
  resendConfirmEmail: Scalars['Boolean']['output'];
  /** resend an invitation email */
  resendInvitation: Invitation;
  /** reset account password */
  resetPassword: Scalars['Boolean']['output'];
  /** resolve(delete) article's thread */
  resolveArticleThread: ArticleThread;
  /** restore a deleted article */
  restoreArticle: Article;
  resumeAppSubscription: Scalars['Boolean']['output'];
  /** resume an existing subscription */
  resumeSubscriberSubscription: Scalars['Boolean']['output'];
  /** revoke an invitation */
  revokeInvitation: Invitation;
  /** revoke a manually created subscription */
  revokeSubscriberSubscription: Scalars['Boolean']['output'];
  /** remove user from desk */
  revokeUserFromDesk: User;
  /** run existing scraper */
  runScraper: Scraper;
  /** manually send article newsletter */
  sendArticleNewsletter: Article;
  /** send cold email to subscriber */
  sendColdEmailToSubscriber: Scalars['Boolean']['output'];
  /** setup shopify oauth */
  setupShopifyOauth: Scalars['Boolean']['output'];
  /** setup shopify redirections */
  setupShopifyRedirections: Scalars['Boolean']['output'];
  /** setup the WordPress integration */
  setupWordPress: Scalars['Boolean']['output'];
  /** sign an iframely request */
  signIframelySignature: Scalars['String']['output'];
  /** sign in to the app */
  signIn: AuthToken;
  /** sign up/in to customer site */
  signInLeakySubscriber: Scalars['String']['output'];
  /** sign in to customer site */
  signInSubscriber: Scalars['String']['output'];
  /** sign out of the app */
  signOut: Scalars['Boolean']['output'];
  /** sign out of the customer site */
  signOutSubscriber: Scalars['Boolean']['output'];
  /** sign up to the app */
  signUp: AuthToken;
  /** sign up to customer site */
  signUpSubscriber: Scalars['String']['output'];
  /** slug the provided value */
  sluggable: Scalars['String']['output'];
  /** move article order after target article id */
  sortArticleBy: Scalars['Boolean']['output'];
  /** start scraper articles transfer */
  startScraperTransfer: Scalars['Boolean']['output'];
  /** enable newsletter for target subscribers */
  subscribeSubscribers: Scalars['Boolean']['output'];
  /** get suggested article tags */
  suggestedArticleTag: Array<Scalars['String']['output']>;
  /** summarize article */
  summarizeArticleContent: Scalars['String']['output'];
  /** suspend an user */
  suspendUser: Array<User>;
  swapAppSubscription: Scalars['Boolean']['output'];
  /** Sync authors, desks and tags to Webflow site */
  syncContentToWebflow: Scalars['Boolean']['output'];
  /** sync target model to custom field group */
  syncGroupableToCustomFieldGroup: CustomFieldGroup;
  /** track subscriber activity */
  trackSubscriberActivity: Scalars['Boolean']['output'];
  transferDeskArticles: Scalars['Boolean']['output'];
  /** manually trigger article social sharing */
  triggerArticleSocialSharing: Scalars['Boolean']['output'];
  /** trigger a site build */
  triggerSiteBuild?: Maybe<Scalars['ID']['output']>;
  /** user unhide current request publication */
  unhidePublication: Scalars['Boolean']['output'];
  /** unpublish an article */
  unpublishArticle: Article;
  /** disable newsletter for target subscribers */
  unsubscribeSubscribers: Scalars['Boolean']['output'];
  /** unsuspend an user */
  unsuspendUser: Array<User>;
  updateAppPaymentMethod: Scalars['Boolean']['output'];
  updateAppSubscriptionQuantity: Scalars['Boolean']['output'];
  /** update an article data */
  updateArticle: Article;
  /** update article's author info */
  updateArticleAuthor: Article;
  /** update article's thread */
  updateArticleThread: ArticleThread;
  /** update an existing custom block data */
  updateBlock: Block;
  /** update an existing custom field data */
  updateCustomField: CustomField;
  /** update an existing custom field group */
  updateCustomFieldGroup: CustomFieldGroup;
  /** update an existing custom field value */
  updateCustomFieldValue: CustomFieldValue;
  /** update an existing design data */
  updateDesign: Design;
  /** update an existing desk data */
  updateDesk: Desk;
  /** update integration data */
  updateIntegration: Integration;
  /** update an existing layout data */
  updateLayout: Layout;
  /** update an existing linter */
  updateLinter: Linter;
  /** update article thread note */
  updateNote: ArticleThreadNote;
  /** update an existing page data */
  updatePage: Page;
  /** update subscriber payment method */
  updatePaymentMethod: Scalars['Boolean']['output'];
  /** update account profile */
  updateProfile: User;
  /** update an existing redirection data */
  updateRedirection: Redirection;
  /** update an existing release data */
  updateRelease: Release;
  /** update existing scraper */
  updateScraper: Scraper;
  /** update scraper article */
  updateScraperArticle: ScraperArticle;
  /** update publication data */
  updateSiteInfo: Site;
  /** update an existing stage data */
  updateStage: Stage;
  /** update an existing subscriber data */
  updateSubscriber: Subscriber;
  /** update publication subscription */
  updateSubscription: Site;
  /** update an existing tag data */
  updateTag: Tag;
  /**
   * update an user profile
   * @deprecated No longer supported
   */
  updateUser: User;
  /** update Webflow collection id */
  updateWebflowCollection: Scalars['Boolean']['output'];
  /** update Webflow collection mapping */
  updateWebflowCollectionMapping: Scalars['Boolean']['output'];
  /** update Webflow site domain */
  updateWebflowDomain: Scalars['Boolean']['output'];
  /** update Webflow site id */
  updateWebflowSite: Scalars['Boolean']['output'];
  /**
   * upload an image to specific article
   * @deprecated use uploadImage instead
   */
  uploadArticleImage: Scalars['String']['output'];
  /**
   * update user avatar
   * @deprecated use uploadImage instead
   */
  uploadAvatar: Scalars['String']['output'];
  /**
   * upload block preview image
   * @deprecated use uploadImage instead
   */
  uploadBlockPreview: Scalars['String']['output'];
  /** update an image */
  uploadImage: Media;
  /**
   * upload layout preview image
   * @deprecated use uploadImage instead
   */
  uploadLayoutPreview: Scalars['String']['output'];
  /**
   * upload site logo
   * @deprecated use uploadImage instead
   */
  uploadSiteLogo: Scalars['String']['output'];
  /** upload site template */
  uploadSiteTemplate: Array<SiteTemplate>;
  /**
   * upload subscriber avatar
   * @deprecated use uploadImage instead
   */
  uploadSubscriberAvatar: Scalars['String']['output'];
  /** verify subscriber email */
  verifySubscriberEmail: Scalars['Boolean']['output'];
};


export type MutationActivateIntegrationArgs = {
  key: Scalars['ID']['input'];
};


export type MutationAddAuthorToArticleArgs = {
  input: AddAuthorToArticleInput;
};


export type MutationAddSlackChannelsArgs = {
  input: AddSlackChannelsInput;
};


export type MutationAddTagToArticleArgs = {
  input: AddTagToArticleInput;
};


export type MutationApplyCouponCodeToAppSubscriptionArgs = {
  input?: InputMaybe<ApplyCouponCodeToAppSubscriptionInput>;
};


export type MutationApplyDealFuelCodeArgs = {
  input?: InputMaybe<ApplyDealFuelCodeInput>;
};


export type MutationApplyViededingueCodeArgs = {
  input?: InputMaybe<ApplyViededingueCodeInput>;
};


export type MutationAssignSubscriberSubscriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignUserToDeskArgs = {
  input: AssignUserToDeskInput;
};


export type MutationChangeAccountEmailArgs = {
  input: ChangeAccountEmailInput;
};


export type MutationChangeAccountPasswordArgs = {
  input: UpdateAccountPasswordInput;
};


export type MutationChangeArticleStageArgs = {
  input: ChangeArticleStageInput;
};


export type MutationChangeSubscriberSubscriptionArgs = {
  price_id: Scalars['String']['input'];
};


export type MutationChangeUserRoleArgs = {
  input: ChangeRoleInput;
};


export type MutationChangeUserRoleForTestingArgs = {
  input: ChangeRoleInput;
};


export type MutationCheckCustomDomainAvailabilityArgs = {
  input: CheckCustomDomainAvailabilityInput;
};


export type MutationCheckEmailExistArgs = {
  email: Scalars['EmailString']['input'];
};


export type MutationConfirmEmailArgs = {
  input: ConfirmEmailInput;
};


export type MutationConfirmProphetCheckoutArgs = {
  input?: InputMaybe<ConfirmProphetCheckoutInput>;
};


export type MutationCreateAppSubscriptionArgs = {
  input?: InputMaybe<CreateAppSubscriptionInput>;
};


export type MutationCreateArticleArgs = {
  input: CreateArticleInput;
};


export type MutationCreateArticleThreadArgs = {
  input: CreateArticleThreadInput;
};


export type MutationCreateBlockArgs = {
  input: CreateBlockInput;
};


export type MutationCreateCustomFieldArgs = {
  input: CreateCustomFieldInput;
};


export type MutationCreateCustomFieldGroupArgs = {
  input: CreateCustomFieldGroupInput;
};


export type MutationCreateCustomFieldValueArgs = {
  input: CreateCustomFieldValueInput;
};


export type MutationCreateDeskArgs = {
  input: CreateDeskInput;
};


export type MutationCreateInvitationArgs = {
  input: CreateInvitationInput;
};


export type MutationCreateLayoutArgs = {
  input: CreateLayoutInput;
};


export type MutationCreateLinkArgs = {
  input: CreateLinkInput;
};


export type MutationCreateLinterArgs = {
  input: CreateLinterInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationCreatePageArgs = {
  input: CreatePageInput;
};


export type MutationCreateRedirectionArgs = {
  input: CreateRedirectionInput;
};


export type MutationCreateScraperArticleArgs = {
  input: CreateScraperArticleInput;
};


export type MutationCreateScraperSelectorArgs = {
  input: CreateScraperSelectorInput;
};


export type MutationCreateSiteArgs = {
  input: CreateSiteInput;
};


export type MutationCreateStageArgs = {
  input: CreateStageInput;
};


export type MutationCreateSubscriberSubscriptionArgs = {
  price_id: Scalars['String']['input'];
};


export type MutationCreateTagArgs = {
  input: CreateTagInput;
};


export type MutationCreateWebflowCollectionArgs = {
  input: CreateWebflowCollectionInput;
};


export type MutationDeactivateIntegrationArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDeleteAccountArgs = {
  password: Scalars['String']['input'];
};


export type MutationDeleteArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteBlockArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomFieldArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomFieldGroupArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomFieldValueArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteDeskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLayoutArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteLinterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteRedirectionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteScraperArticleArgs = {
  input: DeleteScraperArticleInput;
};


export type MutationDeleteScraperSelectorArgs = {
  input: DeleteScraperSelectorInput;
};


export type MutationDeleteSiteArgs = {
  password: Scalars['String']['input'];
};


export type MutationDeleteSlackChannelsArgs = {
  input: DeleteSlackChannelsInput;
};


export type MutationDeleteStageArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDisconnectIntegrationArgs = {
  key: Scalars['ID']['input'];
};


export type MutationDuplicateArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEnableCustomDomainArgs = {
  input: EnableCustomDomainInput;
};


export type MutationForgotPasswordArgs = {
  email: Scalars['EmailString']['input'];
};


export type MutationHidePublicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationImpersonateArgs = {
  email: Scalars['EmailString']['input'];
  password: Scalars['String']['input'];
};


export type MutationImportSiteContentArgs = {
  input: ImportSiteContentInput;
};


export type MutationImportSiteContentFromWordPressArgs = {
  input: ImportSiteContentFromWordPressInput;
};


export type MutationImportSubscribersFromCsvFileArgs = {
  input: ImportSubscribersFromCsvFileInput;
};


export type MutationInitializeCustomDomainArgs = {
  input: InitializeCustomDomainInput;
};


export type MutationInitializeSiteArgs = {
  input: InitializeSiteInput;
};


export type MutationLeavePublicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMakeStageDefaultArgs = {
  id: Scalars['ID']['input'];
};


export type MutationMoveArticleAfterArgs = {
  input: MoveArticleAfterInput;
};


export type MutationMoveArticleBeforeArgs = {
  input: MoveArticleBeforeInput;
};


export type MutationMoveArticleToDeskArgs = {
  input: MoveArticleToDeskInput;
};


export type MutationMoveDeskArgs = {
  input: MoveDeskInput;
};


export type MutationMoveDeskAfterArgs = {
  input: MoveDeskAfterInput;
};


export type MutationMoveDeskBeforeArgs = {
  input: MoveDeskBeforeInput;
};


export type MutationMovePageAfterArgs = {
  input: MovePageAfterInput;
};


export type MutationMovePageBeforeArgs = {
  input: MovePageBeforeInput;
};


export type MutationOptInWordPressFeatureArgs = {
  input: OptInWordPressFeatureInput;
};


export type MutationOptOutWordPressFeatureArgs = {
  input: OptOutWordPressFeatureInput;
};


export type MutationPreviewAppSubscriptionArgs = {
  input: PreviewAppSubscriptionInput;
};


export type MutationPublishArticleArgs = {
  input: PublishArticleInput;
};


export type MutationPullWebflowCollectionsArgs = {
  refresh?: Scalars['Boolean']['input'];
};


export type MutationPullWebflowSitesArgs = {
  refresh?: Scalars['Boolean']['input'];
};


export type MutationRemoveAuthorFromArticleArgs = {
  input: RemoveAuthorFromArticleInput;
};


export type MutationRemoveTagFromArticleArgs = {
  input: RemoveTagFromArticleInput;
};


export type MutationRequestAppSetupIntentArgs = {
  input?: InputMaybe<RequestAppSetupIntentInput>;
};


export type MutationRequestPresignedUploadUrlArgs = {
  md5?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRequestSignInSubscriberArgs = {
  input: RequestSignInSubscriberInput;
};


export type MutationResendInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationResolveArticleThreadArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRestoreArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeInvitationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeSubscriberSubscriptionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRevokeUserFromDeskArgs = {
  input: RevokeUserFromDeskInput;
};


export type MutationRunScraperArgs = {
  input: RunScraperInput;
};


export type MutationSendArticleNewsletterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSendColdEmailToSubscriberArgs = {
  input: SendColdEmailToSubscriberInput;
};


export type MutationSetupShopifyOauthArgs = {
  code: Scalars['String']['input'];
};


export type MutationSetupWordPressArgs = {
  code: Scalars['String']['input'];
};


export type MutationSignIframelySignatureArgs = {
  params: Scalars['JSON']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['EmailString']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignInLeakySubscriberArgs = {
  input: SignInLeakySubscriberInput;
};


export type MutationSignInSubscriberArgs = {
  token: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  input: SignUpInput;
};


export type MutationSignUpSubscriberArgs = {
  input: SignUpSubscriberInput;
};


export type MutationSluggableArgs = {
  value: Scalars['String']['input'];
};


export type MutationSortArticleByArgs = {
  input: SortArticleByInput;
};


export type MutationStartScraperTransferArgs = {
  token: Scalars['String']['input'];
};


export type MutationSubscribeSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationSuggestedArticleTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSummarizeArticleContentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSuspendUserArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationSwapAppSubscriptionArgs = {
  input?: InputMaybe<SwapAppSubscriptionInput>;
};


export type MutationSyncGroupableToCustomFieldGroupArgs = {
  input: SyncGroupableToCustomFieldGroupInput;
};


export type MutationTrackSubscriberActivityArgs = {
  input: TrackSubscriberActivityInput;
};


export type MutationTransferDeskArticlesArgs = {
  input: TransferDeskArticlesInput;
};


export type MutationTriggerArticleSocialSharingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationTriggerSiteBuildArgs = {
  input?: InputMaybe<TriggerSiteBuildInput>;
};


export type MutationUnhidePublicationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnpublishArticleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUnsubscribeSubscribersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationUnsuspendUserArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type MutationUpdateAppPaymentMethodArgs = {
  input?: InputMaybe<UpdateAppPaymentMethodInput>;
};


export type MutationUpdateAppSubscriptionQuantityArgs = {
  input?: InputMaybe<UpdateAppSubscriptionQuantityInput>;
};


export type MutationUpdateArticleArgs = {
  input: UpdateArticleInput;
};


export type MutationUpdateArticleAuthorArgs = {
  input: UpdateArticleAuthorInput;
};


export type MutationUpdateArticleThreadArgs = {
  input: UpdateArticleThreadInput;
};


export type MutationUpdateBlockArgs = {
  input: UpdateBlockInput;
};


export type MutationUpdateCustomFieldArgs = {
  input: UpdateCustomFieldInput;
};


export type MutationUpdateCustomFieldGroupArgs = {
  input: UpdateCustomFieldGroupInput;
};


export type MutationUpdateCustomFieldValueArgs = {
  input: UpdateCustomFieldValueInput;
};


export type MutationUpdateDesignArgs = {
  input: UpdateDesignInput;
};


export type MutationUpdateDeskArgs = {
  input: UpdateDeskInput;
};


export type MutationUpdateIntegrationArgs = {
  input: UpdateIntegrationInput;
};


export type MutationUpdateLayoutArgs = {
  input: UpdateLayoutInput;
};


export type MutationUpdateLinterArgs = {
  input: UpdateLinterInput;
};


export type MutationUpdateNoteArgs = {
  input: UpdateNoteInput;
};


export type MutationUpdatePageArgs = {
  input: UpdatePageInput;
};


export type MutationUpdatePaymentMethodArgs = {
  pm_id: Scalars['String']['input'];
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateRedirectionArgs = {
  input: UpdateRedirectionInput;
};


export type MutationUpdateReleaseArgs = {
  input: UpdateReleaseInput;
};


export type MutationUpdateScraperArgs = {
  input: UpdateScraperInput;
};


export type MutationUpdateScraperArticleArgs = {
  input: UpdateScraperArticleInput;
};


export type MutationUpdateSiteInfoArgs = {
  input: UpdateSiteInput;
};


export type MutationUpdateStageArgs = {
  input: UpdateStageInput;
};


export type MutationUpdateSubscriberArgs = {
  input: UpdateSubscriberInput;
};


export type MutationUpdateSubscriptionArgs = {
  input: EnableSubscriptionInput;
};


export type MutationUpdateTagArgs = {
  input: UpdateTagInput;
};


export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateWebflowCollectionArgs = {
  input: UpdateWebflowCollectionInput;
};


export type MutationUpdateWebflowCollectionMappingArgs = {
  input: UpdateWebflowCollectionMappingInput;
};


export type MutationUpdateWebflowDomainArgs = {
  input: UpdateWebflowDomainInput;
};


export type MutationUpdateWebflowSiteArgs = {
  input: UpdateWebflowSiteInput;
};


export type MutationUploadArticleImageArgs = {
  input: UploadArticleImageInput;
};


export type MutationUploadAvatarArgs = {
  input: UploadAvatarInput;
};


export type MutationUploadBlockPreviewArgs = {
  input: UploadBlockPreviewInput;
};


export type MutationUploadImageArgs = {
  input: UploadImageInput;
};


export type MutationUploadLayoutPreviewArgs = {
  input: UploadLayoutPreviewInput;
};


export type MutationUploadSiteLogoArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationUploadSiteTemplateArgs = {
  input: UploadSiteTemplateInput;
};


export type MutationUploadSubscriberAvatarArgs = {
  input: UploadSubscriberAvatarInput;
};


export type MutationVerifySubscriberEmailArgs = {
  token: Scalars['String']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  /** notification meta data */
  data?: Maybe<Scalars['JSON']['output']>;
  /** notification id */
  id: Scalars['ID']['output'];
  /** notification create time */
  occurred_at: Scalars['DateTime']['output'];
  /** notification state */
  type: Scalars['String']['output'];
};

export type OptInWordPressFeatureInput = {
  /** feature Type */
  key: WordPressOptionalFeatureType;
};

export type OptOutWordPressFeatureInput = {
  /** feature Type */
  key: WordPressOptionalFeatureType;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String']['input'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Aggregate functions when ordering by a relation without specifying a column. */
export enum OrderByRelationAggregateFunction {
  /** Amount of items. */
  Count = 'COUNT'
}

/** Aggregate functions when ordering by a relation that may specify a column. */
export enum OrderByRelationWithColumnAggregateFunction {
  /** Average. */
  Avg = 'AVG',
  /** Amount of items. */
  Count = 'COUNT',
  /** Maximum. */
  Max = 'MAX',
  /** Minimum. */
  Min = 'MIN',
  /** Sum. */
  Sum = 'SUM'
}

export type Page = {
  __typename?: 'Page';
  /** live content */
  current?: Maybe<Scalars['JSON']['output']>;
  /** draft content */
  draft?: Maybe<Scalars['JSON']['output']>;
  /** page id */
  id: Scalars['ID']['output'];
  /** layout id */
  layout?: Maybe<Layout>;
  /** page order */
  order: Scalars['Int']['output'];
  /** seo meta data */
  seo?: Maybe<Scalars['JSON']['output']>;
  /**
   * page title,
   * e.g. About Us
   */
  title: Scalars['String']['output'];
};

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** Number of nodes in the current page. */
  count: Scalars['Int']['output'];
  /** Index of the current page. */
  currentPage: Scalars['Int']['output'];
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output'];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars['String']['output']>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars['Int']['output'];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int']['output'];
  /** Index of the current page. */
  currentPage: Scalars['Int']['output'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']['output']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean']['output'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']['output']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int']['output'];
  /** Number of items per page. */
  perPage: Scalars['Int']['output'];
  /** Number of total available items. */
  total: Scalars['Int']['output'];
};

export type PreviewAppSubscriptionInput = {
  price_id: Scalars['String']['input'];
  promotion_code?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type PreviewAppSubscriptionType = {
  __typename?: 'PreviewAppSubscriptionType';
  credit: Scalars['String']['output'];
  discount: Scalars['String']['output'];
  subtotal: Scalars['String']['output'];
  tax: Scalars['String']['output'];
  total: Scalars['String']['output'];
};

export type ProphetArticleStatistic = {
  __typename?: 'ProphetArticleStatistic';
  article: Article;
  data: ProphetArticleStatisticData;
};

export type ProphetArticleStatisticData = {
  __typename?: 'ProphetArticleStatisticData';
  avg_scrolled: Scalars['Float']['output'];
  email_collected: Scalars['Int']['output'];
  email_collected_ratio: Scalars['Float']['output'];
  read?: Maybe<Scalars['Int']['output']>;
  unique_read?: Maybe<Scalars['Int']['output']>;
  unique_viewed?: Maybe<Scalars['Int']['output']>;
  viewed: Scalars['Int']['output'];
};

export enum ProphetArticleStatisticSortBy {
  /** Email submit % */
  EmailSubmit = 'email_submit',
  /** Emails collected */
  EmailsCollected = 'emails_collected',
  /** None */
  None = 'none',
  /** Reads */
  Reads = 'reads',
  /** Scroll Depth */
  ScrollDepth = 'scroll_depth'
}

export type ProphetDashboardChart = {
  __typename?: 'ProphetDashboardChart';
  data: ProphetDashboardData;
  date: Scalars['Date']['output'];
};

export type ProphetDashboardData = {
  __typename?: 'ProphetDashboardData';
  article_avg_scrolled: Scalars['Float']['output'];
  article_read?: Maybe<Scalars['Int']['output']>;
  article_unique_read?: Maybe<Scalars['Int']['output']>;
  article_unique_viewed: Scalars['Int']['output'];
  article_viewed: Scalars['Int']['output'];
  email_collected: Scalars['Int']['output'];
  email_collected_ratio: Scalars['Float']['output'];
  email_replied?: Maybe<Scalars['Int']['output']>;
  email_replied_ratio?: Maybe<Scalars['Float']['output']>;
  email_sent?: Maybe<Scalars['Int']['output']>;
};

export type ProphetMonthOnMonth = {
  __typename?: 'ProphetMonthOnMonth';
  data?: Maybe<ProphetDashboardData>;
  month: Scalars['Int']['output'];
  year: Scalars['Int']['output'];
};

/** subset of site(publication) */
export type Publication = {
  __typename?: 'Publication';
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>;
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output'];
  /** publication description */
  description?: Maybe<Scalars['String']['output']>;
  /** publication favicon */
  favicon?: Maybe<Scalars['String']['output']>;
  /** publication id */
  id: Scalars['ID']['output'];
  /** publication name */
  name: Scalars['String']['output'];
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output'];
};

export type PublishArticleInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /**
   * set article stage to live(reviewed),
   * published_at will not be changed
   */
  now?: InputMaybe<Scalars['Boolean']['input']>;
  /** publish time(ISO 8601 format) */
  time?: InputMaybe<Scalars['String']['input']>;
  /**
   * set article published_at to
   * server current time
   */
  useServerCurrentTime?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Query = {
  __typename?: 'Query';
  appSubscriptionPlans: Array<AppSubscriptionPlans>;
  /** get specific article */
  article?: Maybe<Article>;
  articleDecryptKey?: Maybe<Scalars['String']['output']>;
  /** get article typesense search key */
  articleSearchKey: Scalars['String']['output'];
  /** using pagination to fetch articles */
  articles: ArticlePaginator;
  /**
   * fetch articles apply one of following constraints(mutually exclusive):
   * - schedule/publish time is between `from` and `to`
   * - unscheduled articles
   * @deprecated use articles query
   */
  articlesAll: Array<Article>;
  articlesCursor: ArticleConnection;
  billing: Billing;
  /** get specific block */
  block?: Maybe<Block>;
  /** fetch blocks */
  blocks: BlockPaginator;
  /** fetch credits */
  credits: CreditPaginator;
  creditsOverview: Array<CreditsOverview>;
  customFieldGroup?: Maybe<CustomFieldGroup>;
  customFieldGroups: CustomFieldGroupPaginator;
  /** get specific design */
  design?: Maybe<Design>;
  /** fetch designs */
  designs: Array<Design>;
  desk?: Maybe<Desk>;
  /** fetch desks */
  desks: Array<Desk>;
  /** get specific email */
  email?: Maybe<Email>;
  facebookPages: Array<FacebookSearchPage>;
  /** whether the Gmail OAuth has been completed or not */
  gmailAuthorized: Scalars['Boolean']['output'];
  /** whether the HubSpot OAuth has been completed or not */
  hubSpotAuthorized: Scalars['Boolean']['output'];
  /** get HubSpot information */
  hubSpotInfo: HubSpotInfo;
  /**
   * make a iframely request for specific url
   * @deprecated use signIframelySignature mutation
   */
  iframelyIframely: Scalars['JSON']['output'];
  /** image info */
  image: Image;
  /** fetch integrations */
  integrations: Array<Integration>;
  invitations: Array<Invitation>;
  /** get specific layout */
  layout?: Maybe<Layout>;
  /** fetch layouts */
  layouts: Array<Layout>;
  /** fetch link */
  link: Link;
  /** fetch linters */
  linters: LinterConnection;
  /** account profile */
  me: User;
  /** media info */
  media: Media;
  /** fetch notifications */
  notifications: Array<Notification>;
  /** get specific page */
  page?: Maybe<Page>;
  /** fetch pages */
  pages: Array<Page>;
  /** prophet article statistics */
  prophetArticleStatistics: Array<ProphetArticleStatistic>;
  /** prophet dashboard chart data points */
  prophetDashboardChart: Array<ProphetDashboardChart>;
  /** prophet month on month info */
  prophetMonthOnMonth: Array<ProphetMonthOnMonth>;
  /** all publications owned by the account */
  publications: Array<Publication>;
  /** fetch redirections */
  redirections: Array<Redirection>;
  /** get specific release */
  release?: Maybe<Release>;
  /** fetch releases */
  releases: ReleasePaginator;
  /** fetch roles */
  roles: Array<Role>;
  /** get specific scraper */
  scraper?: Maybe<Scraper>;
  /** list pending invite users */
  scraperPendingInviteUsers: Array<Scalars['String']['output']>;
  /** fetch scrapers */
  scrapers: ScraperPaginator;
  searchShopifyProducts: ShopifyCollection;
  shopifyProducts: ShopifyCollection;
  /** get publication data */
  site: Site;
  /** get publication subscription info */
  siteSubscriptionInfo: SiteSubscriptionInfo;
  siteTemplates: Array<SiteTemplate>;
  /** fetch stages */
  stages: Array<Stage>;
  /** get specific subscriber */
  subscriber?: Maybe<Subscriber>;
  subscriberPainPoints: Array<SubscriberPainPoint>;
  /** get subscriber profile for current request user */
  subscriberProfile?: Maybe<Subscriber>;
  /** fetch subscribers */
  subscribers: SubscriberPaginator;
  /** publication subscription subscribers and revenue info */
  subscriptionGraphs: SubscriptionGraphs;
  /** publication subscription overview info */
  subscriptionOverview: SubscriptionOverview;
  /** get specific tag */
  tag?: Maybe<Tag>;
  /** fetch tags */
  tags: Array<Tag>;
  /** trigger a download for specific image */
  unsplashDownload: Scalars['String']['output'];
  /** random list some images */
  unsplashList: Scalars['JSON']['output'];
  /** search unsplash image */
  unsplashSearch: Scalars['JSON']['output'];
  /** get specific user data */
  user?: Maybe<User>;
  /** fetch users */
  users: Array<User>;
  /** whether the Webflow OAuth has been completed or not */
  webflowAuthorized: Scalars['Boolean']['output'];
  /** get Webflow collection information */
  webflowCollection?: Maybe<WebflowCollection>;
  /** get all Webflow collections */
  webflowCollections: Array<WebflowCollection>;
  /** get Webflow information */
  webflowInfo: WebflowInfo;
  /** get all Webflow items for specific collection */
  webflowItems: Array<WebflowItem>;
  /** get Webflow onboarding status */
  webflowOnboarding: WebflowOnboarding;
  /** get all Webflow sites */
  webflowSites: Array<WebflowSite>;
  /** whether the WordPress connection has been completed or not */
  wordPressAuthorized: Scalars['Boolean']['output'];
  /** get WordPress information */
  wordPressInfo: WordPressInfo;
  /** all publications joined by the account */
  workspaces: Array<Workspace>;
};


export type QueryArticleArgs = {
  hasDesk?: InputMaybe<WhereConditions>;
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryArticleDecryptKeyArgs = {
  id: Scalars['ID']['input'];
};


export type QueryArticlesArgs = {
  desk?: InputMaybe<Scalars['ID']['input']>;
  desk_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  first?: Scalars['Int']['input'];
  hasDesk?: InputMaybe<WhereConditions>;
  page?: InputMaybe<Scalars['Int']['input']>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  scheduledRange?: InputMaybe<DateRange>;
  sortBy?: InputMaybe<Array<QueryArticlesSortByOrderByClause>>;
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryArticlesAllArgs = {
  hasDesk?: InputMaybe<WhereConditions>;
  range?: InputMaybe<DateRange>;
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryArticlesCursorArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  desk_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  first?: Scalars['Int']['input'];
  hasDesk?: InputMaybe<WhereConditions>;
  published?: InputMaybe<Scalars['Boolean']['input']>;
  scheduledRange?: InputMaybe<DateRange>;
  sortBy?: InputMaybe<Array<QueryArticlesCursorSortByOrderByClause>>;
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBlocksArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCreditsArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<CreditState>;
};


export type QueryCustomFieldGroupArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  key?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryCustomFieldGroupsArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryDesignArgs = {
  key: Scalars['ID']['input'];
};


export type QueryDeskArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryEmailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryFacebookPagesArgs = {
  keyword: Scalars['String']['input'];
};


export type QueryIframelyIframelyArgs = {
  input: IframelyIframelyInput;
};


export type QueryImageArgs = {
  key: Scalars['ID']['input'];
};


export type QueryLayoutArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLinkArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLintersArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: Scalars['Int']['input'];
};


export type QueryMediaArgs = {
  key: Scalars['ID']['input'];
};


export type QueryPageArgs = {
  id: Scalars['ID']['input'];
};


export type QueryProphetArticleStatisticsArgs = {
  desc?: Scalars['Boolean']['input'];
  sort_by?: ProphetArticleStatisticSortBy;
};


export type QueryReleaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReleasesArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryScraperArgs = {
  token: Scalars['String']['input'];
};


export type QueryScraperPendingInviteUsersArgs = {
  token: Scalars['String']['input'];
};


export type QueryScrapersArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerySearchShopifyProductsArgs = {
  keyword: Scalars['String']['input'];
};


export type QueryShopifyProductsArgs = {
  page_info?: InputMaybe<Scalars['String']['input']>;
};


export type QuerySiteTemplatesArgs = {
  type?: InputMaybe<TemplateType>;
};


export type QuerySubscriberArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubscriberPainPointsArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySubscribersArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  searchSortBy?: InputMaybe<Array<QuerySubscribersSearchSortByOrderByClause>>;
  sortBy?: InputMaybe<Array<QuerySubscribersSortByOrderByClause>>;
};


export type QueryTagArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUnsplashDownloadArgs = {
  id?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUnsplashListArgs = {
  page: Scalars['Int']['input'];
};


export type QueryUnsplashSearchArgs = {
  input: UnsplashSearchInput;
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  includeInvitations?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryWebflowCollectionArgs = {
  type: WebflowCollectionType;
};


export type QueryWebflowItemsArgs = {
  collection_id: Scalars['ID']['input'];
};

/** Allowed column names for Query.articlesCursor.sortBy. */
export enum QueryArticlesCursorSortByColumn {
  PublishedAt = 'PUBLISHED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/** Order by clause for Query.articlesCursor.sortBy. */
export type QueryArticlesCursorSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryArticlesCursorSortByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.articles.sortBy. */
export enum QueryArticlesSortByColumn {
  PublishedAt = 'PUBLISHED_AT',
  UpdatedAt = 'UPDATED_AT'
}

/** Order by clause for Query.articles.sortBy. */
export type QueryArticlesSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QueryArticlesSortByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.subscribers.searchSortBy. */
export enum QuerySubscribersSearchSortByColumn {
  Activity = 'ACTIVITY',
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  Revenue = 'REVENUE',
  SubscribedAt = 'SUBSCRIBED_AT'
}

/** Order by clause for Query.subscribers.searchSortBy. */
export type QuerySubscribersSearchSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QuerySubscribersSearchSortByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Allowed column names for Query.subscribers.sortBy. */
export enum QuerySubscribersSortByColumn {
  Activity = 'ACTIVITY',
  CreatedAt = 'CREATED_AT',
  Revenue = 'REVENUE',
  SubscribedAt = 'SUBSCRIBED_AT'
}

/** Order by clause for Query.subscribers.sortBy. */
export type QuerySubscribersSortByOrderByClause = {
  /** The column that is used for ordering. */
  column: QuerySubscribersSortByColumn;
  /** The direction that is used for ordering. */
  order: SortOrder;
};

export type Redirection = {
  __typename?: 'Redirection';
  /** redirection id */
  id: Scalars['ID']['output'];
  /** redirection path */
  path: Scalars['String']['output'];
  /** redirection target */
  target: Scalars['String']['output'];
};

export type Release = {
  __typename?: 'Release';
  /** release create time */
  created_at: Scalars['DateTime']['output'];
  /** release elapsed time */
  elapsed_time: Scalars['Int']['output'];
  /** release id */
  id: Scalars['ID']['output'];
  /** release meta data */
  meta?: Maybe<Scalars['JSON']['output']>;
  /** release state */
  state: ReleaseState;
  /** release update time */
  updated_at: Scalars['DateTime']['output'];
};

/** A paginated list of Release items. */
export type ReleasePaginator = {
  __typename?: 'ReleasePaginator';
  /** A list of Release items. */
  data: Array<Release>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** State */
export enum ReleaseState {
  /** the release was aborted by user */
  Aborted = 'aborted',
  /** the release was canceled by system, e.g. a new release is triggered */
  Canceled = 'canceled',
  /** generator is compressing the site data for uploading to our CDN servers */
  Compressing = 'compressing',
  /** the release was built successfully */
  Done = 'done',
  /** there is something wrong when building the site */
  Error = 'error',
  /** generator is building static site data */
  Generating = 'generating',
  /** generator is preparing the site data */
  Preparing = 'preparing',
  /** the release was still in queue, this is default state */
  Queued = 'queued',
  /** generator is uploading the archive file to our CDN servers */
  Uploading = 'uploading'
}

/** Type */
export enum ReleaseType {
  /** article type build */
  Article = 'article'
}

/** remove author from article form */
export type RemoveAuthorFromArticleInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** user id(author id) */
  user_id: Scalars['ID']['input'];
};

/** remove tag from article form */
export type RemoveTagFromArticleInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** tag id */
  tag_id: Scalars['ID']['input'];
};

export type RequestAppSetupIntentInput = {
  payment?: InputMaybe<Scalars['String']['input']>;
};

export type RequestSignInSubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input'];
  /** current url, used for redirect back */
  from: Scalars['String']['input'];
  /** http referer */
  referer: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  /** target account email */
  email: Scalars['String']['input'];
  /** link expire time */
  expired_at: Scalars['Int']['input'];
  /** new password */
  password: Scalars['String']['input'];
  /** link signature */
  signature: Scalars['String']['input'];
  /** identify token */
  token: Scalars['String']['input'];
};

export type RevenueGraph = {
  __typename?: 'RevenueGraph';
  /** date */
  date: Scalars['Date']['output'];
  /** month of the data */
  month: Scalars['Int']['output'];
  /** revenue */
  revenue: Scalars['String']['output'];
  /** year of the data */
  year: Scalars['Int']['output'];
};

export type RevokeUserFromDeskInput = {
  /** desk id */
  desk_id: Scalars['ID']['input'];
  /** user id */
  user_id: Scalars['ID']['input'];
};

export type Role = {
  __typename?: 'Role';
  /** role id */
  id: Scalars['ID']['output'];
  /** role level */
  level: Scalars['Float']['output'];
  /** role name */
  name: Scalars['String']['output'];
  /** role brief description */
  title: Scalars['String']['output'];
};

export type RunScraperInput = {
  /** scraper token */
  token: Scalars['String']['input'];
  /** scrape type */
  type: ScraperType;
};

/** The available SQL operators that are used to filter query results. */
export enum SqlOperator {
  /** Whether a value is within a range of values (`BETWEEN`) */
  Between = 'BETWEEN',
  /** Equal operator (`=`) */
  Eq = 'EQ',
  /** Greater than operator (`>`) */
  Gt = 'GT',
  /** Greater than or equal operator (`>=`) */
  Gte = 'GTE',
  /** Whether a value is within a set of values (`IN`) */
  In = 'IN',
  /** Whether a value is not null (`IS NOT NULL`) */
  IsNotNull = 'IS_NOT_NULL',
  /** Whether a value is null (`IS NULL`) */
  IsNull = 'IS_NULL',
  /** Simple pattern matching (`LIKE`) */
  Like = 'LIKE',
  /** Less than operator (`<`) */
  Lt = 'LT',
  /** Less than or equal operator (`<=`) */
  Lte = 'LTE',
  /** Not equal operator (`!=`) */
  Neq = 'NEQ',
  /** Whether a value is not within a range of values (`NOT BETWEEN`) */
  NotBetween = 'NOT_BETWEEN',
  /** Whether a value is not within a set of values (`NOT IN`) */
  NotIn = 'NOT_IN',
  /** Negation of simple pattern matching (`NOT LIKE`) */
  NotLike = 'NOT_LIKE'
}

export type Scraper = {
  __typename?: 'Scraper';
  /** scrapper articles */
  articles: ScraperArticlePaginator;
  /**
   * time that the scraper cancelled,
   * will only have value on user cancelled
   */
  cancelled_at?: Maybe<Scalars['DateTime']['output']>;
  /** arbitrary data */
  data?: Maybe<Scalars['JSON']['output']>;
  /** scraping failed articles */
  failed: Scalars['Int']['output'];
  /**
   * time that the scraper failed,
   * will only have value when something went wrong
   */
  failed_at?: Maybe<Scalars['DateTime']['output']>;
  /**
   * time that the scraper finished,
   * will only have value on successful execution
   */
  finished_at?: Maybe<Scalars['DateTime']['output']>;
  /** scraper id */
  id: Scalars['ID']['output'];
  /** scrapper selectors */
  selectors: Array<ScraperSelector>;
  /** time that the scraper started */
  started_at?: Maybe<Scalars['DateTime']['output']>;
  /** scraper state */
  state: ScraperState;
  /** successfully scraped articles */
  successful: Scalars['Int']['output'];
  /** total articles */
  total: Scalars['Int']['output'];
};


export type ScraperArticlesArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type ScraperArticle = {
  __typename?: 'ScraperArticle';
  /** scraped article data */
  data?: Maybe<Scalars['JSON']['output']>;
  /** article id */
  id: Scalars['ID']['output'];
  /** url path */
  path: Scalars['String']['output'];
  /** whether the article is scraped or not */
  scraped: Scalars['Boolean']['output'];
  /** the article scraped time */
  scraped_at?: Maybe<Scalars['DateTime']['output']>;
  /** whether the article is scraped successfully or not */
  successful: Scalars['Boolean']['output'];
};

/** A paginated list of ScraperArticle items. */
export type ScraperArticlePaginator = {
  __typename?: 'ScraperArticlePaginator';
  /** A list of ScraperArticle items. */
  data: Array<ScraperArticle>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

/** A paginated list of Scraper items. */
export type ScraperPaginator = {
  __typename?: 'ScraperPaginator';
  /** A list of Scraper items. */
  data: Array<Scraper>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type ScraperSelector = {
  __typename?: 'ScraperSelector';
  /** selector data(additional arbitrary data) */
  data?: Maybe<Scalars['JSON']['output']>;
  /** selector id */
  id: Scalars['ID']['output'];
  /**
   * selector type,
   * e.g. title, logo...
   */
  type: Scalars['String']['output'];
  /** selector value */
  value?: Maybe<Scalars['String']['output']>;
};

/** State */
export enum ScraperState {
  /** the scraper was completed, e.g. done, failed or cancelled */
  Completed = 'completed',
  /** the scraper was initialized */
  Initialized = 'initialized',
  /** the scraper is processing */
  Processing = 'processing'
}

/** Type */
export enum ScraperType {
  /** scrape all articles */
  Full = 'full',
  /** only scrape few articles for preview */
  Preview = 'preview'
}

export type SendColdEmailToSubscriberInput = {
  /** email content */
  content: Scalars['String']['input'];
  /** subscriber id */
  id: Scalars['String']['input'];
  /** reply to for the email */
  reply_to?: InputMaybe<Scalars['EmailString']['input']>;
  /** email subject */
  subject: Scalars['String']['input'];
};

export type ShopifyCollection = {
  __typename?: 'ShopifyCollection';
  page_info?: Maybe<Scalars['String']['output']>;
  products: Array<ShopifyProduct>;
};

export type ShopifyConfiguration = {
  __typename?: 'ShopifyConfiguration';
  /** shopify store domain */
  domain?: Maybe<Scalars['String']['output']>;
  /** shopify store id */
  id: Scalars['String']['output'];
  /** myshopify domain */
  myshopify_domain: Scalars['String']['output'];
  /** shopify store name */
  name: Scalars['String']['output'];
  /** shopify app url prefix */
  prefix: Scalars['String']['output'];
};

export type ShopifyProduct = {
  __typename?: 'ShopifyProduct';
  id: Scalars['ID']['output'];
  images: Array<ShopifyProductImage>;
  path: Scalars['String']['output'];
  slug: Scalars['String']['output'];
  title: Scalars['String']['output'];
  variants: Array<ShopifyProductVariant>;
};

export type ShopifyProductImage = {
  __typename?: 'ShopifyProductImage';
  height: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  product_id: Scalars['ID']['output'];
  src: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type ShopifyProductVariant = {
  __typename?: 'ShopifyProductVariant';
  id: Scalars['ID']['output'];
  images: Array<ShopifyProductImage>;
  price: Scalars['String']['output'];
  sku: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type SignInLeakySubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input'];
};

export type SignUpInput = {
  appsumo_code?: InputMaybe<Scalars['String']['input']>;
  campaign?: InputMaybe<Scalars['JSON']['input']>;
  checkout_id?: InputMaybe<Scalars['String']['input']>;
  /** account email */
  email: Scalars['EmailString']['input'];
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>;
  /** invite token */
  invite_token?: InputMaybe<Scalars['String']['input']>;
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>;
  /** account password */
  password: Scalars['String']['input'];
  /** publication name */
  publication_name?: InputMaybe<Scalars['String']['input']>;
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>;
};

export type SignUpSubscriberInput = {
  /** subscriber email */
  email: Scalars['EmailString']['input'];
  /** current url, used for redirect back */
  from: Scalars['String']['input'];
  /** http referer */
  referer: Scalars['String']['input'];
};

/** publication */
export type Site = {
  __typename?: 'Site';
  /** subscription panel background color */
  accent_color?: Maybe<Scalars['String']['output']>;
  /** generator configurations */
  buildx?: Maybe<Scalars['JSON']['output']>;
  /** subscription currency */
  currency?: Maybe<Scalars['String']['output']>;
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>;
  /** configuration for custom domain email */
  custom_domain_email: Array<EmailDnsRecord>;
  /** enable custom site template or not */
  custom_site_template: Scalars['Boolean']['output'];
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output'];
  /**
   * publication customer site storipress domain
   * e.g. hello.storipress.app
   */
  customer_site_storipress_url: Scalars['String']['output'];
  /** publication description */
  description?: Maybe<Scalars['String']['output']>;
  /** built-in desks' names alias */
  desk_alias?: Maybe<Scalars['JSON']['output']>;
  /** publication email */
  email?: Maybe<Scalars['EmailString']['output']>;
  /** publication enabled or not */
  enabled: Scalars['Boolean']['output'];
  /** publication favicon, base64 type */
  favicon?: Maybe<Scalars['String']['output']>;
  has_prophet: Scalars['Boolean']['output'];
  /** main hosting site */
  hosting?: Maybe<SiteHosting>;
  /** publication id */
  id: Scalars['ID']['output'];
  /** publication initialized or not */
  initialized: Scalars['Boolean']['output'];
  /** RFC 5646 Language Tags */
  lang: Scalars['String']['output'];
  /** publication logo image */
  logo?: Maybe<Image>;
  /** mail custom domain */
  mail_domain?: Maybe<Scalars['String']['output']>;
  metafields: Array<CustomField>;
  /** subscription monthly price */
  monthly_price?: Maybe<Scalars['String']['output']>;
  /** publication name */
  name: Scalars['String']['output'];
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['output'];
  /** newstand api key */
  newstand_key?: Maybe<Scalars['String']['output']>;
  /** leaky paywall configurations */
  paywall_config?: Maybe<Scalars['JSON']['output']>;
  /** static site url structures */
  permalinks?: Maybe<Scalars['JSON']['output']>;
  /**
   * publication subscription plan:
   * - free
   * - blogger(stripe)
   * - publisher(stripe)
   * - enterprise(stripe)
   * - storipress_tier1(appsumo)
   * - storipress_tier2(appsumo)
   * - storipress_tier3(appsumo)
   * - storipress_bf_tier1(appsumo)
   * - storipress_bf_tier2(appsumo)
   * - storipress_bf_tier3(appsumo)
   */
  plan: Scalars['String']['output'];
  /** prophet configurations */
  prophet_config?: Maybe<Scalars['JSON']['output']>;
  /** site custom domain */
  site_domain?: Maybe<Scalars['String']['output']>;
  /** customized sitemap */
  sitemap?: Maybe<Scalars['JSON']['output']>;
  /** social network links */
  socials?: Maybe<Scalars['JSON']['output']>;
  /** enable subscription or not */
  subscription: Scalars['Boolean']['output'];
  /** subscription setup status */
  subscription_setup: SubscriptionSetup;
  /** subscription setup has done once */
  subscription_setup_done: Scalars['Boolean']['output'];
  /** publication timezone */
  timezone: Scalars['String']['output'];
  /** publication tutorial history */
  tutorials?: Maybe<Scalars['JSON']['output']>;
  /** the search only key for typesense */
  typesense_search_only_key: Scalars['String']['output'];
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output'];
  /** subscription yearly price */
  yearly_price?: Maybe<Scalars['String']['output']>;
};

/** Hosting */
export enum SiteHosting {
  /** Shopify */
  Shopify = 'shopify',
  /** Storipress */
  Storipress = 'storipress',
  /** Webflow */
  Webflow = 'webflow',
  /** Wordpress */
  Wordpress = 'wordpress'
}

export type SiteSubscriptionInfo = {
  __typename?: 'SiteSubscriptionInfo';
  /** publication description */
  description?: Maybe<Scalars['String']['output']>;
  /** publication support email */
  email?: Maybe<Scalars['EmailString']['output']>;
  /** publication logo image */
  logo?: Maybe<Image>;
  /** subscription monthly price */
  monthly_price?: Maybe<Scalars['String']['output']>;
  /** price_id for the monthly plan */
  monthly_price_id?: Maybe<Scalars['String']['output']>;
  /** publication name */
  name: Scalars['String']['output'];
  /** publication has enabled newsletter or not */
  newsletter: Scalars['Boolean']['output'];
  /** leaky paywall configurations */
  paywall_config?: Maybe<Scalars['JSON']['output']>;
  /** stripe account id */
  stripe_account_id?: Maybe<Scalars['String']['output']>;
  /** publication has enabled subscription or not */
  subscription: Scalars['Boolean']['output'];
  /** subscription yearly price */
  yearly_price?: Maybe<Scalars['String']['output']>;
  /** price_id for the yearly plan */
  yearly_price_id?: Maybe<Scalars['String']['output']>;
};

export type SiteTemplate = {
  __typename?: 'SiteTemplate';
  /** site template description */
  description?: Maybe<Scalars['String']['output']>;
  /** site template key */
  key: Scalars['ID']['output'];
  /** site template name */
  name?: Maybe<Scalars['String']['output']>;
  /** site template type */
  type: TemplateType;
  /** site template url */
  url: Scalars['String']['output'];
};

export type SlackChannel = {
  __typename?: 'SlackChannel';
  /** channel id */
  id: Scalars['ID']['output'];
  /** channel is private or not */
  is_private: Scalars['Boolean']['output'];
  /** channel name */
  name: Scalars['String']['output'];
};

export type SlackConfiguration = {
  __typename?: 'SlackConfiguration';
  /** slack channel id */
  id: Scalars['String']['output'];
  /** slack channel name */
  name: Scalars['String']['output'];
  /** slack channel thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type SortArticleByInput = {
  /** sort method(column and order) */
  sort_by: ArticleSortBy;
  /** stage id */
  stage_id: Scalars['ID']['input'];
};

/** Directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

export type Stage = {
  __typename?: 'Stage';
  /** color use on kanban header and scheduler dropdown */
  color: Scalars['String']['output'];
  /** stage for new article and articles which stage was deleted */
  default: Scalars['Boolean']['output'];
  /** icon show on kanban header */
  icon: Scalars['String']['output'];
  /** stage id */
  id: Scalars['ID']['output'];
  /** stage name */
  name: Scalars['String']['output'];
  /** the order of stages */
  order: Scalars['Int']['output'];
  /** determinate this stage articles can move to DONE or not */
  ready: Scalars['Boolean']['output'];
};

export type Subscriber = {
  __typename?: 'Subscriber';
  active_days_last_30: Scalars['Int']['output'];
  /** subscriber activity(percentage) */
  activity: Scalars['Int']['output'];
  article_views_last_7: Scalars['Int']['output'];
  article_views_last_30: Scalars['Int']['output'];
  article_views_total: Scalars['Int']['output'];
  /** subscriber avatar */
  avatar: Scalars['String']['output'];
  /** indicate the subscriber email is bounced or not */
  bounced: Scalars['Boolean']['output'];
  /** current subscription canceled time */
  canceled_at?: Maybe<Scalars['DateTime']['output']>;
  /**
   * subscriber card brand,
   * e.g. MasterCard
   * @deprecated use pm_type
   */
  card_brand?: Maybe<Scalars['String']['output']>;
  /**
   * subscriber card expiration date
   * @deprecated No longer supported
   */
  card_expiration?: Maybe<Scalars['String']['output']>;
  /**
   * subscriber card last 4 number
   * @deprecated use pm_last_four
   */
  card_last_four?: Maybe<Scalars['String']['output']>;
  comments_last_7: Scalars['Int']['output'];
  comments_last_30: Scalars['Int']['output'];
  comments_total: Scalars['Int']['output'];
  /** subscriber created time */
  created_at: Scalars['DateTime']['output'];
  /** subscriber stripe customer id */
  customer_id?: Maybe<Scalars['String']['output']>;
  /** subscriber email */
  email: Scalars['EmailString']['output'];
  email_link_clicks_last_7: Scalars['Int']['output'];
  email_link_clicks_last_30: Scalars['Int']['output'];
  email_link_clicks_total: Scalars['Int']['output'];
  email_opens_last_7: Scalars['Int']['output'];
  email_opens_last_30: Scalars['Int']['output'];
  email_opens_total: Scalars['Int']['output'];
  email_receives: Scalars['Int']['output'];
  /** subscriber events */
  events: SubscriberEventPaginator;
  /** current subscription expire time */
  expire_on?: Maybe<Scalars['DateTime']['output']>;
  /** subscriber first name */
  first_name?: Maybe<Scalars['String']['output']>;
  /** subscriber first paid time */
  first_paid_at?: Maybe<Scalars['DateTime']['output']>;
  /** subscriber full name */
  full_name?: Maybe<Scalars['String']['output']>;
  /** subscriber id */
  id: Scalars['ID']['output'];
  /** subscriber last name */
  last_name?: Maybe<Scalars['String']['output']>;
  /** enable newsletter or not */
  newsletter: Scalars['Boolean']['output'];
  /** subscriber paid up source */
  paid_up_source?: Maybe<Scalars['String']['output']>;
  /** subscriber card last 4 number */
  pm_last_four?: Maybe<Scalars['String']['output']>;
  /**
   * subscriber card brand,
   * e.g. MasterCard
   */
  pm_type?: Maybe<Scalars['String']['output']>;
  /** next subscription renew time */
  renew_on?: Maybe<Scalars['DateTime']['output']>;
  /** revenue from the subscriber */
  revenue: Scalars['String']['output'];
  shares_last_7: Scalars['Int']['output'];
  shares_last_30: Scalars['Int']['output'];
  shares_total: Scalars['Int']['output'];
  /** subscriber signed up source */
  signed_up_source?: Maybe<Scalars['String']['output']>;
  /** subscriber has active subscription or not */
  subscribed: Scalars['Boolean']['output'];
  /** the time subscriber subscribed */
  subscribed_at?: Maybe<Scalars['DateTime']['output']>;
  /** subscriber subscription plan info */
  subscription?: Maybe<SubscriptionPlan>;
  /** subscriber subscription type */
  subscription_type: SubscriptionType;
  unique_article_views_last_7: Scalars['Int']['output'];
  unique_article_views_last_30: Scalars['Int']['output'];
  unique_article_views_total: Scalars['Int']['output'];
  unique_email_link_clicks_last_7: Scalars['Int']['output'];
  unique_email_link_clicks_last_30: Scalars['Int']['output'];
  unique_email_link_clicks_total: Scalars['Int']['output'];
  unique_email_opens_last_7: Scalars['Int']['output'];
  unique_email_opens_last_30: Scalars['Int']['output'];
  unique_email_opens_total: Scalars['Int']['output'];
  /** subscriber email verified or not */
  verified: Scalars['Boolean']['output'];
};


export type SubscriberEventsArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type SubscriberEvent = {
  __typename?: 'SubscriberEvent';
  /** event data */
  data?: Maybe<Scalars['JSON']['output']>;
  /** event id */
  id: Scalars['ID']['output'];
  /**
   * event name,
   * e.g. email.opened
   */
  name: Scalars['String']['output'];
  /** event occurred time */
  occurred_at: Scalars['DateTime']['output'];
  /** event target */
  target?: Maybe<SubscriberEventTargetUnion>;
};

/** A paginated list of SubscriberEvent items. */
export type SubscriberEventPaginator = {
  __typename?: 'SubscriberEventPaginator';
  /** A list of SubscriberEvent items. */
  data: Array<SubscriberEvent>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type SubscriberEventTargetUnion = Article | Desk | Email | Page | Subscriber | User;

/** A paginated list of Subscriber items. */
export type SubscriberPaginator = {
  __typename?: 'SubscriberPaginator';
  /** A list of Subscriber items. */
  data: Array<Subscriber>;
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
};

export type SubscriberPainPoint = {
  __typename?: 'SubscriberPainPoint';
  value: Scalars['String']['output'];
  weight: Scalars['Int']['output'];
};

export type SubscribersGraph = {
  __typename?: 'SubscribersGraph';
  /** date */
  date: Scalars['Date']['output'];
  /** paid subscribers */
  paid_subscribers: Scalars['Int']['output'];
  /** total subscribers */
  subscribers: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  LiveUpdate?: Maybe<LiveUpdate>;
};

export type SubscriptionAnalysis = {
  __typename?: 'SubscriptionAnalysis';
  /** active subscribers number */
  active_subscribers: Scalars['Int']['output'];
  /** email clicks number */
  email_clicks: Scalars['Int']['output'];
  /** email opens number */
  email_opens: Scalars['Int']['output'];
  /** email sends number */
  email_sends: Scalars['Int']['output'];
  /** paid subscribers number */
  paid_subscribers: Scalars['Int']['output'];
  /** revenue */
  revenue: Scalars['String']['output'];
  /** total subscribers number */
  subscribers: Scalars['Int']['output'];
};

export type SubscriptionGraphs = {
  __typename?: 'SubscriptionGraphs';
  /** revenue by dates */
  revenue: Array<RevenueGraph>;
  /** subscribers by dates */
  subscribers: Array<SubscribersGraph>;
};

export type SubscriptionOverview = {
  __typename?: 'SubscriptionOverview';
  /** current month information */
  current?: Maybe<SubscriptionAnalysis>;
  /** previous month information */
  previous?: Maybe<SubscriptionAnalysis>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  interval: Scalars['String']['output'];
  price: Scalars['String']['output'];
};

/** Setup */
export enum SubscriptionSetup {
  /** Done */
  Done = 'done',
  /** None */
  None = 'none',
  /** Wait connect stripe */
  WaitConnectStripe = 'waitConnectStripe',
  /** Wait import */
  WaitImport = 'waitImport',
  /** Wait next stage */
  WaitNextStage = 'waitNextStage'
}

/** Type */
export enum SubscriptionType {
  /** Free */
  Free = 'free',
  /** Subscribed */
  Subscribed = 'subscribed',
  /** Unsubscribed */
  Unsubscribed = 'unsubscribed'
}

export type SwapAppSubscriptionInput = {
  price_id: Scalars['String']['input'];
  promotion_code?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type SyncGroupableToCustomFieldGroupInput = {
  /** remove existing ids that aren't present in the target_ids input(default: true) */
  detaching?: InputMaybe<Scalars['Boolean']['input']>;
  /** custom field group id */
  id: Scalars['ID']['input'];
  /** target ids(tags, desks, ...) */
  target_ids: Array<Scalars['ID']['input']>;
};

export type Tag = {
  __typename?: 'Tag';
  /** articles which has current tag */
  articles: ArticlePaginator;
  /** the number of articles which associate to this tag */
  count: Scalars['Int']['output'];
  /** tag description */
  description?: Maybe<Scalars['String']['output']>;
  /** tag id */
  id: Scalars['ID']['output'];
  /** custom fields for metafield */
  metafields: Array<CustomField>;
  /** tag name */
  name: Scalars['String']['output'];
  /** tag string id */
  sid: Scalars['ID']['output'];
  /**
   * tag slug, use for structure url,
   * e.g. /tags/{slug}
   */
  slug: Scalars['String']['output'];
};


export type TagArticlesArgs = {
  first?: Scalars['Int']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** Type */
export enum TemplateType {
  /** Article layout */
  ArticleLayout = 'articleLayout',
  /** Builder block */
  BuilderBlock = 'builderBlock',
  /** Editor block */
  EditorBlock = 'editorBlock',
  /** Editor block ssr */
  EditorBlockSsr = 'editorBlockSsr',
  /** Site */
  Site = 'site'
}

export type TrackSubscriberActivityInput = {
  anonymous_id?: InputMaybe<Scalars['String']['input']>;
  /** event data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** event name */
  name: Scalars['String']['input'];
  /** target id */
  target_id?: InputMaybe<Scalars['ID']['input']>;
};

export type TransferDeskArticlesInput = {
  from_id: Scalars['ID']['input'];
  to_id: Scalars['ID']['input'];
  trash?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type TriggerSiteBuildInput = {
  /** trigger id, e.g. article id */
  id: Scalars['ID']['input'];
  /** trigger type */
  type: ReleaseType;
};

export type TwitterConfiguration = {
  __typename?: 'TwitterConfiguration';
  /** twitter user name */
  name: Scalars['String']['output'];
  /** twitter user thumbnail */
  thumbnail?: Maybe<Scalars['String']['output']>;
  /** twitter user id */
  user_id: Scalars['String']['output'];
};

export type UnsplashSearchInput = {
  /** search keyword */
  keyword: Scalars['String']['input'];
  /** image orientation */
  orientation?: InputMaybe<Scalars['String']['input']>;
  /** change result page */
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** password update form */
export type UpdateAccountPasswordInput = {
  /** confirm new password field */
  confirm: Scalars['String']['input'];
  /** current password field */
  current: Scalars['String']['input'];
  /** new password field */
  future: Scalars['String']['input'];
};

export type UpdateAppPaymentMethodInput = {
  country?: InputMaybe<Scalars['String']['input']>;
  postal_code?: InputMaybe<Scalars['String']['input']>;
  token: Scalars['String']['input'];
};

export type UpdateAppSubscriptionQuantityInput = {
  quantity: Scalars['Int']['input'];
};

/** update article's author info form */
export type UpdateArticleAuthorInput = {
  /** article id */
  id: Scalars['ID']['input'];
  /** user id(author id) */
  user_id: Scalars['ID']['input'];
};

export type UpdateArticleInput = {
  auto_posting?: InputMaybe<Scalars['JSON']['input']>;
  blurb?: InputMaybe<Scalars['String']['input']>;
  cover?: InputMaybe<Scalars['JSON']['input']>;
  document?: InputMaybe<Scalars['JSON']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  /** article id */
  id: Scalars['ID']['input'];
  layout_id?: InputMaybe<Scalars['ID']['input']>;
  newsletter?: InputMaybe<Scalars['Boolean']['input']>;
  plan?: InputMaybe<ArticlePlan>;
  seo?: InputMaybe<Scalars['JSON']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateArticleThreadInput = {
  id: Scalars['ID']['input'];
  position: Scalars['JSON']['input'];
};

export type UpdateBlockInput = {
  /** block archive file */
  file?: InputMaybe<Scalars['Upload']['input']>;
  /** block id */
  id: Scalars['ID']['input'];
  /** presigned upload url key */
  key?: InputMaybe<Scalars['ID']['input']>;
  /** signature of the request */
  signature?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomFieldGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  /** custom field group id */
  id: Scalars['ID']['input'];
  /** custom field group key */
  key?: InputMaybe<Scalars['String']['input']>;
  /** custom field group name */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateCustomFieldInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  /** custom field id */
  id: Scalars['ID']['input'];
  /** custom field key */
  key?: InputMaybe<Scalars['String']['input']>;
  /** custom field name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** custom field options */
  options?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateCustomFieldValueInput = {
  /** custom field value id */
  id: Scalars['ID']['input'];
  /** custom field value */
  value?: InputMaybe<Scalars['Mixed']['input']>;
};

export type UpdateDesignInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>;
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>;
  /** key */
  key: Scalars['ID']['input'];
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>;
};

export type UpdateDeskInput = {
  /** desk description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** desk id */
  id: Scalars['ID']['input'];
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>;
  /** desk name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** determinate desk is open_access or not */
  open_access?: InputMaybe<Scalars['Boolean']['input']>;
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>;
  /** desk slug */
  slug?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateIntegrationInput = {
  /** integration data */
  data: Scalars['JSON']['input'];
  /** integration key */
  key: Scalars['ID']['input'];
};

export type UpdateLayoutInput = {
  /** layout data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** layout id */
  id: Scalars['ID']['input'];
  /** layout name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** template id */
  template?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLinterInput = {
  /** linter description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** linter id */
  id: Scalars['ID']['input'];
  /** linter prompt */
  prompt?: InputMaybe<Scalars['String']['input']>;
  /** linter title */
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNoteInput = {
  /** note content */
  content: Scalars['String']['input'];
  /** note id */
  id: Scalars['ID']['input'];
};

export type UpdatePageInput = {
  /** live content */
  current?: InputMaybe<Scalars['JSON']['input']>;
  /** draft content */
  draft?: InputMaybe<Scalars['JSON']['input']>;
  /** page id */
  id: Scalars['ID']['input'];
  /** layout id */
  layout_id?: InputMaybe<Scalars['ID']['input']>;
  /** page order */
  order?: InputMaybe<Scalars['Int']['input']>;
  /** seo meta data */
  seo?: InputMaybe<Scalars['JSON']['input']>;
  /**
   * page title,
   * e.g. About Us
   */
  title?: InputMaybe<Scalars['String']['input']>;
};

/** account profile update form */
export type UpdateProfileInput = {
  /**
   * this field is used to remove avatar,
   * the only available value is `null`
   */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** description of personal profile */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** birthday */
  birthday?: InputMaybe<Scalars['Date']['input']>;
  /** public email */
  contact_email?: InputMaybe<Scalars['EmailString']['input']>;
  /**
   * first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>;
  /** gender */
  gender?: InputMaybe<UserGender>;
  /** job title */
  job_title?: InputMaybe<Scalars['String']['input']>;
  /**
   * last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>;
  /** location */
  location?: InputMaybe<Scalars['String']['input']>;
  /** arbitrary data field */
  meta?: InputMaybe<Scalars['JSON']['input']>;
  /**
   * phone number with national prefix,
   * e.g. +1
   */
  phone_number?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  /** social network links */
  socials?: InputMaybe<Scalars['JSON']['input']>;
  /** personal website url */
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateRedirectionInput = {
  /** redirection id */
  id: Scalars['ID']['input'];
  /** redirection path */
  path: Scalars['String']['input'];
  /** redirection target */
  target: Scalars['String']['input'];
};

export type UpdateReleaseInput = {
  /** release id */
  id: Scalars['ID']['input'];
  /** release final message */
  message?: InputMaybe<Scalars['String']['input']>;
  /** release meta data */
  meta?: InputMaybe<Scalars['JSON']['input']>;
  /** release state progress */
  progress?: InputMaybe<Scalars['Int']['input']>;
  /** release state */
  state?: InputMaybe<ReleaseState>;
};

export type UpdateScraperArticleInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** scraper article id */
  id: Scalars['ID']['input'];
  /** article scraped_at */
  scraped_at?: InputMaybe<Scalars['String']['input']>;
  /** is scraped successfully */
  successful?: InputMaybe<Scalars['Boolean']['input']>;
  /** scraper token */
  token: Scalars['String']['input'];
};

export type UpdateScraperInput = {
  /** arbitrary data */
  data?: InputMaybe<Scalars['JSON']['input']>;
  /** scraper failed time */
  failed_at?: InputMaybe<Scalars['String']['input']>;
  /** scraper finished time */
  finished_at?: InputMaybe<Scalars['String']['input']>;
  /** scraper state */
  state?: InputMaybe<ScraperState>;
  /** scraper token */
  token: Scalars['String']['input'];
};

export type UpdateSiteInput = {
  /** generator configurations */
  buildx?: InputMaybe<Scalars['JSON']['input']>;
  /** enable / disable custom site template */
  custom_site_template?: InputMaybe<Scalars['Boolean']['input']>;
  /** publication description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** built-in desks' names alias */
  desk_alias?: InputMaybe<Scalars['JSON']['input']>;
  /** publication email */
  email?: InputMaybe<Scalars['String']['input']>;
  /** publication favicon, base64 type */
  favicon?: InputMaybe<Scalars['String']['input']>;
  /** main hosting site */
  hosting?: InputMaybe<SiteHosting>;
  /** RFC 5646 Language Tags */
  lang?: InputMaybe<Scalars['String']['input']>;
  /** publication name */
  name?: InputMaybe<Scalars['String']['input']>;
  /** leaky paywall configurations */
  paywall_config?: InputMaybe<Scalars['JSON']['input']>;
  /** static site url structures */
  permalinks?: InputMaybe<Scalars['JSON']['input']>;
  /** prophet configurations */
  prophet_config?: InputMaybe<Scalars['JSON']['input']>;
  /** customized sitemap */
  sitemap?: InputMaybe<Scalars['JSON']['input']>;
  /** social network links */
  socials?: InputMaybe<Scalars['JSON']['input']>;
  /** publication timezone */
  timezone?: InputMaybe<Scalars['String']['input']>;
  /** publication tutorial history */
  tutorials?: InputMaybe<Scalars['JSON']['input']>;
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateStageInput = {
  /** stage color */
  color?: InputMaybe<Scalars['String']['input']>;
  /** stage icon */
  icon?: InputMaybe<Scalars['String']['input']>;
  /** stage id */
  id: Scalars['ID']['input'];
  /** stage name */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateSubscriberInput = {
  /** subscriber email */
  email?: InputMaybe<Scalars['EmailString']['input']>;
  /** subscriber first name */
  first_name?: InputMaybe<Scalars['String']['input']>;
  /** subscriber last name */
  last_name?: InputMaybe<Scalars['String']['input']>;
  /** enable newsletter or not */
  newsletter?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UpdateTagInput = {
  /** tag description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** tag id */
  id: Scalars['ID']['input'];
  /** tag name */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  /** avatar url */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** description of personal profile */
  bio?: InputMaybe<Scalars['String']['input']>;
  /** birthday */
  birthday?: InputMaybe<Scalars['Date']['input']>;
  /** account email */
  email?: InputMaybe<Scalars['EmailString']['input']>;
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: InputMaybe<Scalars['String']['input']>;
  /** gender */
  gender?: InputMaybe<UserGender>;
  /** user id */
  id: Scalars['ID']['input'];
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: InputMaybe<Scalars['String']['input']>;
  /** location */
  location?: InputMaybe<Scalars['String']['input']>;
  /**
   * phone number with national prefix,
   * e.g. +1
   */
  phone_number?: InputMaybe<Scalars['String']['input']>;
  /** personal website url */
  website?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateWebflowCollectionInput = {
  /** collection type */
  type: WebflowCollectionType;
  /** collection id */
  value: Scalars['ID']['input'];
};

export type UpdateWebflowCollectionMappingInput = {
  /** collection type */
  type: WebflowCollectionType;
  /** collection id */
  value: Array<UpdateWebflowCollectionMappingValueInput>;
};

export type UpdateWebflowCollectionMappingValueInput = {
  storipress_id: Scalars['String']['input'];
  webflow_id: Scalars['ID']['input'];
};

export type UpdateWebflowDomainInput = {
  /** site domain */
  value: Scalars['String']['input'];
};

export type UpdateWebflowSiteInput = {
  /** site id */
  value: Scalars['ID']['input'];
};

export type UploadArticleImageInput = {
  /** image file */
  file: Scalars['Upload']['input'];
  /** article id */
  id: Scalars['ID']['input'];
};

export type UploadAvatarInput = {
  /** image file */
  file: Scalars['Upload']['input'];
  /** user id */
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type UploadBlockPreviewInput = {
  /** image file */
  file: Scalars['Upload']['input'];
  /** block id */
  id: Scalars['ID']['input'];
};

/** Image */
export enum UploadImage {
  /** Article content image */
  ArticleContentImage = 'articleContentImage',
  /** Article hero photo */
  ArticleHeroPhoto = 'articleHeroPhoto',
  /** Article s e o image */
  ArticleSeoImage = 'articleSEOImage',
  /** Block preview image */
  BlockPreviewImage = 'blockPreviewImage',
  /** Layout preview image */
  LayoutPreviewImage = 'layoutPreviewImage',
  /** Other page content image */
  OtherPageContentImage = 'otherPageContentImage',
  /** Publication banner */
  PublicationBanner = 'publicationBanner',
  /** Publication favicon */
  PublicationFavicon = 'publicationFavicon',
  /** Publication logo */
  PublicationLogo = 'publicationLogo',
  /** Subscriber avatar */
  SubscriberAvatar = 'subscriberAvatar',
  /** User avatar */
  UserAvatar = 'userAvatar'
}

export type UploadImageInput = {
  /** presigned upload url key */
  key: Scalars['ID']['input'];
  /** signature of the request */
  signature: Scalars['String']['input'];
  /** target id */
  target_id: Scalars['ID']['input'];
  /** type */
  type: UploadImage;
};

export type UploadLayoutPreviewInput = {
  /** image file */
  file: Scalars['Upload']['input'];
  /** layout id */
  id: Scalars['ID']['input'];
};

export type UploadSiteTemplateInput = {
  /** presigned upload url key */
  key: Scalars['ID']['input'];
};

export type UploadSubscriberAvatarInput = {
  /** image file */
  file: Scalars['Upload']['input'];
};

export type User = {
  __typename?: 'User';
  /** avatar url */
  avatar?: Maybe<Scalars['String']['output']>;
  /** description of personal profile */
  bio?: Maybe<Scalars['String']['output']>;
  /** public email */
  contact_email?: Maybe<Scalars['EmailString']['output']>;
  /** user create(join) time */
  created_at: Scalars['DateTime']['output'];
  /** desks joined by the user */
  desks: Array<Desk>;
  /** user email */
  email?: Maybe<Scalars['EmailString']['output']>;
  /**
   * user first name,
   * e.g. 大明
   */
  first_name?: Maybe<Scalars['String']['output']>;
  /** user full name */
  full_name?: Maybe<Scalars['String']['output']>;
  /** user id */
  id: Scalars['ID']['output'];
  /** intercom hash identity */
  intercom_hash_identity: Scalars['String']['output'];
  /** job title */
  job_title?: Maybe<Scalars['String']['output']>;
  /**
   * user last name,
   * e.g. 王
   */
  last_name?: Maybe<Scalars['String']['output']>;
  /** user last seen time */
  last_seen_at?: Maybe<Scalars['DateTime']['output']>;
  /** location */
  location?: Maybe<Scalars['String']['output']>;
  /** arbitrary data field */
  meta?: Maybe<Scalars['JSON']['output']>;
  /** user's role */
  role?: Maybe<Scalars['String']['output']>;
  /**
   * user signed up source information, e.g.
   * - direct
   * - appsumo
   * - invite:D6RX98VXN,D1NJYLKZN
   */
  signed_up_source?: Maybe<Scalars['String']['output']>;
  /** user slug, use for structure url */
  slug?: Maybe<Scalars['String']['output']>;
  /** social network links */
  socials?: Maybe<Scalars['JSON']['output']>;
  /**
   * user status,
   * e.g. suspended, active
   */
  status?: Maybe<UserStatus>;
  /** user is suspended or not */
  suspended?: Maybe<Scalars['Boolean']['output']>;
  updated_at: Scalars['DateTime']['output'];
  /** user email confirmed or not */
  verified: Scalars['Boolean']['output'];
  /** personal website url */
  website?: Maybe<Scalars['String']['output']>;
};

/** Gender */
export enum UserGender {
  /** Female */
  Female = 'female',
  /** Male */
  Male = 'male',
  /** Other */
  Other = 'other'
}

/** Status */
export enum UserStatus {
  /** Active */
  Active = 'active',
  /** Invited */
  Invited = 'invited',
  /** Suspended */
  Suspended = 'suspended'
}

export type WebflowCollection = {
  __typename?: 'WebflowCollection';
  /** text displayed to the user */
  displayName: Scalars['String']['output'];
  /** collection fields */
  fields: Array<WebflowCollectionField>;
  /** Webflow collection id */
  id: Scalars['ID']['output'];
  /**
   * key(webflow-field-id) value(candidate-value, nullable) object,
   * e.g. {"19bf7":null,"210c9":"editors"}
   */
  mappings?: Maybe<Scalars['JSON']['output']>;
};

export type WebflowCollectionField = {
  __typename?: 'WebflowCollectionField';
  /** potential field list corresponding to Storipress */
  candidates?: Maybe<Array<WebflowCollectionFieldCandidate>>;
  /** text displayed to the user */
  displayName: Scalars['String']['output'];
  /** help text displayed to the user */
  helpText?: Maybe<Scalars['String']['output']>;
  /** Webflow collection field id */
  id: Scalars['ID']['output'];
  /** whether the collection field is required or not */
  isRequired: Scalars['Boolean']['output'];
  /** the collection field type */
  type: WebflowFieldType;
};

export type WebflowCollectionFieldCandidate = {
  __typename?: 'WebflowCollectionFieldCandidate';
  /** text displayed to the user */
  name: Scalars['String']['output'];
  /** value required for the API call */
  value: Scalars['String']['output'];
};

export type WebflowCollectionOnboarding = {
  __typename?: 'WebflowCollectionOnboarding';
  /** whether the author collection is selected or not */
  author: Scalars['Boolean']['output'];
  /** whether the blog collection is selected or not */
  blog: Scalars['Boolean']['output'];
  /** whether the desk collection is selected or not */
  desk: Scalars['Boolean']['output'];
  /** whether the tag collection is selected or not */
  tag: Scalars['Boolean']['output'];
};

/** Collection type */
export enum WebflowCollectionType {
  /** Author */
  Author = 'author',
  /** Blog */
  Blog = 'blog',
  /** Desk */
  Desk = 'desk',
  /** Tag */
  Tag = 'tag'
}

export type WebflowConfiguration = {
  __typename?: 'WebflowConfiguration';
  /** webflow collections */
  collections: Array<WebflowConfigurationCollection>;
  /** webflow user email */
  email: Scalars['EmailString']['output'];
  /** webflow token is expired or not */
  expired?: Maybe<Scalars['Boolean']['output']>;
  /** webflow user name */
  name: Scalars['String']['output'];
  /** webflow user id */
  user_id: Scalars['String']['output'];
  /** webflow api is v2 or not */
  v2?: Maybe<Scalars['Boolean']['output']>;
};

export type WebflowConfigurationCollection = {
  __typename?: 'WebflowConfigurationCollection';
  /** webflow collection id */
  id: Scalars['String']['output'];
  /** webflow item mappings */
  mapping: Array<WebflowConfigurationCollectionItemMapping>;
};

export type WebflowConfigurationCollectionItemMapping = {
  __typename?: 'WebflowConfigurationCollectionItemMapping';
  /** webflow collection item id */
  key: Scalars['String']['output'];
  /** storipress article field */
  value: Scalars['String']['output'];
};

export type WebflowCustomDomain = {
  __typename?: 'WebflowCustomDomain';
  id: Scalars['ID']['output'];
  url: Scalars['String']['output'];
};

export type WebflowDetectionMappingOnboarding = {
  __typename?: 'WebflowDetectionMappingOnboarding';
  /** whether the author collection's fields mapping detection is ongoing or not */
  author: Scalars['Boolean']['output'];
  /** whether the blog collection's fields mapping detection is ongoing or not */
  blog: Scalars['Boolean']['output'];
  /** whether the desk collection's fields mapping detection is ongoing or not */
  desk: Scalars['Boolean']['output'];
  /** whether the tag collection's fields mapping detection is ongoing or not */
  tag: Scalars['Boolean']['output'];
};

export type WebflowDetectionOnboarding = {
  __typename?: 'WebflowDetectionOnboarding';
  /** whether the site collection is ongoing or not */
  collection: Scalars['Boolean']['output'];
  mapping: WebflowDetectionMappingOnboarding;
  /** whether the site detection is ongoing or not */
  site: Scalars['Boolean']['output'];
};

/** Field type */
export enum WebflowFieldType {
  /** Color */
  Color = 'color',
  /** Date time */
  DateTime = 'dateTime',
  /** Email */
  Email = 'email',
  /** File */
  File = 'file',
  /** Image */
  Image = 'image',
  /** Link */
  Link = 'link',
  /** Membership plan */
  MembershipPlan = 'membershipPlan',
  /** Multi external file */
  MultiExternalFile = 'multiExternalFile',
  /** Multi image */
  MultiImage = 'multiImage',
  /** Multi reference */
  MultiReference = 'multiReference',
  /** Number */
  Number = 'number',
  /** Option */
  Option = 'option',
  /** Phone */
  Phone = 'phone',
  /** Plain text */
  PlainText = 'plainText',
  /** Price */
  Price = 'price',
  /** Reference */
  Reference = 'reference',
  /** Rich text */
  RichText = 'richText',
  /** Sku settings */
  SkuSettings = 'skuSettings',
  /** Sku values */
  SkuValues = 'skuValues',
  /** Switch */
  Switch = 'switch',
  /** Text option */
  TextOption = 'textOption',
  /** User */
  User = 'user',
  /** Video link */
  VideoLink = 'videoLink'
}

export type WebflowInfo = {
  __typename?: 'WebflowInfo';
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>;
  /** configured Webflow site domain */
  domain?: Maybe<Scalars['String']['output']>;
  /** configured Webflow site id */
  site_id?: Maybe<Scalars['ID']['output']>;
};

export type WebflowItem = {
  __typename?: 'WebflowItem';
  /** Webflow item id */
  id: Scalars['ID']['output'];
  /** item name */
  name: Scalars['String']['output'];
  /** item slug */
  slug: Scalars['String']['output'];
};

export type WebflowMappingOnboarding = {
  __typename?: 'WebflowMappingOnboarding';
  /** whether the author collection's fields mapping is completed or not */
  author: Scalars['Boolean']['output'];
  /** whether the blog collection's fields mapping is completed or not */
  blog: Scalars['Boolean']['output'];
  /** whether the desk collection's fields mapping is completed or not */
  desk: Scalars['Boolean']['output'];
  /** whether the tag collection's fields mapping is completed or not */
  tag: Scalars['Boolean']['output'];
};

export type WebflowOnboarding = {
  __typename?: 'WebflowOnboarding';
  collection: WebflowCollectionOnboarding;
  detection: WebflowDetectionOnboarding;
  mapping: WebflowMappingOnboarding;
  /** whether the site is selected or not */
  site: Scalars['Boolean']['output'];
};

export type WebflowReference = {
  __typename?: 'WebflowReference';
  /** Webflow item id */
  id: Scalars['ID']['output'];
};

export type WebflowSite = {
  __typename?: 'WebflowSite';
  /** site custom domains */
  customDomains: Array<WebflowCustomDomain>;
  /** site webflow domain, e.g. hello.webflow.io */
  defaultDomain: Scalars['String']['output'];
  /** text displayed to the user */
  displayName: Scalars['String']['output'];
  /** Webflow site id */
  id: Scalars['ID']['output'];
};

/** Dynamic WHERE conditions for queries. */
export type WhereConditions = {
  /** A set of conditions that requires all conditions to match. */
  AND?: InputMaybe<Array<WhereConditions>>;
  /** Check whether a relation exists. Extra conditions or a minimum amount can be applied. */
  HAS?: InputMaybe<WhereConditionsRelation>;
  /** A set of conditions that requires at least one condition to match. */
  OR?: InputMaybe<Array<WhereConditions>>;
  /** The column that is used for the condition. */
  column?: InputMaybe<Scalars['String']['input']>;
  /** The operator that is used for the condition. */
  operator?: InputMaybe<SqlOperator>;
  /** The value that is used for the condition. */
  value?: InputMaybe<Scalars['Mixed']['input']>;
};

/** Dynamic HAS conditions for WHERE condition queries. */
export type WhereConditionsRelation = {
  /** The amount to test. */
  amount?: InputMaybe<Scalars['Int']['input']>;
  /** Additional condition logic. */
  condition?: InputMaybe<WhereConditions>;
  /** The comparison operator to test against the amount. */
  operator?: InputMaybe<SqlOperator>;
  /** The relation that is checked. */
  relation: Scalars['String']['input'];
};

export type WordPressFeature = {
  __typename?: 'WordPressFeature';
  /** the activation of WordPress acf plugin synchronization */
  acf: Scalars['Boolean']['output'];
  /** the activation of WordPress site synchronization */
  site: Scalars['Boolean']['output'];
  /** the activation of WordPress yoast seo plugin synchronization */
  yoast_seo: Scalars['Boolean']['output'];
};

export type WordPressInfo = {
  __typename?: 'WordPressInfo';
  /** whether the integration is activated or not */
  activated_at?: Maybe<Scalars['DateTime']['output']>;
  /** whether the integration token is expired or not */
  expired?: Maybe<Scalars['Boolean']['output']>;
  /** the features of WordPress synchronization */
  feature?: Maybe<WordPressFeature>;
  /** configured WordPress site name */
  site_name?: Maybe<Scalars['String']['output']>;
  /** configured WordPress site url */
  url?: Maybe<Scalars['String']['output']>;
  /** configured WordPress username */
  username?: Maybe<Scalars['String']['output']>;
  /** configured WordPress Plugin version */
  version?: Maybe<Scalars['String']['output']>;
};

/** Optional feature */
export enum WordPressOptionalFeatureType {
  /** Acf */
  Acf = 'acf',
  /** Acf pro */
  AcfPro = 'acfPro',
  /** Rank math */
  RankMath = 'rankMath',
  /** Site */
  Site = 'site',
  /** Yoast seo */
  YoastSeo = 'yoastSeo'
}

/** subset of site(publication) */
export type Workspace = {
  __typename?: 'Workspace';
  /** publication custom domain */
  custom_domain?: Maybe<Scalars['String']['output']>;
  /**
   * publication customer site domain
   * e.g. hello.storipress.app, example.com
   */
  customer_site_domain: Scalars['String']['output'];
  /** publication description */
  description?: Maybe<Scalars['String']['output']>;
  /** publication favicon */
  favicon?: Maybe<Scalars['String']['output']>;
  /** hidden or not */
  hidden: Scalars['Boolean']['output'];
  /** publication id */
  id: Scalars['ID']['output'];
  /** publication name */
  name: Scalars['String']['output'];
  /** user's role */
  role: Scalars['String']['output'];
  /**
   * user status,
   * e.g. suspended, active
   */
  status: UserStatus;
  /**
   * publication storipress domain prefix,
   * e.g. {workspace}.storipress.app
   */
  workspace: Scalars['String']['output'];
};

export type PresignedUploadUrl = {
  __typename?: 'presignedUploadURL';
  /** url expires time */
  expire_on: Scalars['DateTime']['output'];
  /** key(id) */
  key: Scalars['ID']['output'];
  /** signature of the request */
  signature: Scalars['String']['output'];
  /** upload endpoint */
  url: Scalars['String']['output'];
};

export type SchedulableArticleFragment = { __typename?: 'Article', id: string, title: string, scheduled: boolean, published: boolean, published_at?: any | null, updated_at: any, authors: Array<{ __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }>, stage: { __typename?: 'Stage', id: string, name: string, color: string, order: number, icon: string }, desk: { __typename?: 'Desk', id: string }, tags: Array<{ __typename?: 'Tag', id: string }> };

export type CustomFieldTextOptionsFragment = { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null };

export type CustomFieldNumberOptionsFragment = { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null };

export type CustomFieldDateOptionsFragment = { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null };

export type CustomFieldColorOptionsFragment = { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldUrlOptionsFragment = { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldBooleanOptionsFragment = { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldRichTextOptionsFragment = { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldFileOptionsFragment = { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldJsonOptionsFragment = { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldIgnoreOptionsFragment = { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null };

export type CustomFieldReferenceOptionsFragment = { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null };

export type CustomFieldSelectOptionsFragment = { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null };

export type CustomFieldTextValueFragment = { __typename?: 'CustomFieldTextValue', id: string, value?: string | null };

export type CustomFieldNumberValueFragment = { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null };

export type CustomFieldColorValueFragment = { __typename?: 'CustomFieldColorValue', id: string, value?: string | null };

export type CustomFieldUrlValueFragment = { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null };

export type CustomFieldBooleanValueFragment = { __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null };

export type CustomFieldRichTextValueFragment = { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null };

export type CustomFieldFileValueFragment = { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null };

export type CustomFieldDateValueFragment = { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null };

export type CustomFieldJsonValueFragment = { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null };

export type CustomFieldSelectValueFragment = { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null };

export type CustomFieldReferenceValueFragment = { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null };

export type NoteFragment = { __typename?: 'ArticleThreadNote', id: string, content: string, created_at: any, user: { __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }, thread: { __typename?: 'ArticleThread', id: string } };

export type SubscriberEventArticleFragment = { __typename?: 'Article', id: string, title: string, published: boolean, slug: string, seo?: any | null };

export type SubscriberEventPageFragment = { __typename?: 'Page', id: string, title: string, seo?: any | null };

export type SubscriberEventDeskFragment = { __typename?: 'Desk', id: string, name: string, slug: string };

export type SubscriberEventUserFragment = { __typename?: 'User', id: string, full_name?: string | null };

export type SubscriberEventEmailFragment = { __typename?: 'Email', id: string, subject: string, target?: { __typename?: 'Article', id: string, title: string, published: boolean, slug: string, seo?: any | null } | null };

export type ThreadFragment = { __typename?: 'ArticleThread', id: string, position: any, resolved_at?: any | null, notes: Array<{ __typename?: 'ArticleThreadNote', id: string, content: string, created_at: any, user: { __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }, thread: { __typename?: 'ArticleThread', id: string } }> };

export type DeleteSubscribersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type DeleteSubscribersMutation = { __typename?: 'Mutation', deleteSubscribers: boolean };

export type ActivateIntegrationMutationVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type ActivateIntegrationMutation = { __typename?: 'Mutation', activateIntegration: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type ActivateWebflowMutationVariables = Exact<{ [key: string]: never; }>;


export type ActivateWebflowMutation = { __typename?: 'Mutation', activateWebflow: boolean };

export type AddAuthorToArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type AddAuthorToArticleMutation = { __typename?: 'Mutation', addAuthorToArticle: { __typename?: 'Article', id: string, authors: Array<{ __typename?: 'User', id: string }> } };

export type AddSlackChannelsMutationVariables = Exact<{
  input: AddSlackChannelsInput;
}>;


export type AddSlackChannelsMutation = { __typename?: 'Mutation', addSlackChannels: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type AddTagToArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
}>;


export type AddTagToArticleMutation = { __typename?: 'Mutation', addTagToArticle: { __typename?: 'Article', id: string, tags: Array<{ __typename?: 'Tag', id: string }> } };

export type ApplyCouponCodeToAppSubscriptionMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type ApplyCouponCodeToAppSubscriptionMutation = { __typename?: 'Mutation', applyCouponCodeToAppSubscription: boolean };

export type ApplyDealFuelCodeMutationVariables = Exact<{
  input: ApplyDealFuelCodeInput;
}>;


export type ApplyDealFuelCodeMutation = { __typename?: 'Mutation', applyDealFuelCode: boolean };

export type ApplyViededingueCodeMutationVariables = Exact<{
  input: ApplyViededingueCodeInput;
}>;


export type ApplyViededingueCodeMutation = { __typename?: 'Mutation', applyViededingueCode: boolean };

export type AssignSubscriberSubscriptionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type AssignSubscriberSubscriptionMutation = { __typename?: 'Mutation', assignSubscriberSubscription: boolean };

export type AssignUserToDeskMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  deskId: Scalars['ID']['input'];
}>;


export type AssignUserToDeskMutation = { __typename?: 'Mutation', assignUserToDesk: { __typename?: 'User', id: string, desks: Array<{ __typename?: 'Desk', id: string, name: string }> } };

export type CancelAppSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelAppSubscriptionMutation = { __typename?: 'Mutation', cancelAppSubscription: boolean };

export type CancelAppSubscriptionFreeTrialMutationVariables = Exact<{ [key: string]: never; }>;


export type CancelAppSubscriptionFreeTrialMutation = { __typename?: 'Mutation', cancelAppSubscriptionFreeTrial: boolean };

export type ChangeAccountEmailMutationVariables = Exact<{
  input: ChangeAccountEmailInput;
}>;


export type ChangeAccountEmailMutation = { __typename?: 'Mutation', changeAccountEmail: { __typename?: 'User', id: string, email?: any | null } };

export type ChangeAccountPasswordMutationVariables = Exact<{
  input: UpdateAccountPasswordInput;
}>;


export type ChangeAccountPasswordMutation = { __typename?: 'Mutation', changeAccountPassword: boolean };

export type ChangeArticleStageMutationVariables = Exact<{
  input: ChangeArticleStageInput;
}>;


export type ChangeArticleStageMutation = { __typename?: 'Mutation', changeArticleStage: { __typename?: 'Article', id: string, title: string, slug: string, blurb?: string | null, featured: boolean, cover?: any | null, seo?: any | null, plan: ArticlePlan, updated_at: any, stage: { __typename?: 'Stage', id: string, name: string, color: string, icon: string, default: boolean, order: number } } };

export type ChangeUserRoleMutationVariables = Exact<{
  input: ChangeRoleInput;
}>;


export type ChangeUserRoleMutation = { __typename?: 'Mutation', changeUserRole: { __typename?: 'User', id: string, role?: string | null } };

export type CheckCustomDomainAvailabilityMutationVariables = Exact<{
  input: CheckCustomDomainAvailabilityInput;
}>;


export type CheckCustomDomainAvailabilityMutation = { __typename?: 'Mutation', checkCustomDomainAvailability: { __typename?: 'CheckCustomDomainAvailabilityResponse', available: boolean, site: boolean, mail: boolean, redirect: boolean } };

export type CheckCustomDomainDnsStatusMutationVariables = Exact<{ [key: string]: never; }>;


export type CheckCustomDomainDnsStatusMutation = { __typename?: 'Mutation', checkCustomDomainDnsStatus: { __typename?: 'CustomDomainDnsStatus', site: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }>, mail: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }>, redirect: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }> } };

export type CheckEmailExistMutationVariables = Exact<{
  email: Scalars['EmailString']['input'];
}>;


export type CheckEmailExistMutation = { __typename?: 'Mutation', checkEmailExist: boolean };

export type CheckStripeConnectConnectedMutationVariables = Exact<{ [key: string]: never; }>;


export type CheckStripeConnectConnectedMutation = { __typename?: 'Mutation', checkStripeConnectConnected: boolean };

export type ConfirmCustomDomainMutationVariables = Exact<{ [key: string]: never; }>;


export type ConfirmCustomDomainMutation = { __typename?: 'Mutation', confirmCustomDomain: boolean };

export type ConfirmEmailMutationVariables = Exact<{
  input: ConfirmEmailInput;
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: boolean };

export type ConnectHubSpotMutationVariables = Exact<{ [key: string]: never; }>;


export type ConnectHubSpotMutation = { __typename?: 'Mutation', connectHubSpot: string };

export type ConnectWebflowMutationVariables = Exact<{ [key: string]: never; }>;


export type ConnectWebflowMutation = { __typename?: 'Mutation', connectWebflow: string };

export type CreateAppSubscriptionMutationVariables = Exact<{
  input?: InputMaybe<CreateAppSubscriptionInput>;
}>;


export type CreateAppSubscriptionMutation = { __typename?: 'Mutation', createAppSubscription: boolean };

export type CreateArticleMutationVariables = Exact<{
  input: CreateArticleInput;
}>;


export type CreateArticleMutation = { __typename?: 'Mutation', createArticle: { __typename?: 'Article', id: string, title: string, blurb?: string | null, scheduled: boolean, published: boolean, published_at?: any | null, seo?: any | null, plan: ArticlePlan, desk: { __typename?: 'Desk', id: string, name: string, slug: string }, stage: { __typename?: 'Stage', id: string, name: string, ready: boolean, default: boolean, order: number } } };

export type CreateCustomFieldMutationVariables = Exact<{
  input: CreateCustomFieldInput;
}>;


export type CreateCustomFieldMutation = { __typename?: 'Mutation', createCustomField: { __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null } };

export type CreateCustomFieldGroupMutationVariables = Exact<{
  input: CreateCustomFieldGroupInput;
}>;


export type CreateCustomFieldGroupMutation = { __typename?: 'Mutation', createCustomFieldGroup: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null }> } };

export type CreateCustomFieldValueMutationVariables = Exact<{
  input: CreateCustomFieldValueInput;
}>;


export type CreateCustomFieldValueMutation = { __typename?: 'Mutation', createCustomFieldValue: { __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename?: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename?: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null } };

export type CreateDeskMutationVariables = Exact<{
  input: CreateDeskInput;
}>;


export type CreateDeskMutation = { __typename?: 'Mutation', createDesk: { __typename?: 'Desk', id: string, name: string, slug: string, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string }> } };

export type CreateInvitationMutationVariables = Exact<{
  input: CreateInvitationInput;
}>;


export type CreateInvitationMutation = { __typename?: 'Mutation', createInvitation: boolean };

export type CreateLinterMutationVariables = Exact<{
  input: CreateLinterInput;
}>;


export type CreateLinterMutation = { __typename?: 'Mutation', createLinter: { __typename?: 'Linter', id: string, title: string, description: string, prompt: string } };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'ArticleThreadNote', id: string, content: string, created_at: any, user: { __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }, thread: { __typename?: 'ArticleThread', id: string } } };

export type CreateScraperMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateScraperMutation = { __typename?: 'Mutation', createScraper: string };

export type CreateScraperSelectorMutationVariables = Exact<{
  input: CreateScraperSelectorInput;
}>;


export type CreateScraperSelectorMutation = { __typename?: 'Mutation', createScraperSelector: { __typename?: 'ScraperSelector', id: string, type: string, value?: string | null, data?: any | null } };

export type CreateSiteMutationVariables = Exact<{
  input: CreateSiteInput;
}>;


export type CreateSiteMutation = { __typename?: 'Mutation', createSite: string };

export type CreateStageMutationVariables = Exact<{
  input: CreateStageInput;
}>;


export type CreateStageMutation = { __typename?: 'Mutation', createStage: { __typename?: 'Stage', id: string, name: string, color: string, icon: string, order: number, ready: boolean, default: boolean } };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag: { __typename?: 'Tag', id: string, name: string, description?: string | null } };

export type CreateThreadMutationVariables = Exact<{
  input: CreateArticleThreadInput;
}>;


export type CreateThreadMutation = { __typename?: 'Mutation', createArticleThread: { __typename?: 'ArticleThread', id: string, article_id: string, position: any, created_at: any, resolved_at?: any | null, notes: Array<{ __typename?: 'ArticleThreadNote', id: string, content: string, created_at: any, user: { __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }, thread: { __typename?: 'ArticleThread', id: string } }> } };

export type CreateTrialAppSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateTrialAppSubscriptionMutation = { __typename?: 'Mutation', createTrialAppSubscription: boolean };

export type CreateWebflowCollectionMutationVariables = Exact<{
  input: CreateWebflowCollectionInput;
}>;


export type CreateWebflowCollectionMutation = { __typename?: 'Mutation', createWebflowCollection: boolean };

export type DeactivateIntegrationMutationVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DeactivateIntegrationMutation = { __typename?: 'Mutation', deactivateIntegration: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type DeactivateWebflowMutationVariables = Exact<{ [key: string]: never; }>;


export type DeactivateWebflowMutation = { __typename?: 'Mutation', deactivateWebflow: boolean };

export type DeleteAccountMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: boolean };

export type DeleteArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteArticleMutation = { __typename?: 'Mutation', deleteArticle: { __typename?: 'Article', id: string } };

export type DeleteCustomFieldMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomFieldMutation = { __typename?: 'Mutation', deleteCustomField: { __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null } };

export type DeleteCustomFieldGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomFieldGroupMutation = { __typename?: 'Mutation', deleteCustomFieldGroup: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null }> } };

export type DeleteCustomFieldValueMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomFieldValueMutation = { __typename?: 'Mutation', deleteCustomFieldValue: { __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename?: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename?: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null } };

export type DeleteDeskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteDeskMutation = { __typename?: 'Mutation', deleteDesk: { __typename?: 'Desk', id: string, name: string } };

export type DeleteLinterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteLinterMutation = { __typename?: 'Mutation', deleteLinter: { __typename?: 'Linter', id: string, title: string } };

export type DeleteScraperArticleMutationVariables = Exact<{
  token: Scalars['String']['input'];
  id: Scalars['ID']['input'];
}>;


export type DeleteScraperArticleMutation = { __typename?: 'Mutation', deleteScraperArticle: { __typename?: 'ScraperArticle', id: string, successful: boolean } };

export type DeleteSiteMutationVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type DeleteSiteMutation = { __typename?: 'Mutation', deleteSite: boolean };

export type DeleteSiteContentMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteSiteContentMutation = { __typename?: 'Mutation', deleteSiteContent: boolean };

export type DeleteSlackChannelsMutationVariables = Exact<{
  input: DeleteSlackChannelsInput;
}>;


export type DeleteSlackChannelsMutation = { __typename?: 'Mutation', deleteSlackChannels: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type DeleteStageMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteStageMutation = { __typename?: 'Mutation', deleteStage: { __typename?: 'Stage', id: string, name: string, color: string, icon: string, order: number, ready: boolean, default: boolean } };

export type DeleteTagMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag: { __typename?: 'Tag', id: string, name: string } };

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: { __typename?: 'User', id: string } };

export type DisconnectHubSpotMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectHubSpotMutation = { __typename?: 'Mutation', disconnectHubSpot: boolean };

export type DisconnectIntegrationMutationVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type DisconnectIntegrationMutation = { __typename?: 'Mutation', disconnectIntegration: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type DisconnectStripeConnectMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectStripeConnectMutation = { __typename?: 'Mutation', disconnectStripeConnect: boolean };

export type DisconnectWebflowMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectWebflowMutation = { __typename?: 'Mutation', disconnectWebflow: boolean };

export type DisconnectWordpressMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectWordpressMutation = { __typename?: 'Mutation', disconnectWordPress: boolean };

export type DuplicateArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DuplicateArticleMutation = { __typename?: 'Mutation', duplicateArticle: { __typename?: 'Article', id: string } };

export type EnableCustomDomainMutationVariables = Exact<{
  input: EnableCustomDomainInput;
}>;


export type EnableCustomDomainMutation = { __typename?: 'Mutation', enableCustomDomain: { __typename?: 'Site', id: string, custom_domain?: string | null, custom_domain_email: Array<{ __typename?: 'EmailDNSRecord', hostname: string, type: string, value: string }> } };

export type ExportSiteContentMutationVariables = Exact<{ [key: string]: never; }>;


export type ExportSiteContentMutation = { __typename?: 'Mutation', exportSiteContent: any };

export type ExportSubscribersMutationVariables = Exact<{ [key: string]: never; }>;


export type ExportSubscribersMutation = { __typename?: 'Mutation', exportSubscribers: string };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['EmailString']['input'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type GenerateNewstandKeyMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateNewstandKeyMutation = { __typename?: 'Mutation', generateNewstandKey: string };

export type GetSlackChannelsListMutationVariables = Exact<{ [key: string]: never; }>;


export type GetSlackChannelsListMutation = { __typename?: 'Mutation', getSlackChannelsList: Array<{ __typename?: 'SlackChannel', id: string, name: string, is_private: boolean }> };

export type ImpersonateMutationVariables = Exact<{
  email: Scalars['EmailString']['input'];
  password: Scalars['String']['input'];
}>;


export type ImpersonateMutation = { __typename?: 'Mutation', impersonate?: string | null };

export type ImportSiteContentFromWordPressMutationVariables = Exact<{
  input: ImportSiteContentFromWordPressInput;
}>;


export type ImportSiteContentFromWordPressMutation = { __typename?: 'Mutation', importSiteContentFromWordPress: boolean };

export type ImportSubscribersFromCsvFileMutationVariables = Exact<{
  file: Scalars['Upload']['input'];
}>;


export type ImportSubscribersFromCsvFileMutation = { __typename?: 'Mutation', importSubscribersFromCsvFile: boolean };

export type InitializeCustomDomainMutationVariables = Exact<{
  input: InitializeCustomDomainInput;
}>;


export type InitializeCustomDomainMutation = { __typename?: 'Mutation', initializeCustomDomain: { __typename?: 'CustomDomainDnsStatus', site: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }>, mail: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }>, redirect: Array<{ __typename?: 'CustomDomain', domain: string, group: CustomDomainGroup, hostname: string, type: string, value: string, ok: boolean }> } };

export type LaunchSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type LaunchSubscriptionMutation = { __typename?: 'Mutation', launchSubscription: { __typename?: 'Site', id: string, name: string } };

export type LeavePublicationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type LeavePublicationMutation = { __typename?: 'Mutation', leavePublication: boolean };

export type LoginMutationVariables = Exact<{
  email: Scalars['EmailString']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', signIn: { __typename?: 'AuthToken', access_token: string } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', signOut: boolean };

export type MoveArticleAfterMutationVariables = Exact<{
  input: MoveArticleAfterInput;
}>;


export type MoveArticleAfterMutation = { __typename?: 'Mutation', moveArticleAfter: boolean };

export type MoveArticleBeforeMutationVariables = Exact<{
  input: MoveArticleBeforeInput;
}>;


export type MoveArticleBeforeMutation = { __typename?: 'Mutation', moveArticleBefore: boolean };

export type MoveArticleToDeskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  desk_id: Scalars['ID']['input'];
}>;


export type MoveArticleToDeskMutation = { __typename?: 'Mutation', moveArticleToDesk: { __typename?: 'Article', id: string, updated_at: any, desk: { __typename?: 'Desk', id: string } } };

export type MoveDeskMutationVariables = Exact<{
  input: MoveDeskInput;
}>;


export type MoveDeskMutation = { __typename?: 'Mutation', moveDesk: { __typename?: 'Desk', id: string, name: string, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, desk?: { __typename?: 'Desk', id: string, name: string, order: number } | null }> } };

export type MoveDeskAfterMutationVariables = Exact<{
  input: MoveDeskAfterInput;
}>;


export type MoveDeskAfterMutation = { __typename?: 'Mutation', moveDeskAfter: { __typename?: 'Desk', id: string, name: string, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null }> } };

export type MoveDeskBeforeMutationVariables = Exact<{
  input: MoveDeskBeforeInput;
}>;


export type MoveDeskBeforeMutation = { __typename?: 'Mutation', moveDeskBefore: { __typename?: 'Desk', id: string, name: string, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null }> } };

export type PreviewAppSubscriptionMutationVariables = Exact<{
  input: PreviewAppSubscriptionInput;
}>;


export type PreviewAppSubscriptionMutation = { __typename?: 'Mutation', previewAppSubscription: { __typename?: 'PreviewAppSubscriptionType', credit: string, discount: string, subtotal: string, tax: string, total: string } };

export type PublishArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  time?: InputMaybe<Scalars['String']['input']>;
  now?: InputMaybe<Scalars['Boolean']['input']>;
  useServerTime?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PublishArticleMutation = { __typename?: 'Mutation', publishArticle: { __typename?: 'Article', id: string, url: string, published: boolean, published_at?: any | null, scheduled: boolean, updated_at: any, stage: { __typename?: 'Stage', id: string, name: string, color: string, order: number, icon: string } } };

export type PullShopifyCustomersMutationVariables = Exact<{ [key: string]: never; }>;


export type PullShopifyCustomersMutation = { __typename?: 'Mutation', pullShopifyCustomers: boolean };

export type PullShopifyContentMutationVariables = Exact<{ [key: string]: never; }>;


export type PullShopifyContentMutation = { __typename?: 'Mutation', pullShopifyContent: boolean };

export type PullWebflowCollectionsMutationVariables = Exact<{
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PullWebflowCollectionsMutation = { __typename?: 'Mutation', pullWebflowCollections: Array<{ __typename?: 'WebflowCollection', id: string, displayName: string }> };

export type PullWebflowSitesMutationVariables = Exact<{
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type PullWebflowSitesMutation = { __typename?: 'Mutation', pullWebflowSites: Array<{ __typename?: 'WebflowSite', id: string, defaultDomain: string, displayName: string, customDomains: Array<{ __typename?: 'WebflowCustomDomain', id: string, url: string }> }> };

export type RemoveAuthorFromArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
}>;


export type RemoveAuthorFromArticleMutation = { __typename?: 'Mutation', removeAuthorFromArticle: { __typename?: 'Article', id: string, authors: Array<{ __typename?: 'User', id: string }> } };

export type RemoveCustomDomainMutationVariables = Exact<{ [key: string]: never; }>;


export type RemoveCustomDomainMutation = { __typename?: 'Mutation', removeCustomDomain: boolean };

export type RemoveNoteMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoveNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'ArticleThreadNote', id: string, thread: { __typename?: 'ArticleThread', id: string } } };

export type RemoveTagFromArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  tagId: Scalars['ID']['input'];
}>;


export type RemoveTagFromArticleMutation = { __typename?: 'Mutation', removeTagFromArticle: { __typename?: 'Article', id: string, tags: Array<{ __typename?: 'Tag', id: string }> } };

export type RequestAppSetupIntentMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestAppSetupIntentMutation = { __typename?: 'Mutation', requestAppSetupIntent: string };

export type RequestPresignedUploadUrlMutationVariables = Exact<{
  md5?: InputMaybe<Scalars['String']['input']>;
}>;


export type RequestPresignedUploadUrlMutation = { __typename?: 'Mutation', requestPresignedUploadURL: { __typename?: 'presignedUploadURL', url: string, key: string, signature: string } };

export type RequestStripeConnectMutationVariables = Exact<{ [key: string]: never; }>;


export type RequestStripeConnectMutation = { __typename?: 'Mutation', requestStripeConnect: string };

export type ResendConfirmEmailMutationVariables = Exact<{ [key: string]: never; }>;


export type ResendConfirmEmailMutation = { __typename?: 'Mutation', resendConfirmEmail: boolean };

export type ResendInvitationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResendInvitationMutation = { __typename?: 'Mutation', resendInvitation: { __typename?: 'Invitation', id: string, email: string, role: string, desks: Array<{ __typename?: 'Desk', id: string, name: string }> } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type ResolveThreadMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ResolveThreadMutation = { __typename?: 'Mutation', resolveArticleThread: { __typename?: 'ArticleThread', id: string, resolved_at?: any | null } };

export type RestoreArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RestoreArticleMutation = { __typename?: 'Mutation', restoreArticle: { __typename?: 'Article', id: string, title: string, slug: string, blurb?: string | null, featured: boolean, cover?: any | null, seo?: any | null, plan: ArticlePlan, layout?: { __typename?: 'Layout', id: string } | null } };

export type ResumeAppSubscriptionMutationVariables = Exact<{ [key: string]: never; }>;


export type ResumeAppSubscriptionMutation = { __typename?: 'Mutation', resumeAppSubscription: boolean };

export type RevokeInvitationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeInvitationMutation = { __typename?: 'Mutation', revokeInvitation: { __typename?: 'Invitation', id: string, email: string, role: string, desks: Array<{ __typename?: 'Desk', id: string, name: string }> } };

export type RevokeSubscriberSubscriptionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RevokeSubscriberSubscriptionMutation = { __typename?: 'Mutation', revokeSubscriberSubscription: boolean };

export type RevokeUserFromDeskMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  deskId: Scalars['ID']['input'];
}>;


export type RevokeUserFromDeskMutation = { __typename?: 'Mutation', revokeUserFromDesk: { __typename?: 'User', id: string, desks: Array<{ __typename?: 'Desk', id: string, name: string }> } };

export type RunScraperMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type RunScraperMutation = { __typename?: 'Mutation', runScraper: { __typename?: 'Scraper', id: string, state: ScraperState } };

export type SendArticleNewsletterMutationVariables = Exact<{
  articleId: Scalars['ID']['input'];
}>;


export type SendArticleNewsletterMutation = { __typename?: 'Mutation', sendArticleNewsletter: { __typename?: 'Article', id: string } };

export type SetupShopifyOauthMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type SetupShopifyOauthMutation = { __typename?: 'Mutation', setupShopifyOauth: boolean };

export type SetupWordpressMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;


export type SetupWordpressMutation = { __typename?: 'Mutation', setupWordPress: boolean };

export type SignIframelySignatureMutationVariables = Exact<{
  params: Scalars['JSON']['input'];
}>;


export type SignIframelySignatureMutation = { __typename?: 'Mutation', signIframelySignature: string };

export type SignUpMutationVariables = Exact<{
  input: SignUpInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: { __typename?: 'AuthToken', access_token: string, token_type: string, expires_in: number, user_id: string } };

export type SortArticleByMutationVariables = Exact<{
  stageId: Scalars['ID']['input'];
  sortBy: ArticleSortBy;
}>;


export type SortArticleByMutation = { __typename?: 'Mutation', sortArticleBy: boolean };

export type SubscribeSubscribersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type SubscribeSubscribersMutation = { __typename?: 'Mutation', subscribeSubscribers: boolean };

export type SuspendUserMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type SuspendUserMutation = { __typename?: 'Mutation', suspendUser: Array<{ __typename?: 'User', id: string, status?: UserStatus | null, suspended?: boolean | null }> };

export type SwapAppSubscriptionMutationVariables = Exact<{
  input?: InputMaybe<SwapAppSubscriptionInput>;
}>;


export type SwapAppSubscriptionMutation = { __typename?: 'Mutation', swapAppSubscription: boolean };

export type SyncGroupableToCustomFieldGroupMutationVariables = Exact<{
  input: SyncGroupableToCustomFieldGroupInput;
}>;


export type SyncGroupableToCustomFieldGroupMutation = { __typename?: 'Mutation', syncGroupableToCustomFieldGroup: { __typename?: 'CustomFieldGroup', id: string } };

export type TransferDeskArticlesMutationVariables = Exact<{
  input: TransferDeskArticlesInput;
}>;


export type TransferDeskArticlesMutation = { __typename?: 'Mutation', transferDeskArticles: boolean };

export type TriggerSiteBuildMutationVariables = Exact<{
  input?: InputMaybe<TriggerSiteBuildInput>;
}>;


export type TriggerSiteBuildMutation = { __typename?: 'Mutation', triggerSiteBuild?: string | null };

export type UnpublishArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type UnpublishArticleMutation = { __typename?: 'Mutation', unpublishArticle: { __typename?: 'Article', id: string, url: string, published: boolean, published_at?: any | null, updated_at: any } };

export type UnsubscribeSubscribersMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type UnsubscribeSubscribersMutation = { __typename?: 'Mutation', unsubscribeSubscribers: boolean };

export type UnsuspendUserMutationVariables = Exact<{
  ids: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type UnsuspendUserMutation = { __typename?: 'Mutation', unsuspendUser: Array<{ __typename?: 'User', id: string, status?: UserStatus | null, suspended?: boolean | null }> };

export type UpdateAppPaymentMethodMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type UpdateAppPaymentMethodMutation = { __typename?: 'Mutation', updateAppPaymentMethod: boolean };

export type UpdateArticleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  blurb?: InputMaybe<Scalars['String']['input']>;
  featured?: InputMaybe<Scalars['Boolean']['input']>;
  cover?: InputMaybe<Scalars['JSON']['input']>;
  autoPosting?: InputMaybe<Scalars['JSON']['input']>;
  seo?: InputMaybe<Scalars['JSON']['input']>;
  plan?: InputMaybe<ArticlePlan>;
  newsletter?: InputMaybe<Scalars['Boolean']['input']>;
  layoutId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UpdateArticleMutation = { __typename?: 'Mutation', updateArticle: { __typename?: 'Article', id: string, title: string, slug: string, blurb?: string | null, featured: boolean, cover?: any | null, seo?: any | null, auto_posting?: any | null, plan: ArticlePlan, newsletter: boolean, updated_at: any, layout?: { __typename?: 'Layout', id: string, name: string, template: string, data?: any | null } | null, stage: { __typename?: 'Stage', id: string, name: string, color: string, icon: string, order: number } } };

export type UpdateCustomFieldMutationVariables = Exact<{
  input: UpdateCustomFieldInput;
}>;


export type UpdateCustomFieldMutation = { __typename?: 'Mutation', updateCustomField: { __typename?: 'CustomField', id: string, key: string, name: string, description?: string | null } };

export type UpdateCustomFieldGroupMutationVariables = Exact<{
  input: UpdateCustomFieldGroupInput;
}>;


export type UpdateCustomFieldGroupMutation = { __typename?: 'Mutation', updateCustomFieldGroup: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null }> } };

export type UpdateCustomFieldValueMutationVariables = Exact<{
  input: UpdateCustomFieldValueInput;
}>;


export type UpdateCustomFieldValueMutation = { __typename?: 'Mutation', updateCustomFieldValue: { __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename?: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename?: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null } };

export type UpdateDeskMutationVariables = Exact<{
  input: UpdateDeskInput;
}>;


export type UpdateDeskMutation = { __typename?: 'Mutation', updateDesk: { __typename?: 'Desk', id: string, name: string, slug: string, description?: string | null, open_access: boolean } };

export type UpdateIntegrationMutationVariables = Exact<{
  input: UpdateIntegrationInput;
}>;


export type UpdateIntegrationMutation = { __typename?: 'Mutation', updateIntegration: { __typename?: 'Integration', key: string, data: any, activated_at?: any | null } };

export type UpdateLinterMutationVariables = Exact<{
  input: UpdateLinterInput;
}>;


export type UpdateLinterMutation = { __typename?: 'Mutation', updateLinter: { __typename?: 'Linter', id: string, title: string, description: string, prompt: string } };

export type UpdateNoteMutationVariables = Exact<{
  input: UpdateNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'ArticleThreadNote', id: string, content: string, thread: { __typename?: 'ArticleThread', id: string } } };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, avatar?: string | null, last_name?: string | null, first_name?: string | null, full_name?: string | null, job_title?: string | null, contact_email?: any | null, location?: string | null, bio?: string | null, website?: string | null, socials?: any | null } };

export type UpdateScraperMutationVariables = Exact<{
  input: UpdateScraperInput;
}>;


export type UpdateScraperMutation = { __typename?: 'Mutation', updateScraper: { __typename?: 'Scraper', id: string, state: ScraperState, data?: any | null, selectors: Array<{ __typename?: 'ScraperSelector', id: string, type: string, value?: string | null, data?: any | null }> } };

export type UpdateSiteInfoMutationVariables = Exact<{
  input: UpdateSiteInput;
}>;


export type UpdateSiteInfoMutation = { __typename?: 'Mutation', updateSiteInfo: { __typename?: 'Site', id: string, name: string, description?: string | null, timezone: string, favicon?: string | null, socials?: any | null, email?: any | null, tutorials?: any | null, lang: string } };

export type UpdateSiteInfoCustomSiteMutationVariables = Exact<{
  input: UpdateSiteInput;
}>;


export type UpdateSiteInfoCustomSiteMutation = { __typename?: 'Mutation', updateSiteInfo: { __typename?: 'Site', id: string, name: string, custom_site_template: boolean } };

export type UpdateStageMutationVariables = Exact<{
  input: UpdateStageInput;
}>;


export type UpdateStageMutation = { __typename?: 'Mutation', updateStage: { __typename?: 'Stage', id: string, name: string, color: string, icon: string, order: number, ready: boolean, default: boolean } };

export type UpdateSubscriptionMutationVariables = Exact<{
  input: EnableSubscriptionInput;
}>;


export type UpdateSubscriptionMutation = { __typename?: 'Mutation', updateSubscription: { __typename?: 'Site', subscription_setup: SubscriptionSetup } };

export type UpdateTagMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag: { __typename?: 'Tag', id: string, name: string } };

export type UpdateUserMetaMutationVariables = Exact<{
  meta?: InputMaybe<Scalars['JSON']['input']>;
}>;


export type UpdateUserMetaMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'User', id: string, meta?: any | null } };

export type UpdateWebflowCollectionMutationVariables = Exact<{
  input: UpdateWebflowCollectionInput;
}>;


export type UpdateWebflowCollectionMutation = { __typename?: 'Mutation', updateWebflowCollection: boolean };

export type UpdateWebflowCollectionMappingMutationVariables = Exact<{
  input: UpdateWebflowCollectionMappingInput;
}>;


export type UpdateWebflowCollectionMappingMutation = { __typename?: 'Mutation', updateWebflowCollectionMapping: boolean };

export type UpdateWebflowDomainMutationVariables = Exact<{
  input: UpdateWebflowDomainInput;
}>;


export type UpdateWebflowDomainMutation = { __typename?: 'Mutation', updateWebflowDomain: boolean };

export type UpdateWebflowSiteMutationVariables = Exact<{
  input: UpdateWebflowSiteInput;
}>;


export type UpdateWebflowSiteMutation = { __typename?: 'Mutation', updateWebflowSite: boolean };

export type UploadImageDocumentMutationVariables = Exact<{
  input: UploadImageInput;
}>;


export type UploadImageDocumentMutation = { __typename?: 'Mutation', uploadImage: { __typename?: 'Media', url: string, width: number, height: number, key: string } };

export type UploadSiteTemplateMutationVariables = Exact<{
  input: UploadSiteTemplateInput;
}>;


export type UploadSiteTemplateMutation = { __typename?: 'Mutation', uploadSiteTemplate: Array<{ __typename?: 'SiteTemplate', key: string }> };

export type CustomFieldGroupsQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomFieldGroupsQuery = { __typename?: 'Query', customFieldGroups: { __typename?: 'CustomFieldGroupPaginator', data: Array<{ __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null, group: { __typename?: 'CustomFieldGroup', id: string, key: string }, options?: { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null } | { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null } | { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null } | { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null } | { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null } | { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | null }>, tags: Array<{ __typename?: 'Tag', id: string, sid: string, name: string, slug: string, description?: string | null, count: number, metafields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null, options?: { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null } | { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null } | { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null } | { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null } | { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null } | { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | null, values: Array<{ __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename?: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename?: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null }> }> }> }> } };

export type DesksCustomFieldQueryVariables = Exact<{ [key: string]: never; }>;


export type DesksCustomFieldQuery = { __typename?: 'Query', desks: Array<{ __typename?: 'Desk', id: string, sid: string, name: string, slug: string, desks: Array<{ __typename?: 'Desk', id: string, sid: string, name: string, slug: string }>, metafields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null, options?: { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null } | { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null } | { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null } | { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null } | { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null } | { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | null, values: Array<{ __typename?: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename?: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename?: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename?: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename?: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename?: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename?: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename?: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename?: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename?: 'CustomFieldUrlValue', id: string, value?: string | null }>, group: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null } }> }> };

export type GetAppSubscriptionPlansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAppSubscriptionPlansQuery = { __typename?: 'Query', appSubscriptionPlans: Array<{ __typename?: 'AppSubscriptionPlans', id: string, group: string, currency: string, price: string, interval: string, interval_count: number, usage_type: string }> };

export type GetArticleContentBlockQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetArticleContentBlockQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: string, title: string, content_blocks: Array<{ __typename?: 'CustomField', id: string, key: string, group: { __typename?: 'CustomFieldGroup', id: string, key: string }, values: Array<{ __typename: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename: 'CustomFieldReferenceValue' } | { __typename: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldSelectValue' } | { __typename: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename: 'CustomFieldUrlValue', id: string, value?: string | null }> }> } | null };

export type GetArticleInfoQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetArticleInfoQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: string, slug: string, url: string } | null };

export type GetArticleMetafieldQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetArticleMetafieldQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: string, title: string, metafields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, group: { __typename?: 'CustomFieldGroup', id: string, key: string, name: string, type: CustomFieldGroupType, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null, options?: { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null } | { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null } | { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null } | { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null } | { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null } | { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | null }> }, values: Array<{ __typename: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename: 'CustomFieldUrlValue', id: string, value?: string | null }> }> } | null };

export type GetArticleQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetArticleQuery = { __typename?: 'Query', article?: { __typename?: 'Article', id: string, seo?: any | null, blurb?: string | null, newsletter: boolean, newsletter_at?: any | null, url: string, slug: string, plan: ArticlePlan, title: string, cover?: any | null, published: boolean, published_at?: any | null, auto_posting?: any | null, scheduled: boolean, draft: boolean, featured: boolean, desk: { __typename?: 'Desk', id: string, name: string, order: number, slug: string, desk?: { __typename?: 'Desk', id: string, name: string, slug: string, order: number, layout?: { __typename?: 'Layout', id: string, template: string, data?: any | null } | null } | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, order: number, layout?: { __typename?: 'Layout', id: string, template: string, data?: any | null } | null }>, layout?: { __typename?: 'Layout', id: string, template: string, data?: any | null } | null }, layout?: { __typename?: 'Layout', id: string, name: string, template: string, data?: any | null } | null, stage: { __typename?: 'Stage', id: string, name: string, icon: string, color: string, order: number, default: boolean }, tags: Array<{ __typename?: 'Tag', id: string, name: string }>, authors: Array<{ __typename?: 'User', id: string, full_name?: string | null, email?: any | null, avatar?: string | null }>, relevances: Array<{ __typename?: 'Article', id: string, title: string, blurb?: string | null }> } | null };

export type GetArticleSearchKeyQueryVariables = Exact<{ [key: string]: never; }>;


export type GetArticleSearchKeyQuery = { __typename?: 'Query', articleSearchKey: string };

export type GetBillingQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBillingQuery = { __typename?: 'Query', billing: { __typename?: 'Billing', id: string, source?: string | null, has_pm: boolean, pm_type?: string | null, pm_last_four?: string | null, subscribed: boolean, plan?: string | null, plan_id?: string | null, interval?: string | null, quantity?: number | null, next_pm_date?: any | null, next_pm_subtotal?: string | null, next_pm_tax?: string | null, next_pm_total?: string | null, credit_balance: string, on_trial: boolean, trial_ends_at?: any | null, canceled: boolean, on_grace_period: boolean, ends_at?: any | null, publications_quota: number, publications_count: number, seats_in_use: number, has_historical_subscriptions: boolean, referer?: string | null, next_pm_discounts: Array<{ __typename?: 'BillingDiscount', amount?: string | null, name: string, amount_off?: string | null, percent_off?: number | null }>, next_pm_taxes: Array<{ __typename?: 'BillingTax', amount: string, name: string, jurisdiction?: string | null, percentage?: number | null }> } };

export type GetCreditsOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCreditsOverviewQuery = { __typename?: 'Query', creditsOverview: Array<{ __typename?: 'CreditsOverview', type: string, amount: string, count: number, total: string }> };

export type GetCreditsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
}>;


export type GetCreditsQuery = { __typename?: 'Query', credits: { __typename?: 'CreditPaginator', paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number }, data: Array<{ __typename?: 'Credit', id: string, amount: string, state: CreditState, earned_from: string, earned_at?: any | null, used: boolean, used_at?: any | null, data?: any | null, initialized_at: any }> } };

export type GetCustomFieldGroupQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCustomFieldGroupQuery = { __typename?: 'Query', customFieldGroup?: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType, name: string, description?: string | null, fields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, name: string, description?: string | null, options?: { __typename?: 'CustomFieldBooleanOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldColorOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldDateOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, time?: boolean | null } | { __typename?: 'CustomFieldFileOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldIgnoreOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldJsonOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldNumberOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, float?: boolean | null, numberMin?: number | null, numberMax?: number | null } | { __typename?: 'CustomFieldReferenceOptions', type: CustomFieldType, target?: CustomFieldReferenceTarget | null, multiple?: boolean | null, collection_id?: string | null } | { __typename?: 'CustomFieldRichTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | { __typename?: 'CustomFieldSelectOptions', type: CustomFieldType, required?: boolean | null, placeholder?: string | null, choices?: any | null, multiple?: boolean | null } | { __typename?: 'CustomFieldTextOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null, multiline?: boolean | null, regex?: string | null, textMin?: number | null, textMax?: number | null } | { __typename?: 'CustomFieldUrlOptions', type: CustomFieldType, required?: boolean | null, repeat?: boolean | null } | null }> } | null };

export type GetDesignQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type GetDesignQuery = { __typename?: 'Query', design?: { __typename?: 'Design', key: string, draft?: any | null } | null };

export type GetDeskQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetDeskQuery = { __typename?: 'Query', desk?: { __typename?: 'Desk', id: string, name: string, slug: string, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string }>, metafields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, values: Array<{ __typename: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename: 'CustomFieldReferenceValue' } | { __typename: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename: 'CustomFieldUrlValue', id: string, value?: string | null }>, group: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType } }> } | null };

export type GetImageQueryVariables = Exact<{
  key: Scalars['ID']['input'];
}>;


export type GetImageQuery = { __typename?: 'Query', image: { __typename?: 'Image', url: string, width: number, height: number } };

export type GetIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIntegrationsQuery = { __typename?: 'Query', integrations: Array<{ __typename?: 'Integration', key: string, data: any, activated_at?: any | null }> };

export type GetLayoutQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLayoutQuery = { __typename?: 'Query', layouts: Array<{ __typename?: 'Layout', id: string, name: string, template: string, data?: any | null, preview?: { __typename?: 'Image', url: string } | null }> };

export type GetMeAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeAccountQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, intercom_hash_identity: string, email?: any | null, avatar?: string | null, verified: boolean, status?: UserStatus | null, suspended?: boolean | null, first_name?: string | null, last_name?: string | null, full_name?: string | null, job_title?: string | null, contact_email?: any | null, location?: string | null, bio?: string | null, website?: string | null, last_seen_at?: any | null, role?: string | null, socials?: any | null } };

export type GetMeEmailQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeEmailQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, email?: any | null, full_name?: string | null, role?: string | null, intercom_hash_identity: string, verified: boolean, signed_up_source?: string | null } };

export type GetMeMetaQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeMetaQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, meta?: any | null } };

export type GetMeProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeProfileQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, first_name?: string | null, last_name?: string | null, location?: string | null, bio?: string | null, avatar?: string | null } };

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, intercom_hash_identity: string, signed_up_source?: string | null, email?: any | null, avatar?: string | null, verified: boolean, status?: UserStatus | null, suspended?: boolean | null, first_name?: string | null, last_name?: string | null, full_name?: string | null, location?: string | null, bio?: string | null, website?: string | null, last_seen_at?: any | null, role?: string | null, socials?: any | null, desks: Array<{ __typename?: 'Desk', id: string }> } };

export type GetPagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPagesQuery = { __typename?: 'Query', pages: Array<{ __typename?: 'Page', id: string, title: string, seo?: any | null }> };

export type GetRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetRolesQuery = { __typename?: 'Query', roles: Array<{ __typename?: 'Role', id: string, name: string, title: string, level: number }> };

export type GetScraperPendingInviteUsersQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type GetScraperPendingInviteUsersQuery = { __typename?: 'Query', scraperPendingInviteUsers: Array<string> };

export type GetSiteCustomSiteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSiteCustomSiteQuery = { __typename?: 'Query', site: { __typename?: 'Site', id: string, name: string, plan: string, custom_site_template: boolean, newstand_key?: string | null, typesense_search_only_key: string } };

export type GetSiteTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSiteTemplatesQuery = { __typename?: 'Query', siteTemplates: Array<{ __typename?: 'SiteTemplate', key: string, type: TemplateType, url: string, name?: string | null, description?: string | null }> };

export type GetSiteTutorialsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSiteTutorialsQuery = { __typename?: 'Query', site: { __typename?: 'Site', id: string, name: string, tutorials?: any | null } };

export type GetSiteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSiteQuery = { __typename?: 'Query', site: { __typename?: 'Site', id: string, name: string, description?: string | null, favicon?: string | null, workspace: string, socials?: any | null, timezone: string, site_domain?: string | null, mail_domain?: string | null, custom_domain?: string | null, customer_site_domain: string, customer_site_storipress_url: string, subscription_setup: SubscriptionSetup, subscription: boolean, newsletter: boolean, email?: any | null, currency?: string | null, monthly_price?: string | null, yearly_price?: string | null, plan: string, lang: string, paywall_config?: any | null, logo?: { __typename?: 'Image', token: string, url: string, name: string, mime: string, size: number, width: number, height: number, title?: string | null, caption?: string | null, description?: string | null, transformation?: any | null } | null, custom_domain_email: Array<{ __typename?: 'EmailDNSRecord', hostname: string, type: string, value: string }> } };

export type GetStagesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStagesQuery = { __typename?: 'Query', stages: Array<{ __typename?: 'Stage', id: string, name: string, color: string, icon: string, order: number, ready: boolean, default: boolean }> };

export type GetTagQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  sid?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetTagQuery = { __typename?: 'Query', tag?: { __typename?: 'Tag', id: string, name: string, slug: string, sid: string, metafields: Array<{ __typename?: 'CustomField', id: string, key: string, type: CustomFieldType, values: Array<{ __typename: 'CustomFieldBooleanValue', id: string, booleanValue?: boolean | null } | { __typename: 'CustomFieldColorValue', id: string, value?: string | null } | { __typename: 'CustomFieldDateValue', id: string, dateValue?: any | null } | { __typename: 'CustomFieldFileValue', id: string, fileValue?: { __typename?: 'CustomFieldFileValueAttributes', key: string, url: string, size: number, mime_type: string } | null } | { __typename: 'CustomFieldJsonValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldNumberValue', id: string, numberValue?: number | null } | { __typename: 'CustomFieldReferenceValue', id: string, referenceValue?: Array<{ __typename?: 'Article', id: string, title: string } | { __typename?: 'Desk', id: string, name: string } | { __typename?: 'Tag', id: string, name: string } | { __typename?: 'User', id: string, full_name?: string | null } | { __typename?: 'WebflowReference', id: string }> | null } | { __typename: 'CustomFieldRichTextValue', id: string, jsonValue?: string | null } | { __typename: 'CustomFieldSelectValue', id: string, selectValue?: Array<string> | null } | { __typename: 'CustomFieldTextValue', id: string, value?: string | null } | { __typename: 'CustomFieldUrlValue', id: string, value?: string | null }>, group: { __typename?: 'CustomFieldGroup', id: string, key: string, type: CustomFieldGroupType } }> } | null };

export type GetTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, name: string }> };

export type GetUserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetUserQuery = { __typename?: 'Query', user?: { __typename?: 'User', id: string, slug?: string | null, email?: any | null, first_name?: string | null, last_name?: string | null, full_name?: string | null, avatar?: string | null, location?: string | null, bio?: string | null, website?: string | null, socials?: any | null, created_at: any, updated_at: any, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, seo?: any | null, order: number }> } | null };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, intercom_hash_identity: string, email?: any | null, verified: boolean, status?: UserStatus | null, suspended?: boolean | null, first_name?: string | null, last_name?: string | null, full_name?: string | null, avatar?: string | null, location?: string | null, bio?: string | null, website?: string | null, socials?: any | null, last_seen_at?: any | null, created_at: any, updated_at: any, role?: string | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, slug: string, seo?: any | null, order: number }> }> };

export type GetWebflowCollectionQueryVariables = Exact<{
  type: WebflowCollectionType;
}>;


export type GetWebflowCollectionQuery = { __typename?: 'Query', webflowCollection?: { __typename?: 'WebflowCollection', id: string, displayName: string, mappings?: any | null, fields: Array<{ __typename?: 'WebflowCollectionField', id: string, displayName: string, isRequired: boolean, type: WebflowFieldType, candidates?: Array<{ __typename?: 'WebflowCollectionFieldCandidate', name: string, value: string }> | null }> } | null };

export type GetWordpressAuthorizedQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWordpressAuthorizedQuery = { __typename?: 'Query', wordPressAuthorized: boolean };

export type GetWordpressInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWordpressInfoQuery = { __typename?: 'Query', wordPressInfo: { __typename?: 'WordPressInfo', username?: string | null, site_name?: string | null, url?: string | null, version?: string | null, activated_at?: any | null } };

export type HubSpotInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSpotInfoQuery = { __typename?: 'Query', hubSpotInfo: { __typename?: 'HubSpotInfo', activated_at?: any | null } };

export type HubSpotAuthorizedQueryVariables = Exact<{ [key: string]: never; }>;


export type HubSpotAuthorizedQuery = { __typename?: 'Query', hubSpotAuthorized: boolean };

export type IframelyQueryVariables = Exact<{
  input: IframelyIframelyInput;
}>;


export type IframelyQuery = { __typename?: 'Query', iframelyIframely: any };

export type ListArticlesQueryVariables = Exact<{
  range?: InputMaybe<DateRange>;
  unscheduled?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type ListArticlesQuery = { __typename?: 'Query', articles: Array<{ __typename?: 'Article', id: string, title: string, scheduled: boolean, published: boolean, published_at?: any | null, updated_at: any, authors: Array<{ __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }>, stage: { __typename?: 'Stage', id: string, name: string, color: string, order: number, icon: string }, desk: { __typename?: 'Desk', id: string }, tags: Array<{ __typename?: 'Tag', id: string }> }> };

export type ListDesksQueryVariables = Exact<{ [key: string]: never; }>;


export type ListDesksQuery = { __typename?: 'Query', desks: Array<{ __typename?: 'Desk', id: string, name: string, description?: string | null, slug: string, open_access: boolean, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, description?: string | null, slug: string, order: number, desk?: { __typename?: 'Desk', id: string, name: string } | null }> }> };

export type ListIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListIntegrationsQuery = { __typename?: 'Query', integrations: Array<{ __typename?: 'Integration', key: string, data: any, activated_at?: any | null, configuration?: { __typename?: 'FacebookConfiguration', pages?: Array<{ __typename?: 'FacebookPage', name: string, page_id: string, thumbnail: string }> | null } | { __typename?: 'IntegrationIgnoreConfiguration', key?: string | null } | { __typename?: 'LinkedInConfiguration', id: string, name: string, thumbnail?: string | null, authors: Array<{ __typename?: 'LinkedInAuthors', id: string, name: string, thumbnail?: string | null }> } | { __typename?: 'ShopifyConfiguration', domain?: string | null, id: string, myshopify_domain: string, name: string, prefix: string } | { __typename?: 'SlackConfiguration', id: string, name: string, thumbnail?: string | null } | { __typename?: 'TwitterConfiguration', name: string, thumbnail?: string | null, user_id: string } | { __typename?: 'WebflowConfiguration', name: string, email: any, user_id: string } | null }> };

export type ListInvitationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListInvitationsQuery = { __typename?: 'Query', invitations: Array<{ __typename?: 'Invitation', id: string, role: string, email: string, desks: Array<{ __typename?: 'Desk', id: string, name: string, desk?: { __typename?: 'Desk', id: string, name: string } | null }> }> };

export type ListLintersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListLintersQuery = { __typename?: 'Query', linters: { __typename?: 'LinterConnection', edges: Array<{ __typename?: 'LinterEdge', node: { __typename?: 'Linter', id: string, title: string, description: string, prompt: string } }> } };

export type ListPublicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListPublicationsQuery = { __typename?: 'Query', publications: Array<{ __typename?: 'Publication', id: string, name: string, workspace: string }> };

export type ListSimpleUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListSimpleUsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null, suspended?: boolean | null, status?: UserStatus | null, role?: string | null, email?: any | null, desks: Array<{ __typename?: 'Desk', id: string, name: string, desk?: { __typename?: 'Desk', id: string, name: string } | null }> }> };

export type ListThreadsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ListThreadsQuery = { __typename?: 'Query', article?: { __typename?: 'Article', threads: Array<{ __typename?: 'ArticleThread', id: string, position: any, resolved_at?: any | null, notes: Array<{ __typename?: 'ArticleThreadNote', id: string, content: string, created_at: any, user: { __typename?: 'User', id: string, full_name?: string | null, avatar?: string | null }, thread: { __typename?: 'ArticleThread', id: string } }> }> } | null };

export type ListWebflowCollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListWebflowCollectionsQuery = { __typename?: 'Query', webflowCollections: Array<{ __typename?: 'WebflowCollection', id: string, displayName: string }> };

export type ListWebflowItemsQueryVariables = Exact<{
  collection_id: Scalars['ID']['input'];
}>;


export type ListWebflowItemsQuery = { __typename?: 'Query', webflowItems: Array<{ __typename?: 'WebflowItem', id: string, name: string }> };

export type ListWebflowSitesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListWebflowSitesQuery = { __typename?: 'Query', webflowSites: Array<{ __typename?: 'WebflowSite', id: string, defaultDomain: string, displayName: string, customDomains: Array<{ __typename?: 'WebflowCustomDomain', id: string, url: string }> }> };

export type ListWorkspacesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListWorkspacesQuery = { __typename?: 'Query', workspaces: Array<{ __typename?: 'Workspace', id: string, name: string, workspace: string, custom_domain?: string | null, customer_site_domain: string, role: string, status: UserStatus, favicon?: string | null }> };

export type ReleasesQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ReleasesQuery = { __typename?: 'Query', releases: { __typename?: 'ReleasePaginator', data: Array<{ __typename?: 'Release', id: string, state: ReleaseState, created_at: any }> } };

export type ScraperQueryVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type ScraperQuery = { __typename?: 'Query', scraper?: { __typename?: 'Scraper', id: string, state: ScraperState, data?: any | null, selectors: Array<{ __typename?: 'ScraperSelector', id: string, type: string, value?: string | null, data?: any | null }>, articles: { __typename?: 'ScraperArticlePaginator', data: Array<{ __typename?: 'ScraperArticle', id: string, path: string, data?: any | null, successful: boolean, scraped: boolean, scraped_at?: any | null }> } } | null };

export type SubscriberEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SubscriberEventQuery = { __typename?: 'Query', subscriber?: { __typename?: 'Subscriber', id: string, events: { __typename?: 'SubscriberEventPaginator', paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, firstItem?: number | null, hasMorePages: boolean, lastItem?: number | null, lastPage: number, perPage: number, total: number }, data: Array<{ __typename?: 'SubscriberEvent', id: string, name: string, data?: any | null, occurred_at: any, target?: { __typename?: 'Article', id: string, title: string, published: boolean, slug: string, seo?: any | null } | { __typename?: 'Desk', id: string, name: string, slug: string } | { __typename?: 'Email', id: string, subject: string, target?: { __typename?: 'Article', id: string, title: string, published: boolean, slug: string, seo?: any | null } | null } | { __typename?: 'Page', id: string, title: string, seo?: any | null } | { __typename?: 'Subscriber' } | { __typename?: 'User', id: string, full_name?: string | null } | null }> } } | null };

export type SubscriberStatsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubscriberStatsQuery = { __typename?: 'Query', subscriber?: { __typename?: 'Subscriber', id: string, email: any, bounced: boolean, first_name?: string | null, last_name?: string | null, full_name?: string | null, avatar: string, newsletter: boolean, subscribed: boolean, subscription_type: SubscriptionType, first_paid_at?: any | null, subscribed_at?: any | null, renew_on?: any | null, canceled_at?: any | null, expire_on?: any | null, signed_up_source?: string | null, paid_up_source?: string | null, revenue: string, activity: number, active_days_last_30: number, comments_total: number, comments_last_7: number, comments_last_30: number, shares_total: number, shares_last_7: number, shares_last_30: number, email_receives: number, email_opens_total: number, email_opens_last_7: number, email_opens_last_30: number, unique_email_opens_total: number, unique_email_opens_last_7: number, unique_email_opens_last_30: number, email_link_clicks_total: number, email_link_clicks_last_7: number, email_link_clicks_last_30: number, unique_email_link_clicks_total: number, unique_email_link_clicks_last_7: number, unique_email_link_clicks_last_30: number, article_views_total: number, article_views_last_7: number, article_views_last_30: number, unique_article_views_total: number, unique_article_views_last_7: number, unique_article_views_last_30: number, verified: boolean, created_at: any } | null };

export type SubscribersQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Array<QuerySubscribersSearchSortByOrderByClause> | QuerySubscribersSearchSortByOrderByClause>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type SubscribersQuery = { __typename?: 'Query', subscribers: { __typename?: 'SubscriberPaginator', paginatorInfo: { __typename?: 'PaginatorInfo', count: number, currentPage: number, total: number }, data: Array<{ __typename?: 'Subscriber', id: string, avatar: string, email: any, subscription_type: SubscriptionType, subscribed_at?: any | null, revenue: string, bounced: boolean, newsletter: boolean, activity: number, created_at: any, subscription?: { __typename?: 'SubscriptionPlan', interval: string, price: string } | null }> } };

export type SubscriptionGraphsQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionGraphsQuery = { __typename?: 'Query', subscriptionGraphs: { __typename?: 'SubscriptionGraphs', subscribers: Array<{ __typename?: 'SubscribersGraph', subscribers: number, paid_subscribers: number, date: any }>, revenue: Array<{ __typename?: 'RevenueGraph', revenue: string, date: any }> } };

export type SubscriptionOverviewQueryVariables = Exact<{ [key: string]: never; }>;


export type SubscriptionOverviewQuery = { __typename?: 'Query', subscriptionOverview: { __typename?: 'SubscriptionOverview', current?: { __typename?: 'SubscriptionAnalysis', subscribers: number, paid_subscribers: number, active_subscribers: number, email_sends: number, email_opens: number, email_clicks: number, revenue: string } | null, previous?: { __typename?: 'SubscriptionAnalysis', subscribers: number, paid_subscribers: number, active_subscribers: number, email_sends: number, email_opens: number, email_clicks: number, revenue: string } | null } };

export type UnsplashDownloadPhotoQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UnsplashDownloadPhotoQuery = { __typename?: 'Query', unsplashDownload: string };

export type UnsplashListPhotosQueryVariables = Exact<{
  page: Scalars['Int']['input'];
}>;


export type UnsplashListPhotosQuery = { __typename?: 'Query', unsplashList: any };

export type UnsplashSearchPhotosQueryVariables = Exact<{
  input: UnsplashSearchInput;
}>;


export type UnsplashSearchPhotosQuery = { __typename?: 'Query', unsplashSearch: any };

export type WebflowActivatedQueryVariables = Exact<{ [key: string]: never; }>;


export type WebflowActivatedQuery = { __typename?: 'Query', webflowInfo: { __typename?: 'WebflowInfo', activated_at?: any | null } };

export type WebflowAuthorizedQueryVariables = Exact<{ [key: string]: never; }>;


export type WebflowAuthorizedQuery = { __typename?: 'Query', webflowAuthorized: boolean };

export type WebflowInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type WebflowInfoQuery = { __typename?: 'Query', webflowInfo: { __typename?: 'WebflowInfo', site_id?: string | null, domain?: string | null } };

export type WebflowOnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type WebflowOnboardingQuery = { __typename?: 'Query', webflowOnboarding: { __typename?: 'WebflowOnboarding', site: boolean, collection: { __typename?: 'WebflowCollectionOnboarding', blog: boolean, author: boolean, desk: boolean, tag: boolean }, mapping: { __typename?: 'WebflowMappingOnboarding', blog: boolean, author: boolean, desk: boolean, tag: boolean } } };

export const SchedulableArticleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchedulableArticle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SchedulableArticleFragment, unknown>;
export const CustomFieldTextOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}}]} as unknown as DocumentNode<CustomFieldTextOptionsFragment, unknown>;
export const CustomFieldNumberOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}}]} as unknown as DocumentNode<CustomFieldNumberOptionsFragment, unknown>;
export const CustomFieldDateOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}}]} as unknown as DocumentNode<CustomFieldDateOptionsFragment, unknown>;
export const CustomFieldColorOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldColorOptionsFragment, unknown>;
export const CustomFieldUrlOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldUrlOptionsFragment, unknown>;
export const CustomFieldBooleanOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldBooleanOptionsFragment, unknown>;
export const CustomFieldRichTextOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldRichTextOptionsFragment, unknown>;
export const CustomFieldFileOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldFileOptionsFragment, unknown>;
export const CustomFieldJsonOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldJsonOptionsFragment, unknown>;
export const CustomFieldIgnoreOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}}]} as unknown as DocumentNode<CustomFieldIgnoreOptionsFragment, unknown>;
export const CustomFieldReferenceOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"collection_id"}}]}}]} as unknown as DocumentNode<CustomFieldReferenceOptionsFragment, unknown>;
export const CustomFieldSelectOptionsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}}]}}]} as unknown as DocumentNode<CustomFieldSelectOptionsFragment, unknown>;
export const CustomFieldTextValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldTextValueFragment, unknown>;
export const CustomFieldNumberValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldNumberValueFragment, unknown>;
export const CustomFieldColorValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldColorValueFragment, unknown>;
export const CustomFieldUrlValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldUrlValueFragment, unknown>;
export const CustomFieldBooleanValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldBooleanValueFragment, unknown>;
export const CustomFieldRichTextValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldRichTextValueFragment, unknown>;
export const CustomFieldFileValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}}]} as unknown as DocumentNode<CustomFieldFileValueFragment, unknown>;
export const CustomFieldDateValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldDateValueFragment, unknown>;
export const CustomFieldJsonValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldJsonValueFragment, unknown>;
export const CustomFieldSelectValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<CustomFieldSelectValueFragment, unknown>;
export const CustomFieldReferenceValueFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CustomFieldReferenceValueFragment, unknown>;
export const SubscriberEventArticleFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventArticle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}}]} as unknown as DocumentNode<SubscriberEventArticleFragment, unknown>;
export const SubscriberEventPageFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}}]} as unknown as DocumentNode<SubscriberEventPageFragment, unknown>;
export const SubscriberEventDeskFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventDesk"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]} as unknown as DocumentNode<SubscriberEventDeskFragment, unknown>;
export const SubscriberEventUserFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}}]} as unknown as DocumentNode<SubscriberEventUserFragment, unknown>;
export const SubscriberEventEmailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventEmail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Email"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}}]}}]}}]} as unknown as DocumentNode<SubscriberEventEmailFragment, unknown>;
export const NoteFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThreadNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<NoteFragment, unknown>;
export const ThreadFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"resolved_at"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThreadNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ThreadFragment, unknown>;
export const DeleteSubscribersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubscribers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSubscribers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<DeleteSubscribersMutation, DeleteSubscribersMutationVariables>;
export const ActivateIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<ActivateIntegrationMutation, ActivateIntegrationMutationVariables>;
export const ActivateWebflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ActivateWebflow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activateWebflow"}}]}}]} as unknown as DocumentNode<ActivateWebflowMutation, ActivateWebflowMutationVariables>;
export const AddAuthorToArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addAuthorToArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addAuthorToArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AddAuthorToArticleMutation, AddAuthorToArticleMutationVariables>;
export const AddSlackChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSlackChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddSlackChannelsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addSlackChannels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<AddSlackChannelsMutation, AddSlackChannelsMutationVariables>;
export const AddTagToArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTagToArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addTagToArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<AddTagToArticleMutation, AddTagToArticleMutationVariables>;
export const ApplyCouponCodeToAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyCouponCodeToAppSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyCouponCodeToAppSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"promotion_code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}}]}]}}]} as unknown as DocumentNode<ApplyCouponCodeToAppSubscriptionMutation, ApplyCouponCodeToAppSubscriptionMutationVariables>;
export const ApplyDealFuelCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyDealFuelCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApplyDealFuelCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyDealFuelCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ApplyDealFuelCodeMutation, ApplyDealFuelCodeMutationVariables>;
export const ApplyViededingueCodeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ApplyViededingueCode"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ApplyViededingueCodeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"applyViededingueCode"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ApplyViededingueCodeMutation, ApplyViededingueCodeMutationVariables>;
export const AssignSubscriberSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignSubscriberSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignSubscriberSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<AssignSubscriberSubscriptionMutation, AssignSubscriberSubscriptionMutationVariables>;
export const AssignUserToDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AssignUserToDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"assignUserToDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"desk_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deskId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<AssignUserToDeskMutation, AssignUserToDeskMutationVariables>;
export const CancelAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAppSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAppSubscription"}}]}}]} as unknown as DocumentNode<CancelAppSubscriptionMutation, CancelAppSubscriptionMutationVariables>;
export const CancelAppSubscriptionFreeTrialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CancelAppSubscriptionFreeTrial"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cancelAppSubscriptionFreeTrial"}}]}}]} as unknown as DocumentNode<CancelAppSubscriptionFreeTrialMutation, CancelAppSubscriptionFreeTrialMutationVariables>;
export const ChangeAccountEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeAccountEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeAccountEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeAccountEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<ChangeAccountEmailMutation, ChangeAccountEmailMutationVariables>;
export const ChangeAccountPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeAccountPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateAccountPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeAccountPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ChangeAccountPasswordMutation, ChangeAccountPasswordMutationVariables>;
export const ChangeArticleStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"changeArticleStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeArticleStageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeArticleStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<ChangeArticleStageMutation, ChangeArticleStageMutationVariables>;
export const ChangeUserRoleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangeUserRole"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ChangeRoleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"changeUserRole"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<ChangeUserRoleMutation, ChangeUserRoleMutationVariables>;
export const CheckCustomDomainAvailabilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckCustomDomainAvailability"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckCustomDomainAvailabilityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkCustomDomainAvailability"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"available"}},{"kind":"Field","name":{"kind":"Name","value":"site"}},{"kind":"Field","name":{"kind":"Name","value":"mail"}},{"kind":"Field","name":{"kind":"Name","value":"redirect"}}]}}]}}]} as unknown as DocumentNode<CheckCustomDomainAvailabilityMutation, CheckCustomDomainAvailabilityMutationVariables>;
export const CheckCustomDomainDnsStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckCustomDomainDnsStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkCustomDomainDnsStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"redirect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<CheckCustomDomainDnsStatusMutation, CheckCustomDomainDnsStatusMutationVariables>;
export const CheckEmailExistDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckEmailExist"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailString"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkEmailExist"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<CheckEmailExistMutation, CheckEmailExistMutationVariables>;
export const CheckStripeConnectConnectedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"checkStripeConnectConnected"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkStripeConnectConnected"}}]}}]} as unknown as DocumentNode<CheckStripeConnectConnectedMutation, CheckStripeConnectConnectedMutationVariables>;
export const ConfirmCustomDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmCustomDomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmCustomDomain"}}]}}]} as unknown as DocumentNode<ConfirmCustomDomainMutation, ConfirmCustomDomainMutationVariables>;
export const ConfirmEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const ConnectHubSpotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConnectHubSpot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectHubSpot"}}]}}]} as unknown as DocumentNode<ConnectHubSpotMutation, ConnectHubSpotMutationVariables>;
export const ConnectWebflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConnectWebflow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"connectWebflow"}}]}}]} as unknown as DocumentNode<ConnectWebflowMutation, ConnectWebflowMutationVariables>;
export const CreateAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateAppSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAppSubscriptionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAppSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateAppSubscriptionMutation, CreateAppSubscriptionMutationVariables>;
export const CreateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArticleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"default"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}}]}}]}}]} as unknown as DocumentNode<CreateArticleMutation, CreateArticleMutationVariables>;
export const CreateCustomFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomFieldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomField"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<CreateCustomFieldMutation, CreateCustomFieldMutationVariables>;
export const CreateCustomFieldGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomFieldGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomFieldGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomFieldGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCustomFieldGroupMutation, CreateCustomFieldGroupMutationVariables>;
export const CreateCustomFieldValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCustomFieldValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCustomFieldValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCustomFieldValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CreateCustomFieldValueMutation, CreateCustomFieldValueMutationVariables>;
export const CreateDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDeskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<CreateDeskMutation, CreateDeskMutationVariables>;
export const CreateInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateInvitationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateInvitationMutation, CreateInvitationMutationVariables>;
export const CreateLinterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateLinter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateLinterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createLinter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]}}]} as unknown as DocumentNode<CreateLinterMutation, CreateLinterMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThreadNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const CreateScraperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateScraper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createScraper"}}]}}]} as unknown as DocumentNode<CreateScraperMutation, CreateScraperMutationVariables>;
export const CreateScraperSelectorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateScraperSelector"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateScraperSelectorInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createScraperSelector"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]} as unknown as DocumentNode<CreateScraperSelectorMutation, CreateScraperSelectorMutationVariables>;
export const CreateSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateSiteMutation, CreateSiteMutationVariables>;
export const CreateStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateStageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]}}]} as unknown as DocumentNode<CreateStageMutation, CreateStageMutationVariables>;
export const CreateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<CreateTagMutation, CreateTagMutationVariables>;
export const CreateThreadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateThread"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateArticleThreadInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createArticleThread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"article_id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"resolved_at"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateThreadMutation, CreateThreadMutationVariables>;
export const CreateTrialAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTrialAppSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTrialAppSubscription"}}]}}]} as unknown as DocumentNode<CreateTrialAppSubscriptionMutation, CreateTrialAppSubscriptionMutationVariables>;
export const CreateWebflowCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateWebflowCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateWebflowCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createWebflowCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<CreateWebflowCollectionMutation, CreateWebflowCollectionMutationVariables>;
export const DeactivateIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<DeactivateIntegrationMutation, DeactivateIntegrationMutationVariables>;
export const DeactivateWebflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeactivateWebflow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deactivateWebflow"}}]}}]} as unknown as DocumentNode<DeactivateWebflowMutation, DeactivateWebflowMutationVariables>;
export const DeleteAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const DeleteArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteArticleMutation, DeleteArticleMutationVariables>;
export const DeleteCustomFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomField"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<DeleteCustomFieldMutation, DeleteCustomFieldMutationVariables>;
export const DeleteCustomFieldGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomFieldGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomFieldGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCustomFieldGroupMutation, DeleteCustomFieldGroupMutationVariables>;
export const DeleteCustomFieldValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCustomFieldValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCustomFieldValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DeleteCustomFieldValueMutation, DeleteCustomFieldValueMutationVariables>;
export const DeleteDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteDeskMutation, DeleteDeskMutationVariables>;
export const DeleteLinterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteLinter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteLinter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<DeleteLinterMutation, DeleteLinterMutationVariables>;
export const DeleteScraperArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteScraperArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteScraperArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"successful"}}]}}]}}]} as unknown as DocumentNode<DeleteScraperArticleMutation, DeleteScraperArticleMutationVariables>;
export const DeleteSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<DeleteSiteMutation, DeleteSiteMutationVariables>;
export const DeleteSiteContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSiteContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSiteContent"}}]}}]} as unknown as DocumentNode<DeleteSiteContentMutation, DeleteSiteContentMutationVariables>;
export const DeleteSlackChannelsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSlackChannels"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSlackChannelsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSlackChannels"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<DeleteSlackChannelsMutation, DeleteSlackChannelsMutationVariables>;
export const DeleteStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]}}]} as unknown as DocumentNode<DeleteStageMutation, DeleteStageMutationVariables>;
export const DeleteTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeleteTagMutation, DeleteTagMutationVariables>;
export const DeleteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const DisconnectHubSpotDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectHubSpot"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectHubSpot"}}]}}]} as unknown as DocumentNode<DisconnectHubSpotMutation, DisconnectHubSpotMutationVariables>;
export const DisconnectIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<DisconnectIntegrationMutation, DisconnectIntegrationMutationVariables>;
export const DisconnectStripeConnectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectStripeConnect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectStripeConnect"}}]}}]} as unknown as DocumentNode<DisconnectStripeConnectMutation, DisconnectStripeConnectMutationVariables>;
export const DisconnectWebflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectWebflow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectWebflow"}}]}}]} as unknown as DocumentNode<DisconnectWebflowMutation, DisconnectWebflowMutationVariables>;
export const DisconnectWordpressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DisconnectWordpress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"disconnectWordPress"}}]}}]} as unknown as DocumentNode<DisconnectWordpressMutation, DisconnectWordpressMutationVariables>;
export const DuplicateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DuplicateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"duplicateArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DuplicateArticleMutation, DuplicateArticleMutationVariables>;
export const EnableCustomDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"EnableCustomDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnableCustomDomainInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"enableCustomDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"custom_domain"}},{"kind":"Field","name":{"kind":"Name","value":"custom_domain_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]} as unknown as DocumentNode<EnableCustomDomainMutation, EnableCustomDomainMutationVariables>;
export const ExportSiteContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExportSiteContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exportSiteContent"}}]}}]} as unknown as DocumentNode<ExportSiteContentMutation, ExportSiteContentMutationVariables>;
export const ExportSubscribersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ExportSubscribers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"exportSubscribers"}}]}}]} as unknown as DocumentNode<ExportSubscribersMutation, ExportSubscribersMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailString"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const GenerateNewstandKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateNewstandKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateNewstandKey"}}]}}]} as unknown as DocumentNode<GenerateNewstandKeyMutation, GenerateNewstandKeyMutationVariables>;
export const GetSlackChannelsListDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GetSlackChannelsList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSlackChannelsList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"is_private"}}]}}]}}]} as unknown as DocumentNode<GetSlackChannelsListMutation, GetSlackChannelsListMutationVariables>;
export const ImpersonateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Impersonate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"impersonate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}]}]}}]} as unknown as DocumentNode<ImpersonateMutation, ImpersonateMutationVariables>;
export const ImportSiteContentFromWordPressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportSiteContentFromWordPress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImportSiteContentFromWordPressInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importSiteContentFromWordPress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ImportSiteContentFromWordPressMutation, ImportSiteContentFromWordPressMutationVariables>;
export const ImportSubscribersFromCsvFileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImportSubscribersFromCsvFile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"file"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Upload"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"importSubscribersFromCsvFile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"file"},"value":{"kind":"Variable","name":{"kind":"Name","value":"file"}}}]}}]}]}}]} as unknown as DocumentNode<ImportSubscribersFromCsvFileMutation, ImportSubscribersFromCsvFileMutationVariables>;
export const InitializeCustomDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitializeCustomDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InitializeCustomDomainInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initializeCustomDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}},{"kind":"Field","name":{"kind":"Name","value":"redirect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}}]}}]}}]}}]} as unknown as DocumentNode<InitializeCustomDomainMutation, InitializeCustomDomainMutationVariables>;
export const LaunchSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LaunchSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"launchSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<LaunchSubscriptionMutation, LaunchSubscriptionMutationVariables>;
export const LeavePublicationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeavePublication"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leavePublication"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<LeavePublicationMutation, LeavePublicationMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EmailString"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"access_token"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const MoveArticleAfterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"moveArticleAfter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveArticleAfterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveArticleAfter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<MoveArticleAfterMutation, MoveArticleAfterMutationVariables>;
export const MoveArticleBeforeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"moveArticleBefore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveArticleBeforeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveArticleBefore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<MoveArticleBeforeMutation, MoveArticleBeforeMutationVariables>;
export const MoveArticleToDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"moveArticleToDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"desk_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveArticleToDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"desk_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"desk_id"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<MoveArticleToDeskMutation, MoveArticleToDeskMutationVariables>;
export const MoveDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveDeskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoveDeskMutation, MoveDeskMutationVariables>;
export const MoveDeskAfterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveDeskAfter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveDeskAfterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveDeskAfter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoveDeskAfterMutation, MoveDeskAfterMutationVariables>;
export const MoveDeskBeforeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MoveDeskBefore"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MoveDeskBeforeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"moveDeskBefore"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<MoveDeskBeforeMutation, MoveDeskBeforeMutationVariables>;
export const PreviewAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PreviewAppSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"PreviewAppSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"previewAppSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credit"}},{"kind":"Field","name":{"kind":"Name","value":"discount"}},{"kind":"Field","name":{"kind":"Name","value":"subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"tax"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<PreviewAppSubscriptionMutation, PreviewAppSubscriptionMutationVariables>;
export const PublishArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PublishArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"time"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"now"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useServerTime"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publishArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"time"},"value":{"kind":"Variable","name":{"kind":"Name","value":"time"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"now"},"value":{"kind":"Variable","name":{"kind":"Name","value":"now"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"useServerCurrentTime"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useServerTime"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<PublishArticleMutation, PublishArticleMutationVariables>;
export const PullShopifyCustomersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PullShopifyCustomers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullShopifyCustomers"}}]}}]} as unknown as DocumentNode<PullShopifyCustomersMutation, PullShopifyCustomersMutationVariables>;
export const PullShopifyContentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PullShopifyContent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullShopifyContent"}}]}}]} as unknown as DocumentNode<PullShopifyContentMutation, PullShopifyContentMutationVariables>;
export const PullWebflowCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PullWebflowCollections"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refresh"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullWebflowCollections"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refresh"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refresh"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<PullWebflowCollectionsMutation, PullWebflowCollectionsMutationVariables>;
export const PullWebflowSitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PullWebflowSites"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"refresh"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pullWebflowSites"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"refresh"},"value":{"kind":"Variable","name":{"kind":"Name","value":"refresh"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customDomains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultDomain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<PullWebflowSitesMutation, PullWebflowSitesMutationVariables>;
export const RemoveAuthorFromArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeAuthorFromArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeAuthorFromArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveAuthorFromArticleMutation, RemoveAuthorFromArticleMutationVariables>;
export const RemoveCustomDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveCustomDomain"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeCustomDomain"}}]}}]} as unknown as DocumentNode<RemoveCustomDomainMutation, RemoveCustomDomainMutationVariables>;
export const RemoveNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trashed"},"value":{"kind":"EnumValue","value":"WITH"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveNoteMutation, RemoveNoteMutationVariables>;
export const RemoveTagFromArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeTagFromArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tagId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeTagFromArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"tag_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tagId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveTagFromArticleMutation, RemoveTagFromArticleMutationVariables>;
export const RequestAppSetupIntentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestAppSetupIntent"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestAppSetupIntent"}}]}}]} as unknown as DocumentNode<RequestAppSetupIntentMutation, RequestAppSetupIntentMutationVariables>;
export const RequestPresignedUploadUrlDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RequestPresignedUploadURL"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"md5"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestPresignedUploadURL"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"md5"},"value":{"kind":"Variable","name":{"kind":"Name","value":"md5"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"signature"}}]}}]}}]} as unknown as DocumentNode<RequestPresignedUploadUrlMutation, RequestPresignedUploadUrlMutationVariables>;
export const RequestStripeConnectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"requestStripeConnect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"requestStripeConnect"}}]}}]} as unknown as DocumentNode<RequestStripeConnectMutation, RequestStripeConnectMutationVariables>;
export const ResendConfirmEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendConfirmEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendConfirmEmail"}}]}}]} as unknown as DocumentNode<ResendConfirmEmailMutation, ResendConfirmEmailMutationVariables>;
export const ResendInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResendInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resendInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<ResendInvitationMutation, ResendInvitationMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const ResolveThreadDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResolveThread"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resolveArticleThread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"resolved_at"}}]}}]}}]} as unknown as DocumentNode<ResolveThreadMutation, ResolveThreadMutationVariables>;
export const RestoreArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"restoreArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"restoreArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RestoreArticleMutation, RestoreArticleMutationVariables>;
export const ResumeAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ResumeAppSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resumeAppSubscription"}}]}}]} as unknown as DocumentNode<ResumeAppSubscriptionMutation, ResumeAppSubscriptionMutationVariables>;
export const RevokeInvitationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeInvitation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeInvitation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RevokeInvitationMutation, RevokeInvitationMutationVariables>;
export const RevokeSubscriberSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeSubscriberSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeSubscriberSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<RevokeSubscriberSubscriptionMutation, RevokeSubscriberSubscriptionMutationVariables>;
export const RevokeUserFromDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RevokeUserFromDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deskId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revokeUserFromDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"user_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"desk_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deskId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RevokeUserFromDeskMutation, RevokeUserFromDeskMutationVariables>;
export const RunScraperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RunScraper"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"runScraper"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"type"},"value":{"kind":"EnumValue","value":"full"}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<RunScraperMutation, RunScraperMutationVariables>;
export const SendArticleNewsletterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"sendArticleNewsletter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendArticleNewsletter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"articleId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SendArticleNewsletterMutation, SendArticleNewsletterMutationVariables>;
export const SetupShopifyOauthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetupShopifyOauth"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setupShopifyOauth"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<SetupShopifyOauthMutation, SetupShopifyOauthMutationVariables>;
export const SetupWordpressDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SetupWordpress"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"setupWordPress"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}}]}]}}]} as unknown as DocumentNode<SetupWordpressMutation, SetupWordpressMutationVariables>;
export const SignIframelySignatureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIframelySignature"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"params"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIframelySignature"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"params"},"value":{"kind":"Variable","name":{"kind":"Name","value":"params"}}}]}]}}]} as unknown as DocumentNode<SignIframelySignatureMutation, SignIframelySignatureMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"access_token"}},{"kind":"Field","name":{"kind":"Name","value":"token_type"}},{"kind":"Field","name":{"kind":"Name","value":"expires_in"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}}]}}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const SortArticleByDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SortArticleBy"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleSortBy"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sortArticleBy"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"stage_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stageId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"sort_by"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}}]}}]}]}}]} as unknown as DocumentNode<SortArticleByMutation, SortArticleByMutationVariables>;
export const SubscribeSubscribersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SubscribeSubscribers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribeSubscribers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<SubscribeSubscribersMutation, SubscribeSubscribersMutationVariables>;
export const SuspendUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SuspendUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"suspendUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}}]}}]}}]} as unknown as DocumentNode<SuspendUserMutation, SuspendUserMutationVariables>;
export const SwapAppSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SwapAppSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SwapAppSubscriptionInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"swapAppSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SwapAppSubscriptionMutation, SwapAppSubscriptionMutationVariables>;
export const SyncGroupableToCustomFieldGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SyncGroupableToCustomFieldGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SyncGroupableToCustomFieldGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"syncGroupableToCustomFieldGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<SyncGroupableToCustomFieldGroupMutation, SyncGroupableToCustomFieldGroupMutationVariables>;
export const TransferDeskArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"transferDeskArticles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"TransferDeskArticlesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferDeskArticles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<TransferDeskArticlesMutation, TransferDeskArticlesMutationVariables>;
export const TriggerSiteBuildDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TriggerSiteBuild"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TriggerSiteBuildInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"triggerSiteBuild"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<TriggerSiteBuildMutation, TriggerSiteBuildMutationVariables>;
export const UnpublishArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnpublishArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unpublishArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<UnpublishArticleMutation, UnpublishArticleMutationVariables>;
export const UnsubscribeSubscribersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsubscribeSubscribers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsubscribeSubscribers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}]}]}}]} as unknown as DocumentNode<UnsubscribeSubscribersMutation, UnsubscribeSubscribersMutationVariables>;
export const UnsuspendUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UnsuspendUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ids"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsuspendUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ids"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}}]}}]}}]} as unknown as DocumentNode<UnsuspendUserMutation, UnsuspendUserMutationVariables>;
export const UpdateAppPaymentMethodDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateAppPaymentMethod"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateAppPaymentMethod"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}}]}]}}]} as unknown as DocumentNode<UpdateAppPaymentMethodMutation, UpdateAppPaymentMethodMutationVariables>;
export const UpdateArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"blurb"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"featured"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cover"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"autoPosting"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"seo"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"plan"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ArticlePlan"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"newsletter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"layoutId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateArticle"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"title"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"blurb"},"value":{"kind":"Variable","name":{"kind":"Name","value":"blurb"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"featured"},"value":{"kind":"Variable","name":{"kind":"Name","value":"featured"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"cover"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cover"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"seo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"seo"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"plan"},"value":{"kind":"Variable","name":{"kind":"Name","value":"plan"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"newsletter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"newsletter"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"auto_posting"},"value":{"kind":"Variable","name":{"kind":"Name","value":"autoPosting"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"layout_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"layoutId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"auto_posting"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter"}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}}]}}]}}]} as unknown as DocumentNode<UpdateArticleMutation, UpdateArticleMutationVariables>;
export const UpdateCustomFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomField"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomFieldInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomField"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<UpdateCustomFieldMutation, UpdateCustomFieldMutationVariables>;
export const UpdateCustomFieldGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomFieldGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomFieldGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomFieldGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCustomFieldGroupMutation, UpdateCustomFieldGroupMutationVariables>;
export const UpdateCustomFieldValueDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCustomFieldValue"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateCustomFieldValueInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCustomFieldValue"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateCustomFieldValueMutation, UpdateCustomFieldValueMutationVariables>;
export const UpdateDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDeskInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDesk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"open_access"}}]}}]}}]} as unknown as DocumentNode<UpdateDeskMutation, UpdateDeskMutationVariables>;
export const UpdateIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateIntegrationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<UpdateIntegrationMutation, UpdateIntegrationMutationVariables>;
export const UpdateLinterDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateLinter"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateLinterInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateLinter"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]}}]} as unknown as DocumentNode<UpdateLinterMutation, UpdateLinterMutationVariables>;
export const UpdateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"trashed"},"value":{"kind":"EnumValue","value":"WITH"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateNoteMutation, UpdateNoteMutationVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"contact_email"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UpdateScraperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateScraper"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateScraperInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateScraper"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"selectors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}}]}}]} as unknown as DocumentNode<UpdateScraperMutation, UpdateScraperMutationVariables>;
export const UpdateSiteInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSiteInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSiteInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"tutorials"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}}]}}]}}]} as unknown as DocumentNode<UpdateSiteInfoMutation, UpdateSiteInfoMutationVariables>;
export const UpdateSiteInfoCustomSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSiteInfoCustomSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSiteInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"custom_site_template"}}]}}]}}]} as unknown as DocumentNode<UpdateSiteInfoCustomSiteMutation, UpdateSiteInfoCustomSiteMutationVariables>;
export const UpdateStageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateStage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateStageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateStage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]}}]} as unknown as DocumentNode<UpdateStageMutation, UpdateStageMutationVariables>;
export const UpdateSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"EnableSubscriptionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSubscription"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscription_setup"}}]}}]}}]} as unknown as DocumentNode<UpdateSubscriptionMutation, UpdateSubscriptionMutationVariables>;
export const UpdateTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UpdateTagMutation, UpdateTagMutationVariables>;
export const UpdateUserMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserMeta"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meta"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meta"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meta"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}}]}}]}}]} as unknown as DocumentNode<UpdateUserMetaMutation, UpdateUserMetaMutationVariables>;
export const UpdateWebflowCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWebflowCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWebflowCollectionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWebflowCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateWebflowCollectionMutation, UpdateWebflowCollectionMutationVariables>;
export const UpdateWebflowCollectionMappingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWebflowCollectionMapping"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWebflowCollectionMappingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWebflowCollectionMapping"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateWebflowCollectionMappingMutation, UpdateWebflowCollectionMappingMutationVariables>;
export const UpdateWebflowDomainDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWebflowDomain"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWebflowDomainInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWebflowDomain"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateWebflowDomainMutation, UpdateWebflowDomainMutationVariables>;
export const UpdateWebflowSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWebflowSite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateWebflowSiteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWebflowSite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UpdateWebflowSiteMutation, UpdateWebflowSiteMutationVariables>;
export const UploadImageDocumentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadImageDocument"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadImageInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<UploadImageDocumentMutation, UploadImageDocumentMutationVariables>;
export const UploadSiteTemplateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadSiteTemplate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadSiteTemplateInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadSiteTemplate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]} as unknown as DocumentNode<UploadSiteTemplateMutation, UploadSiteTemplateMutationVariables>;
export const CustomFieldGroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CustomFieldGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customFieldGroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectOptions"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"metafields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"collection_id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<CustomFieldGroupsQuery, CustomFieldGroupsQueryVariables>;
export const DesksCustomFieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DesksCustomField"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sid"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metafields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"collection_id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<DesksCustomFieldQuery, DesksCustomFieldQueryVariables>;
export const GetAppSubscriptionPlansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAppSubscriptionPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"appSubscriptionPlans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"group"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"price"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"interval_count"}},{"kind":"Field","name":{"kind":"Name","value":"usage_type"}}]}}]}}]} as unknown as DocumentNode<GetAppSubscriptionPlansQuery, GetAppSubscriptionPlansQueryVariables>;
export const GetArticleContentBlockDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArticleContentBlock"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content_blocks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}}]} as unknown as DocumentNode<GetArticleContentBlockQuery, GetArticleContentBlockQueryVariables>;
export const GetArticleInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArticleInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]} as unknown as DocumentNode<GetArticleInfoQuery, GetArticleInfoQueryVariables>;
export const GetArticleMetafieldDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArticleMetafield"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"metafields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldNumberValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldColorValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldUrlValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldFileValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldDateValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldJsonValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectValue"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"collection_id"}}]}}]}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldNumberValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldColorValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldUrlValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldBooleanValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldRichTextValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldFileValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldDateValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldJsonValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetArticleMetafieldQuery, GetArticleMetafieldQueryVariables>;
export const GetArticleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArticle"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"sid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sid"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter_at"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"cover"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"auto_posting"}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"layout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"draft"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"featured"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"relevances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"blurb"}}]}}]}}]}}]} as unknown as DocumentNode<GetArticleQuery, GetArticleQueryVariables>;
export const GetArticleSearchKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetArticleSearchKey"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"articleSearchKey"}}]}}]} as unknown as DocumentNode<GetArticleSearchKeyQuery, GetArticleSearchKeyQueryVariables>;
export const GetBillingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBilling"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"billing"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"has_pm"}},{"kind":"Field","name":{"kind":"Name","value":"pm_type"}},{"kind":"Field","name":{"kind":"Name","value":"pm_last_four"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"plan_id"}},{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"quantity"}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_date"}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_subtotal"}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_discounts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"amount_off"}},{"kind":"Field","name":{"kind":"Name","value":"percent_off"}}]}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_tax"}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_taxes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"jurisdiction"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}},{"kind":"Field","name":{"kind":"Name","value":"next_pm_total"}},{"kind":"Field","name":{"kind":"Name","value":"credit_balance"}},{"kind":"Field","name":{"kind":"Name","value":"on_trial"}},{"kind":"Field","name":{"kind":"Name","value":"trial_ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"canceled"}},{"kind":"Field","name":{"kind":"Name","value":"on_grace_period"}},{"kind":"Field","name":{"kind":"Name","value":"ends_at"}},{"kind":"Field","name":{"kind":"Name","value":"publications_quota"}},{"kind":"Field","name":{"kind":"Name","value":"publications_count"}},{"kind":"Field","name":{"kind":"Name","value":"seats_in_use"}},{"kind":"Field","name":{"kind":"Name","value":"has_historical_subscriptions"}},{"kind":"Field","name":{"kind":"Name","value":"referer"}}]}}]}}]} as unknown as DocumentNode<GetBillingQuery, GetBillingQueryVariables>;
export const GetCreditsOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCreditsOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"creditsOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}}]}}]} as unknown as DocumentNode<GetCreditsOverviewQuery, GetCreditsOverviewQueryVariables>;
export const GetCreditsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCredits"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"credits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"earned_from"}},{"kind":"Field","name":{"kind":"Name","value":"earned_at"}},{"kind":"Field","name":{"kind":"Name","value":"used"}},{"kind":"Field","name":{"kind":"Name","value":"used_at"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"initialized_at"}}]}}]}}]}}]} as unknown as DocumentNode<GetCreditsQuery, GetCreditsQueryVariables>;
export const GetCustomFieldGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomFieldGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"customFieldGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"options"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"multiline"}},{"kind":"Field","alias":{"kind":"Name","value":"textMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"textMax"},"name":{"kind":"Name","value":"max"}},{"kind":"Field","name":{"kind":"Name","value":"regex"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"float"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMin"},"name":{"kind":"Name","value":"min"}},{"kind":"Field","alias":{"kind":"Name","value":"numberMax"},"name":{"kind":"Name","value":"max"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}},{"kind":"Field","name":{"kind":"Name","value":"time"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldIgnoreOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"repeat"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldSelectOptions"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"target"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}},{"kind":"Field","name":{"kind":"Name","value":"collection_id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldSelectOptions"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectOptions"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"required"}},{"kind":"Field","name":{"kind":"Name","value":"placeholder"}},{"kind":"Field","name":{"kind":"Name","value":"choices"}},{"kind":"Field","name":{"kind":"Name","value":"multiple"}}]}}]} as unknown as DocumentNode<GetCustomFieldGroupQuery, GetCustomFieldGroupQueryVariables>;
export const GetDesignDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDesign"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"design"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"draft"}}]}}]}}]} as unknown as DocumentNode<GetDesignQuery, GetDesignQueryVariables>;
export const GetDeskDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDesk"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"desk"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"sid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sid"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"metafields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDeskQuery, GetDeskQueryVariables>;
export const GetImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"key"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"image"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"key"},"value":{"kind":"Variable","name":{"kind":"Name","value":"key"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}}]}}]}}]} as unknown as DocumentNode<GetImageQuery, GetImageQueryVariables>;
export const GetIntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetIntegrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<GetIntegrationsQuery, GetIntegrationsQueryVariables>;
export const GetLayoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLayout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"layouts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"template"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"preview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}}]}}]} as unknown as DocumentNode<GetLayoutQuery, GetLayoutQueryVariables>;
export const GetMeAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intercom_hash_identity"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"job_title"}},{"kind":"Field","name":{"kind":"Name","value":"contact_email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"last_seen_at"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}}]}}]}}]} as unknown as DocumentNode<GetMeAccountQuery, GetMeAccountQueryVariables>;
export const GetMeEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeEmail"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"intercom_hash_identity"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"signed_up_source"}}]}}]}}]} as unknown as DocumentNode<GetMeEmailQuery, GetMeEmailQueryVariables>;
export const GetMeMetaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeMeta"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"meta"}}]}}]}}]} as unknown as DocumentNode<GetMeMetaQuery, GetMeMetaQueryVariables>;
export const GetMeProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}}]}}]} as unknown as DocumentNode<GetMeProfileQuery, GetMeProfileQueryVariables>;
export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intercom_hash_identity"}},{"kind":"Field","name":{"kind":"Name","value":"signed_up_source"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"last_seen_at"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetPagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}}]}}]} as unknown as DocumentNode<GetPagesQuery, GetPagesQueryVariables>;
export const GetRolesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetRoles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"level"}}]}}]}}]} as unknown as DocumentNode<GetRolesQuery, GetRolesQueryVariables>;
export const GetScraperPendingInviteUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetScraperPendingInviteUsers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scraperPendingInviteUsers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<GetScraperPendingInviteUsersQuery, GetScraperPendingInviteUsersQueryVariables>;
export const GetSiteCustomSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSiteCustomSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"custom_site_template"}},{"kind":"Field","name":{"kind":"Name","value":"newstand_key"}},{"kind":"Field","name":{"kind":"Name","value":"typesense_search_only_key"}}]}}]}}]} as unknown as DocumentNode<GetSiteCustomSiteQuery, GetSiteCustomSiteQueryVariables>;
export const GetSiteTemplatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSiteTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"siteTemplates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetSiteTemplatesQuery, GetSiteTemplatesQueryVariables>;
export const GetSiteTutorialsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSiteTutorials"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"tutorials"}}]}}]}}]} as unknown as DocumentNode<GetSiteTutorialsQuery, GetSiteTutorialsQueryVariables>;
export const GetSiteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSite"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}},{"kind":"Field","name":{"kind":"Name","value":"logo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"mime"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"caption"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"transformation"}}]}},{"kind":"Field","name":{"kind":"Name","value":"timezone"}},{"kind":"Field","name":{"kind":"Name","value":"site_domain"}},{"kind":"Field","name":{"kind":"Name","value":"mail_domain"}},{"kind":"Field","name":{"kind":"Name","value":"custom_domain"}},{"kind":"Field","name":{"kind":"Name","value":"customer_site_domain"}},{"kind":"Field","name":{"kind":"Name","value":"customer_site_storipress_url"}},{"kind":"Field","name":{"kind":"Name","value":"custom_domain_email"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hostname"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subscription_setup"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"currency"}},{"kind":"Field","name":{"kind":"Name","value":"monthly_price"}},{"kind":"Field","name":{"kind":"Name","value":"yearly_price"}},{"kind":"Field","name":{"kind":"Name","value":"plan"}},{"kind":"Field","name":{"kind":"Name","value":"lang"}},{"kind":"Field","name":{"kind":"Name","value":"paywall_config"}}]}}]}}]} as unknown as DocumentNode<GetSiteQuery, GetSiteQueryVariables>;
export const GetStagesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"stages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"ready"}},{"kind":"Field","name":{"kind":"Name","value":"default"}}]}}]}}]} as unknown as DocumentNode<GetStagesQuery, GetStagesQueryVariables>;
export const GetTagDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTag"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tag"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"sid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sid"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"sid"}},{"kind":"Field","name":{"kind":"Name","value":"metafields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"values"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldNumberValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"numberValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldColorValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldUrlValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldBooleanValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"booleanValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldRichTextValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldFileValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"fileValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"size"}},{"kind":"Field","name":{"kind":"Name","value":"mime_type"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldDateValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"dateValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldJsonValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"jsonValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldSelectValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"selectValue"},"name":{"kind":"Name","value":"value"}}]}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"CustomFieldReferenceValue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"group"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"CustomFieldReferenceValue"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"CustomFieldReferenceValue"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","alias":{"kind":"Name","value":"referenceValue"},"name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Tag"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowReference"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<GetTagQuery, GetTagQueryVariables>;
export const GetTagsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetTagsQuery, GetTagsQueryVariables>;
export const GetUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserQuery, GetUserQueryVariables>;
export const GetUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"includeInvitations"},"value":{"kind":"BooleanValue","value":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"intercom_hash_identity"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"location"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"website"}},{"kind":"Field","name":{"kind":"Name","value":"socials"}},{"kind":"Field","name":{"kind":"Name","value":"last_seen_at"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}},{"kind":"Field","name":{"kind":"Name","value":"order"}}]}}]}}]}}]} as unknown as DocumentNode<GetUsersQuery, GetUsersQueryVariables>;
export const GetWebflowCollectionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWebflowCollection"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowCollectionType"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowCollection"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"fields"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"isRequired"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"candidates"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"mappings"}}]}}]}}]} as unknown as DocumentNode<GetWebflowCollectionQuery, GetWebflowCollectionQueryVariables>;
export const GetWordpressAuthorizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordpressAuthorized"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordPressAuthorized"}}]}}]} as unknown as DocumentNode<GetWordpressAuthorizedQuery, GetWordpressAuthorizedQueryVariables>;
export const GetWordpressInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWordpressInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"wordPressInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"site_name"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"version"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<GetWordpressInfoQuery, GetWordpressInfoQueryVariables>;
export const HubSpotInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HubSpotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubSpotInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<HubSpotInfoQuery, HubSpotInfoQueryVariables>;
export const HubSpotAuthorizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HubSpotAuthorized"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hubSpotAuthorized"}}]}}]} as unknown as DocumentNode<HubSpotAuthorizedQuery, HubSpotAuthorizedQueryVariables>;
export const IframelyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Iframely"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"IframelyIframelyInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"iframelyIframely"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<IframelyQuery, IframelyQueryVariables>;
export const ListArticlesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListArticles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"range"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DateRange"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"unscheduled"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"articles"},"name":{"kind":"Name","value":"articlesAll"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"range"},"value":{"kind":"Variable","name":{"kind":"Name","value":"range"}}},{"kind":"Argument","name":{"kind":"Name","value":"unscheduled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"unscheduled"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SchedulableArticle"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SchedulableArticle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scheduled"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"published_at"}},{"kind":"Field","name":{"kind":"Name","value":"stage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"icon"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updated_at"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"tags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ListArticlesQuery, ListArticlesQueryVariables>;
export const ListDesksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListDesks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"open_access"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"order"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListDesksQuery, ListDesksQueryVariables>;
export const ListIntegrationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListIntegrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"integrations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"activated_at"}},{"kind":"Field","name":{"kind":"Name","value":"configuration"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"WebflowConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"LinkedInConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"FacebookConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"page_id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ShopifyConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"domain"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"myshopify_domain"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"prefix"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SlackConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TwitterConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnail"}},{"kind":"Field","name":{"kind":"Name","value":"user_id"}}]}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"IntegrationIgnoreConfiguration"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"key"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListIntegrationsQuery, ListIntegrationsQueryVariables>;
export const ListInvitationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListInvitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"invitations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListInvitationsQuery, ListInvitationsQueryVariables>;
export const ListLintersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListLinters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"linters"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListLintersQuery, ListLintersQueryVariables>;
export const ListPublicationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListPublications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"publications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"}}]}}]}}]} as unknown as DocumentNode<ListPublicationsQuery, ListPublicationsQueryVariables>;
export const ListSimpleUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListSimpleUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"users"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"suspended"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"desks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"desk"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ListSimpleUsersQuery, ListSimpleUsersQueryVariables>;
export const ListThreadsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListThreads"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"article"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"threads"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Thread"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Note"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThreadNote"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}}]}},{"kind":"Field","name":{"kind":"Name","value":"thread"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"Thread"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ArticleThread"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"position"}},{"kind":"Field","name":{"kind":"Name","value":"resolved_at"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"Note"}}]}}]}}]} as unknown as DocumentNode<ListThreadsQuery, ListThreadsQueryVariables>;
export const ListWebflowCollectionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWebflowCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowCollections"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<ListWebflowCollectionsQuery, ListWebflowCollectionsQueryVariables>;
export const ListWebflowItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWebflowItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"collection_id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowItems"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"collection_id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"collection_id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<ListWebflowItemsQuery, ListWebflowItemsQueryVariables>;
export const ListWebflowSitesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWebflowSites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowSites"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customDomains"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultDomain"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}}]}}]} as unknown as DocumentNode<ListWebflowSitesQuery, ListWebflowSitesQueryVariables>;
export const ListWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListWorkspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workspaces"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"workspace"}},{"kind":"Field","name":{"kind":"Name","value":"custom_domain"}},{"kind":"Field","name":{"kind":"Name","value":"customer_site_domain"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"favicon"}}]}}]}}]} as unknown as DocumentNode<ListWorkspacesQuery, ListWorkspacesQueryVariables>;
export const ReleasesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Releases"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"releases"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]}}]} as unknown as DocumentNode<ReleasesQuery, ReleasesQueryVariables>;
export const ScraperDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Scraper"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"scraper"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"selectors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"data"}}]}},{"kind":"Field","name":{"kind":"Name","value":"articles"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"10"}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"path"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"successful"}},{"kind":"Field","name":{"kind":"Name","value":"scraped"}},{"kind":"Field","name":{"kind":"Name","value":"scraped_at"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ScraperQuery, ScraperQueryVariables>;
export const SubscriberEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriberEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"40"}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"defaultValue":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"events"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"firstItem"}},{"kind":"Field","name":{"kind":"Name","value":"hasMorePages"}},{"kind":"Field","name":{"kind":"Name","value":"lastItem"}},{"kind":"Field","name":{"kind":"Name","value":"lastPage"}},{"kind":"Field","name":{"kind":"Name","value":"perPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"data"}},{"kind":"Field","name":{"kind":"Name","value":"occurred_at"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubscriberEventArticle"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubscriberEventPage"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubscriberEventDesk"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubscriberEventUser"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubscriberEventEmail"}}]}}]}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventArticle"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventPage"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Page"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventDesk"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Desk"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventUser"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubscriberEventEmail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Email"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subject"}},{"kind":"Field","name":{"kind":"Name","value":"target"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Article"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"seo"}}]}}]}}]}}]} as unknown as DocumentNode<SubscriberEventQuery, SubscriberEventQueryVariables>;
export const SubscriberStatsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriberStats"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriber"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"bounced"}},{"kind":"Field","name":{"kind":"Name","value":"first_name"}},{"kind":"Field","name":{"kind":"Name","value":"last_name"}},{"kind":"Field","name":{"kind":"Name","value":"full_name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_type"}},{"kind":"Field","name":{"kind":"Name","value":"first_paid_at"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed_at"}},{"kind":"Field","name":{"kind":"Name","value":"renew_on"}},{"kind":"Field","name":{"kind":"Name","value":"canceled_at"}},{"kind":"Field","name":{"kind":"Name","value":"expire_on"}},{"kind":"Field","name":{"kind":"Name","value":"signed_up_source"}},{"kind":"Field","name":{"kind":"Name","value":"paid_up_source"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"active_days_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"comments_total"}},{"kind":"Field","name":{"kind":"Name","value":"comments_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"comments_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"shares_total"}},{"kind":"Field","name":{"kind":"Name","value":"shares_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"shares_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"email_receives"}},{"kind":"Field","name":{"kind":"Name","value":"email_opens_total"}},{"kind":"Field","name":{"kind":"Name","value":"email_opens_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"email_opens_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_opens_total"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_opens_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_opens_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"email_link_clicks_total"}},{"kind":"Field","name":{"kind":"Name","value":"email_link_clicks_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"email_link_clicks_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_link_clicks_total"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_link_clicks_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"unique_email_link_clicks_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"article_views_total"}},{"kind":"Field","name":{"kind":"Name","value":"article_views_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"article_views_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"unique_article_views_total"}},{"kind":"Field","name":{"kind":"Name","value":"unique_article_views_last_7"}},{"kind":"Field","name":{"kind":"Name","value":"unique_article_views_last_30"}},{"kind":"Field","name":{"kind":"Name","value":"verified"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}}]}}]}}]} as unknown as DocumentNode<SubscriberStatsQuery, SubscriberStatsQueryVariables>;
export const SubscribersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Subscribers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QuerySubscribersSearchSortByOrderByClause"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"*","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}},{"kind":"Argument","name":{"kind":"Name","value":"searchSortBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sortBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paginatorInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"currentPage"}},{"kind":"Field","name":{"kind":"Name","value":"total"}}]}},{"kind":"Field","name":{"kind":"Name","value":"data"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"subscription_type"}},{"kind":"Field","name":{"kind":"Name","value":"subscribed_at"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"bounced"}},{"kind":"Field","name":{"kind":"Name","value":"newsletter"}},{"kind":"Field","name":{"kind":"Name","value":"activity"}},{"kind":"Field","name":{"kind":"Name","value":"created_at"}},{"kind":"Field","name":{"kind":"Name","value":"subscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"interval"}},{"kind":"Field","name":{"kind":"Name","value":"price"}}]}}]}}]}}]}}]} as unknown as DocumentNode<SubscribersQuery, SubscribersQueryVariables>;
export const SubscriptionGraphsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriptionGraphs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionGraphs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"paid_subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}},{"kind":"Field","name":{"kind":"Name","value":"revenue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"revenue"}},{"kind":"Field","name":{"kind":"Name","value":"date"}}]}}]}}]}}]} as unknown as DocumentNode<SubscriptionGraphsQuery, SubscriptionGraphsQueryVariables>;
export const SubscriptionOverviewDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SubscriptionOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscriptionOverview"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"current"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"paid_subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"active_subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"email_sends"}},{"kind":"Field","name":{"kind":"Name","value":"email_opens"}},{"kind":"Field","name":{"kind":"Name","value":"email_clicks"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}},{"kind":"Field","name":{"kind":"Name","value":"previous"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"paid_subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"active_subscribers"}},{"kind":"Field","name":{"kind":"Name","value":"email_sends"}},{"kind":"Field","name":{"kind":"Name","value":"email_opens"}},{"kind":"Field","name":{"kind":"Name","value":"email_clicks"}},{"kind":"Field","name":{"kind":"Name","value":"revenue"}}]}}]}}]}}]} as unknown as DocumentNode<SubscriptionOverviewQuery, SubscriptionOverviewQueryVariables>;
export const UnsplashDownloadPhotoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UnsplashDownloadPhoto"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsplashDownload"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<UnsplashDownloadPhotoQuery, UnsplashDownloadPhotoQueryVariables>;
export const UnsplashListPhotosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UnsplashListPhotos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"page"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsplashList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"page"},"value":{"kind":"Variable","name":{"kind":"Name","value":"page"}}}]}]}}]} as unknown as DocumentNode<UnsplashListPhotosQuery, UnsplashListPhotosQueryVariables>;
export const UnsplashSearchPhotosDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UnsplashSearchPhotos"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UnsplashSearchInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unsplashSearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<UnsplashSearchPhotosQuery, UnsplashSearchPhotosQueryVariables>;
export const WebflowActivatedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WebflowActivated"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activated_at"}}]}}]}}]} as unknown as DocumentNode<WebflowActivatedQuery, WebflowActivatedQueryVariables>;
export const WebflowAuthorizedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WebflowAuthorized"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowAuthorized"}}]}}]} as unknown as DocumentNode<WebflowAuthorizedQuery, WebflowAuthorizedQueryVariables>;
export const WebflowInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WebflowInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site_id"}},{"kind":"Field","name":{"kind":"Name","value":"domain"}}]}}]}}]} as unknown as DocumentNode<WebflowInfoQuery, WebflowInfoQueryVariables>;
export const WebflowOnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"WebflowOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"webflowOnboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"site"}},{"kind":"Field","name":{"kind":"Name","value":"collection"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blog"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"desk"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}},{"kind":"Field","name":{"kind":"Name","value":"mapping"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"blog"}},{"kind":"Field","name":{"kind":"Name","value":"author"}},{"kind":"Field","name":{"kind":"Name","value":"desk"}},{"kind":"Field","name":{"kind":"Name","value":"tag"}}]}}]}}]}}]} as unknown as DocumentNode<WebflowOnboardingQuery, WebflowOnboardingQueryVariables>;