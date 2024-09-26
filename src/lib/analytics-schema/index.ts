import { z } from 'zod'
import { aiLinterApplied } from './ai-linter-applied'
import { aiLinterDismissed } from './ai-linter-dismissed'
import { aiLinterSettingUpdated } from './ai-linter-setting-updated'
import { aiLinterSettingView } from './ai-linter-setting-view'
import { aiLinterShow } from './ai-linter-show'
import { aiSpellCheckApplied } from './ai-spell-check-applied'
import { aiSpellCheckDismissed } from './ai-spell-check-dismissed'
import { apiErrorDisplayed } from './api-error-displayed'
import { ctaDialogCanceled } from './cta-dialog-canceled'
import { ctaDialogCompleted } from './cta-dialog-completed'
import { ctaDialogOpened } from './cta-dialog-opened'
import { customDomainUnknownFailed } from './custom-domain-unknown-failed'
import { editorFocalPointSet } from './editor-focal-point-set'
import { editorFocalPointView } from './editor-focal-point-view'
import { editorHeroPhotoAdded } from './editor-hero-photo-add'
import { editorPhotoUpload } from './editor-photo-upload'
import { editorSessionStart } from './editor-session-start'
import { integrationDisabled } from './integration-disabled'
import { integrationEnabled } from './integration-enabled'
import { integrationView } from './integration-view'
import { onboardingDemoClicked } from './onboarding-demo-clicked'
import { trialPaymentCardDeclined } from './trial-payment-card-declined'
import { trialPaymentFailed } from './trial-payment-failed'
import { userBookedOnboardingCall } from './user-booked-onboarding-call'
import { userFilledSignupForm } from './user-filled-signup-form'
import { userMetaMergeFails } from './user-meta-merge-fails'
import { userSkippedTrialPayment } from './user-skipped-trial-payment'
import { webflowOnboardingStepCompleted } from './webflow-onboarding-step-completed'
import { wordpressOnboardingFailed } from './wordpress-onboarding-failed'
import { wordpressOnboardingStarted } from './wordpress-onboarding-started'
import { wordpressOnboardingSuccessded } from './wordpress-onboarding-successded'
import { ydocIndexedDBTimeout } from './ydoc-indexdb-timeout'

export const trackEventSchema = z.discriminatedUnion('event', [
  editorHeroPhotoAdded,
  editorFocalPointSet,
  editorFocalPointView,
  editorPhotoUpload,
  editorSessionStart,
  webflowOnboardingStepCompleted,
  wordpressOnboardingStarted,
  wordpressOnboardingFailed,
  wordpressOnboardingSuccessded,
  trialPaymentCardDeclined,
  trialPaymentFailed,
  userSkippedTrialPayment,
  customDomainUnknownFailed,
  apiErrorDisplayed,
  onboardingDemoClicked,
  ydocIndexedDBTimeout,
  aiLinterSettingUpdated,
  aiLinterSettingView,
  aiLinterDismissed,
  aiLinterApplied,
  aiSpellCheckDismissed,
  aiSpellCheckApplied,
  aiLinterShow,
  userMetaMergeFails,
  ctaDialogOpened,
  ctaDialogCanceled,
  ctaDialogCompleted,
  integrationDisabled,
  integrationEnabled,
  integrationView,
  userFilledSignupForm,
  userBookedOnboardingCall,
])

export type TrackEvent = z.infer<typeof trackEventSchema>
