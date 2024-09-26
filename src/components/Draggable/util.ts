export function cloneNode(node: HTMLElement): HTMLElement {
  const fields: NodeListOf<HTMLInputElement> = node.querySelectorAll('input, textarea, select')
  const clonedNode = node.cloneNode(true) as HTMLElement
  const clonedFields = [...Array.from(clonedNode.querySelectorAll('input, textarea, select'))] as HTMLInputElement[] // Convert NodeList to Array

  clonedFields.forEach((field, index) => {
    if (field.type !== 'file' && fields[index]) {
      field.value = fields[index].value
    }
  })

  return clonedNode
}

export function closest(el: HTMLElement | null, fn: (el: HTMLElement) => boolean): HTMLElement | undefined {
  while (el) {
    if (fn(el)) return el
    el = el.parentElement
  }
}

export function include(el: HTMLElement, point: { x: number; y: number }) {
  const rect = el.getBoundingClientRect()
  return rect.left <= point.x && point.x <= rect.right && rect.top <= point.y && point.y <= rect.bottom
}

export function hierarchicalScroll(
  element: HTMLElement,
  point: { x: number; y: number },
): { element: HTMLElement; left: number; top: number } | undefined {
  const isDragCol = element.getAttribute('data-name') === 'dragCol'
  const containerRect = element.getBoundingClientRect()
  const scrollSpacing = {
    vertical: containerRect.height * 0.05,
    horizontal: containerRect.width * 0.05,
  }
  const scrollBorder = {
    top: containerRect.top + scrollSpacing.vertical,
    right: containerRect.right - scrollSpacing.horizontal,
    left: containerRect.left + scrollSpacing.horizontal,
    bottom: containerRect.bottom - scrollSpacing.vertical,
  }

  const speed = [0, 0]
  if (point.x < scrollBorder.left) {
    if (element.scrollLeft > 0) {
      speed[0] = (point.x - scrollBorder.left) / scrollSpacing.horizontal
    }
  } else if (point.x > scrollBorder.right) {
    if (element.scrollLeft + element.clientWidth < element.scrollWidth) {
      speed[0] = (point.x - scrollBorder.right) / scrollSpacing.horizontal
    }
  }

  if (point.y < scrollBorder.top) {
    if (element.scrollTop > 0) {
      speed[1] = (point.y - scrollBorder.top) / scrollSpacing.vertical
    }
  } else if (point.y > scrollBorder.bottom) {
    if (element.scrollTop + element.clientHeight < element.scrollHeight) {
      speed[1] = (point.y - scrollBorder.bottom) / scrollSpacing.vertical
    }
  }

  if (speed.some((axis) => axis !== 0)) {
    const base = 150
    const xScroll = isDragCol ? 0 : base * speed[0]

    element.scrollBy(xScroll, base * speed[1])
    return { element, left: xScroll, top: base * speed[1] }
  } else if (element.parentElement) {
    return hierarchicalScroll(element.parentElement, point)
  }
}

export function getElementCenter(el: HTMLElement): { x: number; y: number } {
  const { x, y } = el.getBoundingClientRect()
  return {
    x: x + el.clientWidth / 2,
    y: y + el.clientHeight / 2,
  }
}
