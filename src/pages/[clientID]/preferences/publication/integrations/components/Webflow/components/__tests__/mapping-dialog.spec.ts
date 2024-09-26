import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia } from 'pinia'
import type { UseMappingDialogInput } from '../mapping-dialog'
import { useMappingDialog } from '../mapping-dialog'
import { WebflowCollectionType, WebflowFieldType } from '~/graphql-operations'
import { setupApolloClient, setupTestPinia } from '~/test-helpers'

beforeEach(() => {
  setActivePinia(setupTestPinia())
  setupApolloClient()
})

describe('useMappingDialog', () => {
  it('will return form submit handler', () => {
    const input: UseMappingDialogInput = {
      collection: {
        id: '1',
        displayName: 'Blog',
        fields: [
          {
            id: '1',
            type: WebflowFieldType.PlainText,
            displayName: 'field1',
            isRequired: true,
            candidates: [
              {
                name: 'candidate1',
                value: 'value1',
              },
              {
                name: 'candidate2',
                value: 'value2',
              },
            ],
          },
          {
            id: '2',
            displayName: 'field2',
            type: WebflowFieldType.PlainText,
            isRequired: false,
            candidates: [
              {
                name: 'candidate3',
                value: 'value3',
              },
              {
                name: 'candidate4',
                value: 'value4',
              },
            ],
          },
        ],
        mappings: null,
      },
      isActivated: true,
      collectionType: WebflowCollectionType.Blog,
    }

    // `useMappingDialog` is depended on UI, we can't test validation here
    const res = useMappingDialog(input)

    expect(res.onSubmit).toBeInstanceOf(Function)
  })
})
