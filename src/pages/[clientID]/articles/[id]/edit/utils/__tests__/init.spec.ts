import { facebookSocialDataSchema, socialDataSchema, twitterSocialDataSchema } from '../init'

it('can parse empty social data', () => {
  expect(
    socialDataSchema.parse({
      id: 'test_id',
      name: 'test_name',
      thumbnail: 'test_thumbnail',
    }),
  ).toEqual({
    id: 'test_id',
    name: 'test_name',
    thumbnail: 'test_thumbnail',
  })
})

it.each([undefined, null, { id: '' }, { id: undefined, name: null }])('can parse empty social data %o', (input) => {
  expect(socialDataSchema.parse(input)).toEqual({
    id: '',
    name: '',
    thumbnail: '',
  })
})

it.each([undefined, null, { page_id: '' }, { page_id: undefined, name: null }])(
  'can parse empty facebook social data %o',
  (input) => {
    expect(socialDataSchema.parse(input)).toEqual({
      id: '',
      name: '',
      thumbnail: '',
    })
  },
)

it('can parse facebook social data', () => {
  expect(
    facebookSocialDataSchema.parse({ page_id: 'test_page_id', name: 'test_name', thumbnail: 'test_thumbnail' }),
  ).toEqual({
    id: 'test_page_id',
    name: 'test_name',
    thumbnail: 'test_thumbnail',
  })
})

it.each([undefined, null, { page_id: '' }, { page_id: undefined, name: null }])(
  'can parse empty facebook social data %o',
  (input) => {
    expect(facebookSocialDataSchema.parse(input)).toEqual({
      id: '',
      name: '',
      thumbnail: '',
    })
  },
)

it('can parse twitter social data', () => {
  expect(
    twitterSocialDataSchema.parse({
      user_id: 'test_user_id',
      name: 'test_name',
      thumbnail: 'test_thumbnail',
    }),
  ).toEqual({
    id: 'test_user_id',
    name: 'test_name',
    thumbnail: 'test_thumbnail',
  })
})

it.each([undefined, null, { user_id: '' }, { user_id: undefined, name: null }])(
  'can parse empty twitter social data %o',
  (input) => {
    expect(twitterSocialDataSchema.parse(input)).toEqual({
      id: '',
      name: '',
      thumbnail: '',
    })
  },
)
