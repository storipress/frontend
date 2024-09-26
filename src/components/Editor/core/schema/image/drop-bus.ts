interface FileUpload {
  kind: 'file'
  file: File
}

interface UrlUpload {
  kind: 'url'
  url: string
}

export type Upload = FileUpload | UrlUpload

export const droppedItems = new Map<string, Upload>()
