export const isIframe = window.top !== window

export const isSafari =
  navigator.vendor.match(/apple/i) && !/crios/i.test(navigator.userAgent) && !/fxios/i.test(navigator.userAgent)

export const isFirefox = navigator.userAgent.includes('Firefox')
