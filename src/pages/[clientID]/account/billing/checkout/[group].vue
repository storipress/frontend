<script setup lang="ts">
import { capitalize, isEqual } from 'lodash-es'
import type { NotificationFactory } from '@storipress/core-component'
import { Alert, Avatar, Chips, Icon, Modals as Modal, Buttons as SpButton, Toggles } from '@storipress/core-component'
import pRetry from 'p-retry'
import * as Sentry from '@sentry/vue'
import type { AccountState, StripePlansGroup, TCardBrands } from '../../definition'
import { SymbolAccountState, cardBrands, groupNameMap, plansDotPoints } from '../../definition'
import PaymentModal from '../components/PaymentModal.vue'
import CouponCodeInput from '../components/CouponCodeInput.vue'
import type { CurrentPlan } from '../hooks/useCheckoutPrice'
import useCheckoutPrice, { ErrorType } from '../hooks/useCheckoutPrice'
import { dayjs } from '~/lib/dayjs'
import type { RoleKeys } from '~/utils/definition'
import { RoleCode as Role } from '~/utils/definition'
import type { CreateAppSubscriptionInput, GetUsersQuery } from '~/graphql-operations'
import {
  ChangeUserRoleDocument,
  CreateAppSubscriptionDocument,
  GetAppSubscriptionPlansDocument,
  GetUsersDocument,
  SwapAppSubscriptionDocument,
} from '~/graphql-operations'
import { useMe } from '~/composables/permission/account'
import { addDecimal } from '~/utils'
import { HelpButton, HelpCategories } from '~/components/HelpButton'

const props = defineProps<{ clientID: string }>()

const me = useMe()
const router = useRouter()
const selectedGroup = router.currentRoute.value.params.group as StripePlansGroup
const groupName = groupNameMap[selectedGroup]
if (!(['blogger', 'publisher'] as StripePlansGroup[]).includes(selectedGroup)) {
  router.replace('/account/billing/')
}

const notifications = inject('notifications') as NotificationFactory

const { result: subscriptionPlansResult, loading: loadingGetAppSubscriptionPlans } = useQuery(
  GetAppSubscriptionPlansDocument,
)

const { load: queryUsersData, result: usersResult, loading: loadingGetUsers } = useLazyQuery(GetUsersDocument)

if (props.clientID !== '_') {
  queryUsersData()
}

type User = GetUsersQuery['users'][number]
const activeUsers = computed<User[]>(() => {
  if (!usersResult.value) {
    return [
      {
        ...me.value,
        status: 'active',
        role: 'owner',
      } as User,
    ]
  }

  const activeUsers = usersResult.value?.users.filter(({ status }) => status === 'active')
  if (!activeUsers) return []
  return activeUsers.sort((a, b) => {
    const aRole = Role[a.role as unknown as Role]
    const bRole = Role[b.role as unknown as Role]
    if (aRole < bRole) return -1
    if (aRole > bRole) return 1
    return 0
  })
})
const userSelected = ref<Record<string, boolean>>({})
const userSelectedDefault = ref<Record<string, boolean>>({})
const selectedUserLength = computed(() => Object.values(userSelected.value).filter(Boolean).length)
watch(
  () => activeUsers.value,
  (users) => {
    if (!users) return
    const paidGroup = ['owner', 'admin', 'editor']
    userSelected.value = Object.fromEntries(users.map(({ id, role }) => [id, paidGroup.includes(role ?? '')]))
    userSelectedDefault.value = { ...userSelected.value }
  },
)

const defaultPlanId = computed(() => {
  const idRegexp = new RegExp(`${selectedGroup}(?=.*yearly)`)
  const defaultPlan = subscriptionPlansResult.value?.appSubscriptionPlans?.find(({ id }) => idRegexp.test(id))
  return defaultPlan?.id ?? ''
})
const currentPlanId = ref('')
const selectedId = computed({
  get: () => (currentPlanId.value ? currentPlanId.value : defaultPlanId.value),
  set: (id) => (currentPlanId.value = id),
})

const plansList = computed<CurrentPlan[]>(() => {
  const selectedUserLength = Object.values(userSelected.value).filter(Boolean).length
  const plans =
    subscriptionPlansResult.value?.appSubscriptionPlans?.filter(({ group }) => group === selectedGroup) || []

  const monthlyPlan = plans.find(({ interval, interval_count }) => interval === 'month' && interval_count === 1)

  plans.sort((a, b) => {
    if (a.interval > b.interval) return -1
    if (a.interval < b.interval) return 1
    if (a.interval_count > b.interval_count) return -1
    if (a.interval_count < b.interval_count) return 1
    return 0
  })

  return plans.map(({ id, interval, interval_count, price, currency }) => {
    switch (true) {
      case interval_count !== 1 && interval === 'year':
        return {
          id,
          currency,
          interval,
          price: addDecimal((Number(price) * selectedUserLength).toFixed()),
          title: `${interval_count} ${interval}s`,
          subTitle: `(${currency.toUpperCase()} ${addDecimal(
            (Number(price) / (12 * interval_count)).toFixed(),
          )} x ${selectedUserLength} seats x ${12 * interval_count} months)`,
          isRecommended: false,
          savedMoney: monthlyPlan
            ? addDecimal(
                (
                  Number(monthlyPlan.price ?? 0) * interval_count * selectedUserLength * 12 -
                  Number(price) * selectedUserLength
                ).toFixed(),
              )
            : '',
        }
      case interval === 'year':
        return {
          id,
          currency,
          interval,
          price: addDecimal((Number(price) * selectedUserLength).toFixed()),
          title: 'Yearly',
          subTitle: `(${currency.toUpperCase()} ${addDecimal(
            (Number(price) / 12).toFixed(),
          )} x ${selectedUserLength} seats x ${12} months)`,
          isRecommended: Boolean(monthlyPlan),
          savedMoney: monthlyPlan
            ? addDecimal(
                (
                  Number(monthlyPlan.price ?? 0) * selectedUserLength * 12 -
                  Number(price) * selectedUserLength
                ).toFixed(),
              )
            : '',
        }
      case interval === 'month':
        return {
          id,
          currency,
          interval,
          price: addDecimal((Number(price) * selectedUserLength).toFixed()),
          title: 'Monthly',
          subTitle: `(${currency.toUpperCase()} ${addDecimal(
            price,
          )} x ${selectedUserLength} seats, calculated monthly)`,
          isRecommended: false,
          savedMoney: '',
        }
      default:
        return {
          id,
          currency,
          interval,
          price: addDecimal(price),
          title: capitalize(interval),
          subTitle: '',
          isRecommended: false,
          savedMoney: '',
        }
    }
  })
})

const currentPlan = computed(() => plansList.value?.find(({ id }) => id === selectedId.value))

const couponCode = ref('')
function onPreview() {
  notifications({
    title: 'Coupon code added',
    type: 'primary',
    content: 'Discount applied.',
  })
}

function onError(_error?: Error, errorType?: ErrorType) {
  if (errorType === ErrorType.CouponCodeError) {
    couponCode.value = ''
    return notifications({
      title: 'Invalid coupon code',
      type: 'warning',
      iconName: 'warning',
      content: 'Expired or invalid coupon',
    })
  }
  return notifications({
    title: 'Payment not successful',
    type: 'warning',
    iconName: 'warning',
    content: 'Error processing payment. Check sufficient funds or try a different payment method.',
  })
}

const {
  billing: getBillingResult,
  loading: loadingCheckoutPrice,
  refetchBilling,
  totalCredits,
  subtotalPrice,
  billedNowPrice,
  discount,
  isSubscribedPlan,
} = useCheckoutPrice(currentPlan, selectedUserLength, couponCode, onError, onPreview)

const isSamePlan = computed(() => {
  if (!isSubscribedPlan.value) return false
  return isEqual(userSelected.value, userSelectedDefault.value)
})

const paymentModalIsOpen = ref(false)
const paymentMethodDescription = computed(() => {
  if (getBillingResult.value?.billing.has_pm && getBillingResult.value?.billing.pm_type) {
    return `${cardBrands[getBillingResult.value?.billing.pm_type as TCardBrands]} ending in ${
      getBillingResult.value?.billing.pm_last_four
    }`
  }
  return 'No payment method added'
})

whenever(
  () => getBillingResult.value?.billing?.plan_id,
  (planId) => {
    if (plansList.value.some(({ id }) => id === planId)) {
      selectedId.value = planId
    }
  },
)

const {
  onDone: createSubscriptionDone,
  onError: createSubscriptionError,
  mutate: createSubscriptionMutate,
  loading: loadingCreateAppSubscription,
} = useMutation(CreateAppSubscriptionDocument)
const {
  onDone: swapSubscriptionDone,
  onError: swapSubscriptionError,
  mutate: swapSubscriptionMutate,
  loading: loadingSwapAppSubscription,
} = useMutation(SwapAppSubscriptionDocument)
function onSubmit() {
  if (isSubscribedPlan.value) {
    return changeUsersRole()
  }

  const selectedUserLength = Object.values(userSelected.value).filter(Boolean).length
  const mutate = getBillingResult.value?.billing?.subscribed ? swapSubscriptionMutate : createSubscriptionMutate
  const input: CreateAppSubscriptionInput = {
    price_id: currentPlan.value?.id ?? '',
    quantity: selectedUserLength,
  }
  if (couponCode.value) input.promotion_code = couponCode.value
  mutate({ input })
  return null
}

const { mutate: mutateChangeUserRole, loading: loadingChangeUserRole } = useMutation(ChangeUserRoleDocument)

function changeUsersRole() {
  const needChangeRoleUser = activeUsers.value.filter(({ id, role }) => {
    if (role === 'owner') return false
    if (userSelected.value[id] && Role[role as RoleKeys] > Role.editor) return true
    if (!userSelected.value[id] && Role[role as RoleKeys] <= Role.editor) return true
    return false
  })

  const changeRoleInputArray = needChangeRoleUser.map(({ id, role }) =>
    pRetry(
      () => {
        const getPermissionId = (role: RoleKeys) => {
          if (Role[role] < Role.editor) return String(Role[role])
          return String(Role.editor)
        }
        const newRole = userSelected.value[id] ? getPermissionId(role as RoleKeys) : String(Role.author)
        return mutateChangeUserRole({
          input: {
            id,
            role_id: newRole,
          },
        })
      },
      { retries: 3 },
    ),
  )

  Promise.all(changeRoleInputArray)
    .then(() => {
      notifications({
        title: 'Purchase successful!',
        type: 'primary',
        content: 'Purchase successful, plan updated.',
      })
      router.replace(`/${router.currentRoute.value.params.clientID}/account/billing`)
    })
    .catch((error: Error) => {
      notifications({
        title: 'Payment not successful',
        type: 'warning',
        iconName: 'warning',
        content: 'Issue changing user roles, contact hello@storipress.com',
      })
      router.replace(`/${router.currentRoute.value.params.clientID}/account/billing`)
      Sentry.captureException(error, (scope) => {
        scope.setTag('request_fail', 'changeUserRole')
        return scope
      })
    })
}
createSubscriptionDone(changeUsersRole)
swapSubscriptionDone(changeUsersRole)

createSubscriptionError(onError)
swapSubscriptionError(onError)

const accountState = inject(SymbolAccountState) as AccountState
accountState.showSidebar = false

const planDetails = plansDotPoints[selectedGroup]

onBeforeUnmount(() => {
  accountState.showSidebar = true
})

const isLoading = computed(
  () =>
    loadingCheckoutPrice.value ||
    loadingChangeUserRole.value ||
    loadingCreateAppSubscription.value ||
    loadingGetAppSubscriptionPlans.value ||
    loadingGetUsers.value ||
    loadingSwapAppSubscription.value,
)
</script>

<template>
  <main class="flex flex-1 gap-5 text-stone-800">
    <section class="layer-1 mt-[4.25rem] w-80 rounded-lg bg-white p-5">
      <h2 class="text-heading mb-6">1. Select the Editors in your team</h2>
      <p class="text-body mb-6 text-stone-500">
        Checked users have Editor permissions and use a paid seat. Unchecked users are converted to Authors.
      </p>
      <ul>
        <li class="text-subheading mt-3 flex">
          <p class="flex-1">TEAM MEMBER</p>
          <p class="w-11">ADMIN</p>
        </li>
        <li v-for="user in activeUsers" :key="user.id" class="mt-3 flex items-center">
          <Avatar :src="user.avatar ?? ''" class-size="w-8 h-8 flex-none" />
          <p class="text-body flex-1 pl-2 font-semibold">
            {{ user.full_name }}
            <span v-if="me?.id === user.id"> (you)</span>
          </p>
          <Toggles v-model="userSelected[user.id]" type="simple" :disabled="me?.id === user.id" />
        </li>
      </ul>
    </section>

    <div>
      <div class="mb-6 flex h-11 items-center gap-4">
        <router-link
          v-slot="{ navigate }"
          :to="`/${router.currentRoute.value.params.clientID}/account/billing/plans`"
          replace
          custom
        >
          <SpButton class="h-9 w-10 shadow-1-layer" @click="navigate">
            <Icon icon-name="arrow_left" />
          </SpButton>
        </router-link>
        <h1 class="text-pageheading">
          Upgrade to <span class="capitalize">{{ groupName }}</span>
        </h1>
      </div>
      <Alert
        v-if="getBillingResult?.billing.on_trial && getBillingResult?.billing.trial_ends_at"
        :message="`You won’t be charged until your free trial expires ${dayjs(
          getBillingResult?.billing.trial_ends_at,
        ).format('DD MMMM')}.`"
        description="It’s all part of our fair billing policy ❤️"
        alert-icon="info"
      />
      <section class="layer-1 mt-4 w-[34rem] flex-1 rounded-lg bg-white p-5">
        <div class="mb-6 flex items-center">
          <h2 class="text-heading">2. Select a billing cycle</h2>
          <HelpButton class="pt-1" :to="HelpCategories.Billing.Index">
            To learn about our billing + our fair billing policy, click this ❓ button!
          </HelpButton>
        </div>
        <p class="text-body mb-6 text-stone-500">Choose how often you’d like to be billed. You can cancel anytime.</p>
        <form class="mb-6 rounded border" @submit.prevent>
          <label
            v-for="plan in plansList"
            :key="plan.id"
            :for="plan.id"
            class="flex cursor-pointer items-center border p-4"
            :class="{ 'border-sky-600 bg-sky-600/5': selectedId === plan.id }"
          >
            <div
              class="mr-3 flex size-4 items-center justify-center rounded-full border-stone-200"
              :class="selectedId === plan.id ? 'border-0 bg-sky-700' : 'border'"
            >
              <div class="size-[0.375rem] rounded-full bg-white" />
            </div>
            <input
              :id="plan.id"
              v-model="selectedId"
              type="radio"
              name="plan"
              :value="plan.id"
              class="hidden w-0"
              :checked="selectedId === plan.id"
            />
            <div class="flex flex-1 flex-wrap content-center items-center">
              <p class="text-body mr-2 font-semibold capitalize">{{ plan.title }}</p>
              <Chips v-if="plan.isRecommended" label="Recommended" color="primary" class="border-0" />
              <p class="text-body text-stone-700">{{ plan.subTitle }}</p>
            </div>
            <p v-if="plan.savedMoney" class="text-body text-emerald-600">
              Save {{ plan.currency?.toUpperCase() }} {{ plan.savedMoney }}
            </p>
          </label>
        </form>
        <div v-if="getBillingResult?.billing?.has_pm" class="flex items-center justify-between">
          <p class="text-body text-stone-500">Billed using {{ paymentMethodDescription }}</p>
          <a href="#" class="text-body block text-sky-600" @click.prevent="paymentModalIsOpen = true">
            Update payment method
          </a>
        </div>
        <div v-else class="flex justify-end">
          <SpButton class="ml-auto" type="main" color="primary" html-type="submit" @click="paymentModalIsOpen = true">
            Add payment method
          </SpButton>
        </div>
      </section>
      <CouponCodeInput
        :enable="getBillingResult?.billing?.has_pm && !isSubscribedPlan"
        :code="couponCode"
        @submit="couponCode = $event"
      />
    </div>

    <section
      v-if="getBillingResult?.billing?.has_pm"
      class="layer-1 mt-[4.25rem] flex h-fit w-80 flex-col rounded-lg bg-white py-5"
    >
      <div class="px-5">
        <h2 class="text-display-small mb-[1.375rem]">
          Storipress
          <span class="capitalize">{{ groupName }}</span>
          plan
        </h2>
        <p class="text-body mb-[1.375rem] text-stone-500">
          <span class="uppercase">
            {{ currentPlan?.currency }}
          </span>
          {{ currentPlan?.price }} + tax every {{ currentPlan?.interval }}
        </p>
        <p class="text-body">
          You will be charged
          <span class="font-bold">{{ currentPlan?.currency?.toUpperCase() }} {{ currentPlan?.price }}</span>
          + tax<span v-if="Number(getBillingResult?.billing.credit_balance)"
            >, less
            <span class="font-bold">
              <span class="uppercase">{{ currentPlan?.currency }}</span>
              {{ addDecimal(getBillingResult?.billing.credit_balance || '') }} Credit
            </span>
          </span>
          <span v-if="getBillingResult?.billing.next_pm_date">
            on
            <span class="font-bold">
              {{ dayjs(getBillingResult?.billing.next_pm_date).format('DD MMM YYYY') }}
            </span>
          </span>
          <span v-if="getBillingResult?.billing.on_trial">, when your trial ends.</span>
        </p>
      </div>
      <hr class="mt-[1.375rem] border border-stone-200" />

      <article class="bg-stone-100/25 p-5">
        <h3 class="text-subheading mb-3 uppercase">Plan details</h3>
        <ul class="text-body list-disc pl-5 text-stone-500">
          <li v-for="text in planDetails" :key="text" class="mt-2">{{ text }}</li>
        </ul>
      </article>

      <hr class="mb-[1.375rem] border border-stone-200" />

      <div class="text-body mb-2 flex justify-between px-5">
        <p>Plan</p>
        <p>
          {{ currentPlan?.currency?.toUpperCase() }}
          {{ currentPlan?.price }}
          + tax
        </p>
      </div>
      <div class="text-body mb-2 flex justify-between px-5">
        <p>Credits</p>
        <p>
          {{ Number(totalCredits) ? '-' : '' }}
          {{ currentPlan?.currency?.toUpperCase() }}
          {{ totalCredits }}
        </p>
      </div>
      <div v-if="discount" class="text-body flex justify-between px-5">
        <p>{{ discount[0] }}</p>
        <p>
          {{ Number(discount[1]) ? '-' : '' }}
          {{ currentPlan?.currency?.toUpperCase() }}
          {{ discount[1] }}
        </p>
      </div>

      <hr class="my-[1.375rem] border border-stone-200" />

      <div class="text-body mb-2 flex justify-between px-5">
        <p>Subtotal</p>
        <p>
          {{ currentPlan?.currency?.toUpperCase() }}
          {{ subtotalPrice }}
          + tax
        </p>
      </div>
      <div class="text-body mb-[1.375rem] flex justify-between px-5 font-bold">
        <p>Billed now</p>
        <p>
          {{ currentPlan?.currency?.toUpperCase() }}
          {{ billedNowPrice }}
          + tax
        </p>
      </div>

      <SpButton
        class="mx-5 flex"
        type="main"
        color="primary"
        html-type="submit"
        :disabled="isSamePlan"
        :is-loading="isLoading"
        @click="onSubmit"
      >
        Start plan
      </SpButton>
    </section>
    <section v-else class="invisible w-80" />
  </main>
  <Modal :visible="paymentModalIsOpen" @on-modal-close="paymentModalIsOpen = false">
    <PaymentModal @close="paymentModalIsOpen = false" @updated="refetchBilling" />
  </Modal>
</template>
