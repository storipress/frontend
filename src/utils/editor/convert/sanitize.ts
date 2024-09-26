import createDOMPurify from 'dompurify'

import { window } from '../environment'

export const { sanitize } = createDOMPurify(window)
