import type { DraggableComponentInfo } from './definition'

export default class DraggableEntity {
  group = new Map<string, DraggableComponentInfo>()
  srcGroup?: DraggableComponentInfo
  destGroup?: DraggableComponentInfo
  preGroup?: DraggableComponentInfo
  isDragging?: boolean
  addGroup(key: string, component: DraggableComponentInfo) {
    this.group.set(key, component)
  }

  removeGroup(key: string) {
    this.group.delete(key)
  }

  startDragging(key: string) {
    this.srcGroup = this.group.get(key) as DraggableComponentInfo
    this.hoverIn(key)
    this.isDragging = true
  }

  hoverOut() {
    this.destGroup?.dragOut()
    this.destGroup?.clearHoverIndex()
    this.destGroup = undefined
  }

  hoverIn(key: string) {
    if (this.preGroup !== (this.group.get(key) as DraggableComponentInfo)) {
      this.preGroup?.dragOut()
      this.preGroup?.clearHoverIndex()
      this.preGroup = undefined
    }
    this.destGroup = this.group.get(key) as DraggableComponentInfo
    this.destGroup?.dragIn()
    this.destGroup?.clearHoverIndex()
    this.preGroup = this.destGroup
  }

  endDropped() {
    this.srcGroup = undefined
    this.destGroup?.dropped?.()
    this.destGroup = undefined
    this.isDragging = false
  }

  getAllListRootElement(): HTMLElement[] {
    return Array.from(this.group.values()).map((list) => list.$el as HTMLElement)
  }

  findGroupByContainerEl(el: HTMLElement): DraggableComponentInfo | undefined {
    return Array.from(this.group.values()).find((list) => list.$el === el)
  }
}
