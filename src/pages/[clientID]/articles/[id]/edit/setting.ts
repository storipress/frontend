export enum deviceType {
  desktop = 'desktop',
  tablet = 'tablet',
  mobile = 'mobile',
}

export enum transColumn {
  desk = 'desk',
  seo = 'seo',
  cover = 'cover',
  autoPosting = 'autoPosting',
}

export enum slugErrorCategory {
  unique = 'unique',
}
export const deviceWidth = {
  [deviceType.desktop]: 'w-full',
  [deviceType.tablet]: 'w-[48rem]',
  [deviceType.mobile]: 'w-[28rem]',
}

export enum errorModalType {
  bookmark = 'bookmark',
  imageLarge = 'imageLarge',
  imageUpload = 'imageUpload',
}

export const errorModalMapping = {
  bookmark: {
    title: 'Unsupported bookmark',
    description: 'Unsupported bookmark type. Try inserting as an HTML embed.',
  },
  imageLarge: {
    title: 'Image too large',
    description: (size: number) => `Your image is ${size}MB. Storipress supports images up to 50MB.`,
  },
  imageUpload: {
    title: 'Image upload error',
    description: 'Upload error. Try a smaller or different image format.',
  },
  imageUrlUpload: {
    title: 'Image upload error',
    description:
      'There was an error uploading the image. Please ensure that the URL you pasted is valid and the image exists.',
  },
}

export const codeNotifcationMapping = {
  9000070: 'Content too long, please shorten.',
  9000080: 'There is inappropriate content in what you entered. Please re-enter it.',
}

export const debounceLimit = 500
export const idleTime = 1 * 60 * 1000
export const imageSizeLimit = 1024 * 1024 * 50 // 50 MB
export const maxEnterTimes = 2
export const retryConnectTimesLimit = 3
