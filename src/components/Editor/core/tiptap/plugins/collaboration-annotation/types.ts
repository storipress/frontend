export interface AddAnnotationAction {
  type: 'addAnnotation'
  id: string
  data: any
  from: number
  to: number
}

export interface UpdateAnnotationAction {
  type: 'updateAnnotation'
  id: string
  data: any
}

export interface DeleteAnnotationAction {
  type: 'deleteAnnotation'
  id: string
}

export interface CreateAnnotationAction {
  type: 'createDecorations'
}
