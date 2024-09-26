import type { Component } from 'vue'

// import Item0 from './code/code-block/block/index.js'
// import preview0 from './code/code-block/preview.webp'
// import Item1 from './footer/footer-crikey/block/index.js'
// import preview1 from './footer/footer-crikey/preview.webp'
// import Item2 from './footer/footer-default/block/index.js'
// import preview2 from './footer/footer-default/preview.webp'
// import Item4 from './hero/aeon-1/block/index.js'
// import preview4 from './hero/aeon-1/preview.webp'
// import Item5 from './hero/crikey-1/block/index.js'
// import preview5 from './hero/crikey-1/preview.webp'
// import Item3 from './hero/Gen-Zine-1/block/index.js'
// import preview3 from './hero/Gen-Zine-1/preview.webp'
// import Item6 from './hero/hbr-1/block/index.js'
// import preview6 from './hero/hbr-1/preview.webp'
// import Item7 from './hero/hero-undark-1/block/index.js'
// import preview7 from './hero/hero-undark-1/preview.webp'
// import Item8 from './hero/kinfolk-1/block/index.js'
// import preview8 from './hero/kinfolk-1/preview.webp'
import Item9 from './hero/psyche-1/block/index.js'
// import preview9 from './hero/psyche-1/preview.webp'
// import Item10 from './hero/vice-1/block/index.js'
// import preview10 from './hero/vice-1/preview.webp'
// import Item14 from './mixed/crikey-2/block/index.js'
// import preview14 from './mixed/crikey-2/preview.webp'
// import Item11 from './mixed/Gen-Zine-landing-2/block/index.js'
// import preview11 from './mixed/Gen-Zine-landing-2/preview.webp'
// import Item12 from './mixed/Gen-Zine-landing-3/block/index.js'
// import preview12 from './mixed/Gen-Zine-landing-3/preview.webp'
// import Item13 from './mixed/Gen-Zine-landing-4/block/index.js'
// import preview13 from './mixed/Gen-Zine-landing-4/preview.webp'
// import Item15 from './mixed/gq-1/block/index.js'
// import preview15 from './mixed/gq-1/preview.webp'
// import Item16 from './mixed/jacobin-1/block/index.js'
// import preview16 from './mixed/jacobin-1/preview.webp'
// import Item17 from './mixed/jacobin-3/block/index.js'
// import preview17 from './mixed/jacobin-3/preview.webp'
// import Item18 from './mixed/kinfolk/block/index.js'
// import preview18 from './mixed/kinfolk/preview.webp'
// import Item19 from './mixed/mixed-nymag-1/block/index.js'
// import preview19 from './mixed/mixed-nymag-1/preview.webp'
// import Item20 from './mixed/new-republic-three/block/index.js'
// import preview20 from './mixed/new-republic-three/preview.webp'
// import Item21 from './mixed/new-republic-two/block/index.js'
// import preview21 from './mixed/new-republic-two/preview.webp'
// import Item22 from './mixed/nylon-1/block/index.js'
// import preview22 from './mixed/nylon-1/preview.webp'
// import Item23 from './mixed/nylon-2/block/index.js'
// import preview23 from './mixed/nylon-2/preview.webp'
// import Item24 from './mixed/nymag-one/block/index.js'
// import preview24 from './mixed/nymag-one/preview.webp'
// import Item25 from './mixed/the-cut-1/block/index.js'
// import preview25 from './mixed/the-cut-1/preview.webp'
// import Item26 from './mixed/undark-2/block/index.js'
// import preview26 from './mixed/undark-2/preview.webp'
import Item27 from './one-row/aeon-one/block/index.js'
// import preview27 from './one-row/aeon-one/preview.webp'
// import Item28 from './one-row/bloomberg-1/block/index.js'
// import preview28 from './one-row/bloomberg-1/preview.webp'
// import Item29 from './one-row/bloomberg-one/block/index.js'
// import preview29 from './one-row/bloomberg-one/preview.webp'
// import Item30 from './one-row/crikey-3/block/index.js'
// import preview30 from './one-row/crikey-3/preview.webp'
// import Item31 from './one-row/dazed-digital-one/block/index.js'
// import preview31 from './one-row/dazed-digital-one/preview.webp'
// import Item32 from './one-row/jacobin-2/block/index.js'
// import preview32 from './one-row/jacobin-2/preview.webp'
// import Item33 from './one-row/new-republic-four/block/index.js'
// import preview33 from './one-row/new-republic-four/preview.webp'
// import Item34 from './one-row/nylon-3/block/index.js'
// import preview34 from './one-row/nylon-3/preview.webp'
// import Item35 from './one-row/the-cut-two/block/index.js'
// import preview35 from './one-row/the-cut-two/preview.webp'
// import Item36 from './one-row/undark-one/block/index.js'
// import preview36 from './one-row/undark-one/preview.webp'
// import Item37 from './one-row/vanity-fair-one/block/index.js'
// import preview37 from './one-row/vanity-fair-one/preview.webp'
// import Item38 from './one-row/vanity-fair-two/block/index.js'
// import preview38 from './one-row/vanity-fair-two/preview.webp'
// import Item39 from './single/dazed-digital-two/block/index.js'
// import preview39 from './single/dazed-digital-two/preview.webp'
// import Item40 from './single/kinfolk-2/block/index.js'
// import preview40 from './single/kinfolk-2/preview.webp'
// import Item41 from './single/new-republic-one/block/index.js'
// import preview41 from './single/new-republic-one/preview.webp'
// import Item42 from './single/single-vanity-fair/block/index.js'
// import preview42 from './single/single-vanity-fair/preview.webp'
// import Item43 from './subscription-box/tailwind-1/block/index.js'
// import preview43 from './subscription-box/tailwind-1/preview.webp'
// import Item44 from './subscription-box/tailwind-2/block/index.js'
// import preview44 from './subscription-box/tailwind-2/preview.webp'
// import Item45 from './subscription-box/tailwind-3/block/index.js'
// import preview45 from './subscription-box/tailwind-3/preview.webp'
// import Item46 from './text/jacobin-4/block/index.js'
// import preview46 from './text/jacobin-4/preview.webp'
// import Item47 from './text/text-the-atlantic/block/index.js'
// import preview47 from './text/text-the-atlantic/preview.webp'
// import Item48 from './text/thecut-2/block/index.js'
// import preview48 from './text/thecut-2/preview.webp'
// import Item49 from './two-row/2r-kinfolk/block/index.js'
// import preview49 from './two-row/2r-kinfolk/preview.webp'
// import Item50 from './two-row/2r-nyt-mag/block/index.js'
// import preview50 from './two-row/2r-nyt-mag/preview.webp'
// import Item51 from './two-row/crikey-4/block/index.js'
// import preview51 from './two-row/crikey-4/preview.webp'
// import Item52 from './two-row/fast-company-1/block/index.js'
// import preview52 from './two-row/fast-company-1/preview.webp'
// import Item53 from './two-row/the-financial-times-1/block/index.js'
// import preview53 from './two-row/the-financial-times-1/preview.webp'
// import Item54 from './two-row/undark-1/block/index.js'
// import preview54 from './two-row/undark-1/preview.webp'

export * from './fallback'

export interface ItemDescriptor {
  name: string
  component: Component
  preview: string | null
}

export const maps: Record<string, Component> = {
  // 'code-block': Item0,
  // 'footer-crikey': Item1,
  // 'footer-default': Item2,
  // 'Gen-Zine-1': Item3,
  // 'aeon-1': Item4,
  // 'crikey-1': Item5,
  // 'hbr-1': Item6,
  // 'hero-undark-1': Item7,
  // 'kinfolk-1': Item8,
  'psyche-1': Item9,
  // 'vice-1': Item10,
  // 'Gen-Zine-landing-2': Item11,
  // 'Gen-Zine-landing-3': Item12,
  // 'Gen-Zine-landing-4': Item13,
  // 'crikey-2': Item14,
  // 'gq-1': Item15,
  // 'jacobin-1': Item16,
  // 'jacobin-3': Item17,
  // kinfolk: Item18,
  // 'mixed-nymag-1': Item19,
  // 'new-republic-three': Item20,
  // 'new-republic-two': Item21,
  // 'nylon-1': Item22,
  // 'nylon-2': Item23,
  // 'nymag-one': Item24,
  // 'the-cut-1': Item25,
  // 'undark-2': Item26,
  'aeon-one': Item27,
  // 'bloomberg-1': Item28,
  // 'bloomberg-one': Item29,
  // 'crikey-3': Item30,
  // 'dazed-digital-one': Item31,
  // 'jacobin-2': Item32,
  // 'new-republic-four': Item33,
  // 'nylon-3': Item34,
  // 'the-cut-two': Item35,
  // 'undark-one': Item36,
  // 'vanity-fair-one': Item37,
  // 'vanity-fair-two': Item38,
  // 'dazed-digital-two': Item39,
  // 'kinfolk-2': Item40,
  // 'new-republic-one': Item41,
  // 'single-vanity-fair': Item42,
  // 'tailwind-1': Item43,
  // 'tailwind-2': Item44,
  // 'tailwind-3': Item45,
  // 'jacobin-4': Item46,
  // 'text-the-atlantic': Item47,
  // 'thecut-2': Item48,
  // '2r-kinfolk': Item49,
  // '2r-nyt-mag': Item50,
  // 'crikey-4': Item51,
  // 'fast-company-1': Item52,
  // 'the-financial-times-1': Item53,
  // 'undark-1': Item54,
}
// export const category: Record<string, ItemDescriptor[]> = {
//   code: [{ name: 'code-block', component: Item0, preview: preview0 }],
//   footer: [
//     { name: 'footer-crikey', component: Item1, preview: preview1 },
//     { name: 'footer-default', component: Item2, preview: preview2 },
//   ],
//   hero: [
//     { name: 'Gen-Zine-1', component: Item3, preview: preview3 },
//     { name: 'aeon-1', component: Item4, preview: preview4 },
//     { name: 'crikey-1', component: Item5, preview: preview5 },
//     { name: 'hbr-1', component: Item6, preview: preview6 },
//     { name: 'hero-undark-1', component: Item7, preview: preview7 },
//     { name: 'kinfolk-1', component: Item8, preview: preview8 },
//     { name: 'psyche-1', component: Item9, preview: preview9 },
//     { name: 'vice-1', component: Item10, preview: preview10 },
//   ],
//   mixed: [
//     { name: 'Gen-Zine-landing-2', component: Item11, preview: preview11 },
//     { name: 'Gen-Zine-landing-3', component: Item12, preview: preview12 },
//     { name: 'Gen-Zine-landing-4', component: Item13, preview: preview13 },
//     { name: 'crikey-2', component: Item14, preview: preview14 },
//     { name: 'gq-1', component: Item15, preview: preview15 },
//     { name: 'jacobin-1', component: Item16, preview: preview16 },
//     { name: 'jacobin-3', component: Item17, preview: preview17 },
//     { name: 'kinfolk', component: Item18, preview: preview18 },
//     { name: 'mixed-nymag-1', component: Item19, preview: preview19 },
//     { name: 'new-republic-three', component: Item20, preview: preview20 },
//     { name: 'new-republic-two', component: Item21, preview: preview21 },
//     { name: 'nylon-1', component: Item22, preview: preview22 },
//     { name: 'nylon-2', component: Item23, preview: preview23 },
//     { name: 'nymag-one', component: Item24, preview: preview24 },
//     { name: 'the-cut-1', component: Item25, preview: preview25 },
//     { name: 'undark-2', component: Item26, preview: preview26 },
//   ],
//   'one-row': [
//     { name: 'aeon-one', component: Item27, preview: preview27 },
//     { name: 'bloomberg-1', component: Item28, preview: preview28 },
//     { name: 'bloomberg-one', component: Item29, preview: preview29 },
//     { name: 'crikey-3', component: Item30, preview: preview30 },
//     { name: 'dazed-digital-one', component: Item31, preview: preview31 },
//     { name: 'jacobin-2', component: Item32, preview: preview32 },
//     { name: 'new-republic-four', component: Item33, preview: preview33 },
//     { name: 'nylon-3', component: Item34, preview: preview34 },
//     { name: 'the-cut-two', component: Item35, preview: preview35 },
//     { name: 'undark-one', component: Item36, preview: preview36 },
//     { name: 'vanity-fair-one', component: Item37, preview: preview37 },
//     { name: 'vanity-fair-two', component: Item38, preview: preview38 },
//   ],
//   single: [
//     { name: 'dazed-digital-two', component: Item39, preview: preview39 },
//     { name: 'kinfolk-2', component: Item40, preview: preview40 },
//     { name: 'new-republic-one', component: Item41, preview: preview41 },
//     { name: 'single-vanity-fair', component: Item42, preview: preview42 },
//   ],
//   'subscription-box': [
//     { name: 'tailwind-1', component: Item43, preview: preview43 },
//     { name: 'tailwind-2', component: Item44, preview: preview44 },
//     { name: 'tailwind-3', component: Item45, preview: preview45 },
//   ],
//   text: [
//     { name: 'jacobin-4', component: Item46, preview: preview46 },
//     { name: 'text-the-atlantic', component: Item47, preview: preview47 },
//     { name: 'thecut-2', component: Item48, preview: preview48 },
//   ],
//   'two-row': [
//     { name: '2r-kinfolk', component: Item49, preview: preview49 },
//     { name: '2r-nyt-mag', component: Item50, preview: preview50 },
//     { name: 'crikey-4', component: Item51, preview: preview51 },
//     { name: 'fast-company-1', component: Item52, preview: preview52 },
//     { name: 'the-financial-times-1', component: Item53, preview: preview53 },
//     { name: 'undark-1', component: Item54, preview: preview54 },
//   ],
// }
