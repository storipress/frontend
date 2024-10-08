import { defineGraphQLMock } from '../define-graphql-mock'
import { ListDesksDocument } from '~/graphql-operations'

export default defineGraphQLMock(ListDesksDocument, {
  desks: [
    {
      __typename: 'Desk',
      id: '135',
      name: 'Alphabet',
      slug: 'alphabet',
      description: '',
      order: 0,
      desk: null,
      open_access: false,
      desks: [
        {
          __typename: 'Desk',
          id: '136',
          name: 'A',
          description: '',
          slug: 'a',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '137',
          name: 'B',
          description: '',
          slug: 'b',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '138',
          name: 'C',
          slug: 'c',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '139',
          name: 'D',
          slug: 'd',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '140',
          name: 'E',
          slug: 'e',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '141',
          name: 'F',
          slug: 'f',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '142',
          name: 'G',
          slug: 'g',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '143',
          name: 'H',
          slug: 'h',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '144',
          name: 'I',
          slug: 'i',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '145',
          name: 'J',
          slug: 'j',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '146',
          name: 'K',
          slug: 'k',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '148',
          name: 'L',
          slug: 'l-2',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '149',
          name: 'M',
          slug: 'm',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '150',
          name: 'N',
          slug: 'n',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '151',
          name: 'O',
          slug: 'o',
          description: '',
          desk: null,
          order: 0,
        },
        {
          __typename: 'Desk',
          id: '152',
          name: 'P',
          slug: 'p',
          description: '',
          desk: null,
          order: 0,
        },
      ],
    },
    {
      id: '1',
      name: 'Test 2',
      slug: 'tutorial',
      open_access: false,
      desk: null,
      description: '',
      order: 0,
      desks: [
        {
          id: '47',
          name: 'adsadasd',
          slug: 'adsadasd',
          description: '',
          order: 0,
          desk: null,
          __typename: 'Desk',
        },
        {
          id: '54',
          name: 'ddddd',
          slug: 'ddddd-2',
          description: '',
          order: 0,
          desk: null,
          __typename: 'Desk',
        },
      ],
      __typename: 'Desk',
    },
    {
      id: '2',
      name: 'Tester',
      slug: 'test',
      description: '',
      desks: [],
      desk: null,
      __typename: 'Desk',
      open_access: false,
      order: 0,
    },
    {
      id: '3',
      name: 'TEST: One Article',
      slug: 'empty',
      description: '',
      desks: [],
      desk: null,

      open_access: false,
      order: 0,
      __typename: 'Desk',
    },
    {
      id: '56',
      name: 'TEST: ALL 10 ARTICLE',
      slug: 'test-all-10-article',
      desks: [],
      desk: null,
      description: '',

      open_access: false,
      order: 0,
      __typename: 'Desk',
    },
    {
      id: '57',
      name: 'TEST: ALL 15 ARTICLE',
      slug: 'test-all-15-article',
      desks: [],
      desk: null,
      description: '',

      open_access: false,
      order: 0,
      __typename: 'Desk',
    },
    {
      id: '58',
      name: 'TEST: Infinite Scroll',
      slug: 'test-infinite-scroll',
      desks: [],
      description: '',
      desk: null,

      open_access: false,
      order: 0,
      __typename: 'Desk',
    },
    {
      id: '59',
      name: 'TEST: SAME ORDER',
      slug: 'test-same-order',
      desks: [],
      description: '',
      desk: null,
      order: 0,

      open_access: false,
      __typename: 'Desk',
    },
  ],
})
