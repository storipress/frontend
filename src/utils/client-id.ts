const SPECIAL_CLIENT_ID = new Set(['_', 'redirect'])

export function isSpecialClientID(clientID: string) {
  return SPECIAL_CLIENT_ID.has(clientID)
}

export function checkClientIDFormat(clientID: unknown): clientID is string {
  if (typeof clientID !== 'string') return false
  if (clientID === 'undefined') return false
  if (isSpecialClientID(clientID)) return true
  return /^[DPS]\w{8}$/i.test(clientID ?? '')
}
