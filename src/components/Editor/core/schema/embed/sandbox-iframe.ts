const SANDBOX = [
  'allow-forms',
  'allow-popups',
  'allow-popups-to-escape-sandbox',
  'allow-same-origin',
  'allow-scripts',
  'allow-storage-access-by-user-activation',
]

const FORBIDDEN_FEATURE = ['allow-top-navigation', 'allow-top-navigation-by-user-activation', 'allow-pointer-lock']

export function sandboxIFrame(node: Element) {
  for (const $iframe of node.querySelectorAll('iframe')) {
    if ($iframe.sandbox.length > 0) {
      for (const feature of FORBIDDEN_FEATURE) {
        $iframe.sandbox.remove(feature)
      }
    } else {
      $iframe.sandbox.add(...SANDBOX)
    }
  }
}
