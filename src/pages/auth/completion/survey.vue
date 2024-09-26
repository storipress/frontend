<route lang="yaml">
meta:
  layout: auth
</route>

<script setup lang="ts">
import { Buttons, Select } from '@storipress/core-component'
import { array as yupArray, object as yupObject } from 'yup'
import { useForm } from 'vee-validate'
import { useSignupCompletion } from './use-signup-complete'
import Card from '~/components/Auth/Card/Card.vue'
import { SurveyKey, SurveyTarget, SurveyTargetRule, useMeMeta } from '~/composables'
import { useMeStore } from '~/stores/me'
import { useWorkspaceStore } from '~/stores/workspace'
import { useSignupStore } from '~/stores/signup'

const userAnswer = reactive({}) as Record<SurveyKey, string>

const surveyQuestions = [
  {
    key: SurveyKey.Purpose,
    describe: 'What does your company do?',
    placeholder: 'B2B, B2C, Content Business ..',
  },
  { key: SurveyKey.Describes, describe: 'Which of these best describes you?', placeholder: 'Choose an option' },
  {
    key: SurveyKey.Frequency,
    describe: 'How often does your blog publish articles?',
    placeholder: 'Daily, weekly, monthly...',
  },
  { key: SurveyKey.Source, describe: 'How did you hear about Storipress?', placeholder: 'Choose an option' },
]

const surveyOptions = {
  [SurveyKey.Purpose]: [
    { key: 'B2B', describe: 'B2B Business' },
    { key: 'B2C', describe: 'B2C Business' },
    { key: 'content_business', describe: 'Content business (advertising, subscriptions)' },
    { key: 'personal', describe: 'Personal blog' },
    { key: 'other', describe: 'Other' },
  ],
  [SurveyKey.Describes]: [
    { key: 'con_strategist', describe: 'I strategize and plan content' },
    { key: 'writer', describe: 'I write content' },
    { key: 'reviewer', describe: 'I review, approve and publish content' },
    { key: 'finance', describe: 'I pay the bills' },
    { key: 'all', describe: 'All of the above' },
  ],
  [SurveyKey.Frequency]: [
    { key: 'daily', describe: 'Daily' },
    { key: 'few_times_a_week', describe: 'A few times a week' },
    { key: 'weekly', describe: 'Weekly' },
    { key: 'few_times_a_month', describe: 'A few times a month' },
    { key: 'monthly', describe: 'Monthly' },
    { key: 'never', describe: 'Never' },
  ],
  [SurveyKey.Source]: [
    { key: 'word_of_mouth', describe: 'Word of Mouth' },
    { key: 'online_advertising', describe: 'Online advertising' },
    { key: 'social_media', describe: 'Social media (LinkedIn, Facebook...)' },
    { key: 'search_engine', describe: 'Search engine (an article found on Google)' },
    { key: 'newsletters', describe: 'Newsletters' },
    { key: 'other', describe: 'Other' },
  ],
}

const schema = yupObject().shape({
  surveyOption: yupArray().of(yupObject().required().label('This')),
})
const { handleSubmit } = useForm({
  validationSchema: schema,
})
const router = useRouter()
const route = useRoute()
const meStore = useMeStore()
const userId = computed(() => meStore.userIdentification?.id ?? '')

const workspaceStore = useWorkspaceStore()
workspaceStore.prepareUserFillProfile()
const signupStore = useSignupStore()
const { source, isInvite, isCreateNewPublication, routeQuery } = toRefs(signupStore)
routeQuery.value = route.query
source.value = route.query.source as string

const { setUserMeta } = useMeMeta()
const { getIncompleteStep } = useSignupCompletion()

const surveyList = computed(() => {
  let target
  if (isInvite.value) {
    target = SurveyTarget.Invitees
  } else if (isCreateNewPublication.value) {
    target = SurveyTarget.NewPublication
  } else {
    target = SurveyTarget.NewAccount
  }

  const rules = SurveyTargetRule[target]
  if (rules === 'all') {
    return surveyQuestions
  } else {
    const ruleKeys = new Set(rules)
    return surveyQuestions.filter((question) => ruleKeys.has(question.key))
  }
})

const nextStep = handleSubmit(async () => {
  sendIdentify(userId.value, { ...userAnswer })
  await setUserMeta({ survey: userAnswer })
  sendTrackUnchecked('onboarding_step_completed', {
    step: 2,
    stepName: 'profiling',
    ...userAnswer,
  })

  if (isInvite.value) {
    if (workspaceStore.userShouldFieldProfile[route.query.client as string]) {
      router.replace(`/${route.query.client}/invited`)
      return
    }
    // I don't think this is possible to happen but just in case
    router.push(`/${route.query.client}/articles/desks/all`)
    return
  }

  const incompleteStep = await getIncompleteStep()
  if (incompleteStep) router.push(incompleteStep)
})
</script>

<template>
  <Card title="Tell us about yourself">
    <template #description>
      <p class="text-body text-stone-500">Help us tailor the experience for you</p>
    </template>
    <form class="mb-4" :validation-schema="schema" @submit.prevent>
      <div class="flex flex-col gap-y-4">
        <Select
          v-for="(question, index) in surveyList"
          :key="question.key"
          option-label-prop="describe"
          :input-id="`survey-${index}`"
          :items="surveyOptions[question.key]"
          :label="question.describe"
          :placeholder="question.placeholder"
          :name="`surveyOption[${index}]`"
          @update:model-value="(value) => (userAnswer[question.key] = value.key)"
        />
      </div>

      <Buttons
        type="main"
        color="primary"
        is-shadow
        html-type="submit"
        class="mt-[2.8rem] h-[4.5rem] w-full"
        @click="nextStep"
      >
        Next
      </Buttons>
    </form>
  </Card>
</template>
