import { NOTIFICATION_KEY } from '@storipress/core-component'
import { ParseResultType, fromUrl, parseDomain } from 'parse-domain'
import { string as yupString } from 'yup'
import { debounce } from 'lodash-es'
import { useForm } from 'vee-validate'
import { ApolloError } from '@apollo/client/core'
import delay from 'delay'
import type { CheckCustomDomainAvailabilityResponse, CustomDomain, CustomDomainDnsStatus } from '~/graphql-operations'
import {
  CheckCustomDomainAvailabilityDocument,
  CheckCustomDomainDnsStatusDocument,
  ConfirmCustomDomainDocument,
  InitializeCustomDomainDocument,
  RemoveCustomDomainDocument,
} from '~/graphql-operations'

interface CustomDomainDnsInput {
  site?: CustomDomain[]
  mail?: CustomDomain[]
  redirect?: CustomDomain[]
}

type AvailabilityInput = Pick<CheckCustomDomainAvailabilityResponse, 'available' | 'mail' | 'redirect' | 'site'>

const DOMAIN_ALREADY_USED = 'Domain are already been used'

export const errorResponse = {
  notFound: 'record_not_found',
  invalid: 'invalid_value',
}

export function useCustomDomain(isDomainAvailable = defaultIsDomainAvailable) {
  const customDomain = reactive({
    site: '',
    mail: '',
    redirect: [],
  })

  const customDomainAvailability = reactive({}) as CheckCustomDomainAvailabilityResponse
  const customDomainDnsStatus = reactive({}) as CustomDomainDnsStatus
  const isInvalidDomain = ref(false)

  const parseResult = computed(() => parseDomain(fromUrl(customDomain.mail)))
  watch(parseResult, (val) => {
    if (val.type !== ParseResultType.Listed) {
      isInvalidDomain.value = true
      return
    }
    isInvalidDomain.value = !val.domain
  })

  const parseDomainResult = (val: string) => {
    const result = parseDomain(fromUrl(val))
    if (result.type !== ParseResultType.Listed || !result.domain) {
      return null
    }
    const { domain, topLevelDomains, subDomains } = result

    const rootDomain = [domain, ...topLevelDomains].join('.')
    const isSubDomain = subDomains.length > 0

    return {
      rootDomain,
      isSubDomain,
    }
  }

  const schema = {
    customDomain: yupString()
      .default('')
      .test('invalid-domain-with-https', 'Please remove the https:// from your domain', (value) =>
        /^(?!http|https).*/.test(value),
      )
      .test('invalid-domain', 'Invalid domain', (_value) => !isInvalidDomain.value),
  }

  const status = reactive({
    all: false,
    siteDomain: false,
    mailDomain: false,
    error: {
      site: undefined,
      mail: undefined,
    },
  })
  const checkStatusOK = (customDomain: CustomDomain[]) => {
    return customDomain.every((customDomain) => customDomain.ok)
  }
  const checkAllCustomDomainDnsStatus = ({ site = [], mail = [], redirect = [] }: CustomDomainDnsInput) => {
    Object.assign(status, {
      all: checkStatusOK([...site, ...mail, ...redirect]),
      siteDomain: checkStatusOK(site),
      mailDomain: checkStatusOK(mail),
      error: {
        site: site.find((side) => side.error)?.error,
        mail: mail.find((mail) => mail.error)?.error,
      },
    })
  }

  const { loading, mutate: mutateCheckCustomDomainAvailability } = useMutation(CheckCustomDomainAvailabilityDocument)
  const { mutate: mutateInitializeCustomDomain } = useMutation(InitializeCustomDomainDocument)
  const { mutate: mutateCheckCustomDomainDnsStatus } = useMutation(CheckCustomDomainDnsStatusDocument)
  const { mutate: mutateConfirmCustomDomain } = useMutation(ConfirmCustomDomainDocument)
  const { mutate: mutateRemoveCustomDomain } = useMutation(RemoveCustomDomainDocument)

  const { handleSubmit, setFieldError } = useForm({
    validationSchema: schema,
  })

  const checkCustomDomainAvailability = debounce(async (input: string) => {
    if (/^(http|https).*/.test(input) || isInvalidDomain.value) {
      return
    }

    try {
      const result = await mutateCheckCustomDomainAvailability({ input: { value: input } })

      if (result?.data?.checkCustomDomainAvailability) {
        const { available, mail, redirect, site } = result.data.checkCustomDomainAvailability
        Object.assign(customDomainAvailability, { available, mail, redirect, site })
        if (!isDomainAvailable(result.data.checkCustomDomainAvailability)) {
          setFieldError('customDomain', DOMAIN_ALREADY_USED)
        }
      }
    } catch (e) {
      isInvalidDomain.value = true
      setFieldError('customDomain', 'Invalid domain')
    }
  }, 500)

  const notifications = inject(NOTIFICATION_KEY)
  const errorMessage: Record<string, string> = {
    1010020: DOMAIN_ALREADY_USED,
    1010030: 'You cannot use this domain',
    other: 'An unknown error has occurred. Kindly reach out to our support team for further assistance.',
  }
  const getDomainConfiguration = handleSubmit(async (_values, { setFieldError }) => {
    const { mail, redirect, site } = customDomain
    try {
      const result = await mutateInitializeCustomDomain({
        input: { ...(mail && { mail }), ...(site && { site }), redirect: redirect.length ? redirect : [] },
      })
      if (result?.data?.initializeCustomDomain) {
        const { mail, redirect, site } = result.data.initializeCustomDomain
        Object.assign(customDomainDnsStatus, { mail, redirect, site })
      }
    } catch (e: unknown) {
      if (e instanceof ApolloError) {
        const errorCode = (e.graphQLErrors[0]?.extensions?.code as string) ?? 'other'
        setFieldError('customDomain', errorMessage[errorCode])
        if (errorCode === '1010020') {
          notifications?.({
            title: 'Domain already in use',
            type: 'warning',
            iconName: 'warning',
            content: 'Domain in use by another publication. Use a different one.',
          })
        } else if (errorCode === 'other') {
          sendTrack('custom_domain_unknown_failed')
        }
      }
    }
  })

  const checkCustomDomainDnsStatus = async () => {
    const result = await mutateCheckCustomDomainDnsStatus()

    if (result?.data?.checkCustomDomainDnsStatus) {
      const { mail, redirect, site } = result.data.checkCustomDomainDnsStatus
      Object.assign(customDomainDnsStatus, { mail, redirect, site })
      customDomain.mail = mail[0]?.domain
      customDomain.site = site[0]?.domain
    }
  }

  const activateCustomDomain = async () => {
    const result = await mutateConfirmCustomDomain()

    return result?.data?.confirmCustomDomain
  }

  const removeCustomDomain = async () => {
    const result = await mutateRemoveCustomDomain()
    // wait for 1s because communication with postmark
    if (result?.data?.removeCustomDomain) {
      await delay(1000)
    }
    return result?.data?.removeCustomDomain
  }

  const checkIncorrectHostWithDNSQuery = async (dnsRecords: CustomDomain) => {
    const { domain, hostname, type } = dnsRecords
    const result = parseDomainResult(domain)
    const resolveDnsName = `${hostname}.${result?.rootDomain}`
    const requestURL = `https://dns.google/resolve?name=${resolveDnsName}&type=${type}`

    const response = await fetch(requestURL)
    const data = await response.json()

    return Boolean(data?.Answer?.length)
  }

  return {
    customDomain,
    customDomainAvailability,
    customDomainDnsStatus,
    isInvalidDomain,
    status,
    loading,
    checkCustomDomainAvailability,
    getDomainConfiguration,
    checkCustomDomainDnsStatus,
    checkAllCustomDomainDnsStatus,
    checkIncorrectHostWithDNSQuery,
    activateCustomDomain,
    removeCustomDomain,
    parseDomainResult,
  }
}

function defaultIsDomainAvailable(input: AvailabilityInput) {
  return input.available
}
