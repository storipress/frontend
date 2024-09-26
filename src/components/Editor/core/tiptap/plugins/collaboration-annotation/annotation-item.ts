import type { Decoration } from 'prosemirror-view'

export class AnnotationItem {
  private decoration!: any

  constructor(decoration: Decoration) {
    this.decoration = decoration
  }

  get id() {
    return this.decoration.type.spec.id
  }

  get from() {
    return this.decoration.from
  }

  get to() {
    return this.decoration.to
  }

  get data() {
    return this.decoration.type.spec.data
  }

  get HTMLAttributes() {
    return this.decoration.type.attrs
  }

  toString() {
    return JSON.stringify({
      id: this.id,
      data: this.data,
      from: this.from,
      to: this.to,
      HTMLAttributes: this.HTMLAttributes,
    })
  }
}
