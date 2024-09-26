import { h } from 'vue'
import { createStoryComponent } from '../story-helper'
import { Gallery } from './index'

const GalleryView = createStoryComponent(Gallery)

export default {
  title: 'EditorCore/Schema/Gallery',
  component: GalleryView,
}

export function Default() {
  return {
    setup: () => () =>
      h(GalleryView, {
        attrs: {},
        class: 'w-80 ml-10',
      }),
  }
}

export function Uploaded() {
  return {
    setup: () => () =>
      h(GalleryView, {
        attrs: {
          images: [
            'https://i.picsum.photos/id/266/300/500.jpg?hmac=rzjEbqizexKWUbFnAfG5ZoHLSqK5CNFCAS3aM-a2QeU',
            'https://i.picsum.photos/id/79/400/500.jpg?hmac=JxduIk3sye0LdVwLUjmq1-cfIBBH69wtLuoGSOXRaTQ',
            'https://i.picsum.photos/id/178/500/500.jpg?hmac=NNYZauYyeTte-EZcLXR8Sp1ZwG-kJXpKRFruqEsb86I',
            'https://i.picsum.photos/id/793/600/500.jpg?hmac=4deLuWHRkTHwoi0cbLUhVRegFseuyhoScsuxc2DuNh4',
            'https://i.picsum.photos/id/30/700/500.jpg?hmac=AQ6AwK7MCUHkIhKf79hDudiq5uAG1RPM9tILamHi5Ew',
            'https://i.picsum.photos/id/398/300/500.jpg?hmac=jv_OK1N1Vae0lFCtH04ip3uX5FuoK5enmHoGO46rixg',
            'https://i.picsum.photos/id/202/300/600.jpg?hmac=SXq9rc-MPdWaaazVuXfkIJUT_P-blt_DOgNnReq7VRI',
            'https://i.picsum.photos/id/977/300/700.jpg?hmac=Sj2Hs11liWWykHZ_IpFJdQauWjBaRgjc_mNYFsPL974',
            'https://i.picsum.photos/id/461/300/800.jpg?hmac=PP2_49dbjwMoMgGUqoq_G4lrN-frOuFMW6ifEiwFv4Q',
          ],
        },
        class: 'w-80 ml-10',
      }),
  }
}
