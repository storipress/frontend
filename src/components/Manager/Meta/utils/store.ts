import { defineStore } from 'pinia'

export interface TMetaStore {
  searchTitle: string
  searchDescription: string
  socialTitle: string
  socialDescription: string
  FBText: string
  TWText: string
  LNText: string
  slug: string
  generatingAI: TGenerating
  generatingController: TGeneratingController
}

export interface TGenerating {
  searchTitle: boolean
  searchDescription: boolean
  FBText: boolean
  TWText: boolean
  LNText: boolean
}

export interface TGeneratingController {
  facebook: AbortController
  twitter: AbortController
  linkedin: AbortController
}

export type GeneratingKey = keyof TGenerating
export type GeneratingControllerKey = keyof TGeneratingController

export const useMetaStore = defineStore({
  id: 'meta',
  state: () =>
    ({
      searchTitle: '',
      searchDescription: '',
      socialTitle: '',
      socialDescription: '',
      FBText: '',
      TWText: '',
      LNText: '',
      slug: '',

      generatingAI: {
        searchTitle: false,
        searchDescription: false,
        FBText: false,
        TWText: false,
        LNText: false,
      },

      generatingController: {
        facebook: new AbortController(),
        twitter: new AbortController(),
        linkedin: new AbortController(),
      },
    }) as TMetaStore,
  actions: {
    SET_SEARCH_TITLE(text: string) {
      this.searchTitle = text
    },
    SET_SEARCH_DESCRIPTION(text: string) {
      this.searchDescription = text
    },
    SET_SOCIAL_TITLE(text: string) {
      this.socialTitle = text
    },
    SET_SOCIAL_DESCRIPTION(text: string) {
      this.socialDescription = text
    },
    SET_FB_TEXT(text: string) {
      this.FBText = text
    },
    SET_TW_TEXT(text: string) {
      this.TWText = text
    },
    SET_LN_TEXT(text: string) {
      this.LNText = text
    },

    SET_SLUG(text: string) {
      this.slug = text
    },
    SET_GENERATING_AI(colName: GeneratingKey, generating: boolean) {
      this.generatingAI[colName] = generating
    },
    SET_GENERATING_ABORT(promptType: GeneratingControllerKey) {
      this.generatingController[promptType].abort()
      this.generatingController[promptType] = new AbortController()
    },
    RESET_ALL() {
      this.searchTitle = ''
      this.searchDescription = ''
      this.socialTitle = ''
      this.socialDescription = ''
      this.FBText = ''
      this.TWText = ''
      this.LNText = ''
      this.slug = ''
    },
  },
})
