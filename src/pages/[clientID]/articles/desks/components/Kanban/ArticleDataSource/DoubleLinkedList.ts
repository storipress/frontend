import type { Predicate } from 'effect'
import { Option } from 'effect'

export interface DoubleLinkedList {
  _previous: Option.Option<DoubleLinkedList>
  _next: Option.Option<DoubleLinkedList>
}

export interface Sibling {
  previous: Option.Option<DoubleLinkedList>
  next: Option.Option<DoubleLinkedList>
}

export function empty(): DoubleLinkedList {
  return { _previous: Option.none(), _next: Option.none() } as DoubleLinkedList
}

export function remove<Node extends DoubleLinkedList>(self: Node): Sibling {
  const previous = self._previous
  const next = self._next

  self._previous = Option.none()
  self._next = Option.none()

  if (Option.isSome(previous)) {
    previous.value._next = next
  }

  if (Option.isSome(next)) {
    next.value._previous = previous
  }

  return { previous, next }
}

export function insertBefore<Node extends DoubleLinkedList>(self: Node, other: Node): void {
  const previous = self._previous
  insertAfter(other, self)
  if (Option.isSome(previous)) {
    insertAfter(previous.value, other)
  }
}

export function insertAfter<Node extends DoubleLinkedList>(self: Node, other: Node): void {
  ensureLink(self, other)
}

export function replaceNode<Node extends DoubleLinkedList>(self: Node, other: Node): void {
  const { previous, next } = remove(self)
  if (Option.isSome(previous)) {
    ensureLink(previous.value, other)
  }
  if (Option.isSome(next)) {
    ensureLink(other, next.value)
  }
}

export function find<Node extends DoubleLinkedList, Out extends Node>(
  self: Node,
  predicate: Predicate.Refinement<Node, Out>,
): Option.Option<Out> {
  if (predicate(self)) {
    return Option.some(self)
  }

  let current = self
  while (Option.isSome(current._next)) {
    current = current._next.value as Node
    if (predicate(current)) {
      return Option.some(current)
    }
  }
  return Option.none()
}

function ensureLink<Node extends DoubleLinkedList>(self: Node, other: Node): void {
  self._next = Option.some(other)
  other._previous = Option.some(self)
}

export function head<Node extends DoubleLinkedList>(self: Node): Node {
  return Option.match(self._previous, {
    onSome: (previous) => head(previous as Node),
    onNone: () => self,
  })
}

export function toArray<Node extends DoubleLinkedList>(self: Node): ReadonlyArray<Node> {
  const first = head(self)
  return toArrayImpl(first) as ReadonlyArray<Node>
}

function toArrayImpl<Node extends DoubleLinkedList>(first: Node): ReadonlyArray<Node> {
  return Option.match(first._next, {
    onSome: (next) => [first, ...toArrayImpl(next as Node)],
    onNone: () => [first],
  })
}
