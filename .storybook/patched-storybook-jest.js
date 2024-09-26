import { default as expectPatched } from '@storybook/expect'
import { instrument } from '@storybook/instrumenter'

import * as matchers from '@testing-library/jest-dom/matchers'
import * as mock from 'jest-mock'

const jest = instrument({ jest: mock }).jest
const expect = instrument(
  { expect: expectPatched },
  {
    intercept(_method, path) {
      return path[0] !== 'expect'
    },
  },
).expect

const fixedMatchers = Object.fromEntries(
  Object.keys(matchers)
    .map((key) => [key, matchers[key]])
    .filter(([key, value]) => !key.startsWith('_') && value),
)

expect.extend(fixedMatchers)
export { expect, jest }
