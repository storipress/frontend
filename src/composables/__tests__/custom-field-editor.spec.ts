import { describe } from 'vitest'
import type { CustomFields, MetaMap } from '../custom-field-editor'
import { fieldsToFormValues, inputIsEmpty, isUnsupportedReferenceField } from '../custom-field-editor'
import CUSTOM_FIELDS_FIXTURE from './__fixtures__/custom-fields.json'
import META_MAP_FIXTURE from './__fixtures__/meta-map.json'
import { CustomFieldType } from '~/graphql-operations'

describe('inputIsEmpty', () => {
  it.each([
    // empty values
    ['', true],
    [{}, true],
    [[], true],
    [undefined, true],
    [null, true],

    // non-empty values,
    ['0', false],
    [false, false],
    [true, false],
    ['foo', false],
    [{ id: '1' }, false],
    [['1'], false],
  ])('inputIsEmpty should check value `%s`  is empty or not', (value, expected) => {
    expect(inputIsEmpty(value)).toBe(expected)
  })
})

describe('fieldsToFormValues', () => {
  it('can covert fields to form value', () => {
    // these fixtures is extract from client `DODWKHI4L`
    expect(
      fieldsToFormValues(CUSTOM_FIELDS_FIXTURE as CustomFields[], META_MAP_FIXTURE as unknown as MetaMap),
    ).toMatchSnapshot()
  })
})

describe('isUnsupportedReferenceField', () => {
  it('can detect unsupported reference type', () => {
    expect(
      isUnsupportedReferenceField({
        __typename: 'CustomField',
        id: '32',
        key: 'tags',
        type: CustomFieldType.Reference,
        name: 'Tags',
        description: null,
        options: {
          __typename: 'CustomFieldReferenceOptions',
          type: CustomFieldType.Reference,
          target: null,
          multiple: true,
          collection_id: null,
        },
        group: {
          key: 'sponsor',
        },
      }),
    ).toBe(true)
  })
})
