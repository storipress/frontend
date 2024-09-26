import { Option } from 'effect'
import * as DoubleLinkedList from '../DoubleLinkedList'

it('can insertBefore node multiple time', () => {
  const node = {
    _next: Option.none(),
    _previous: Option.none(),
    value: 3,
  }

  DoubleLinkedList.insertBefore(node, {
    _next: Option.none(),
    _previous: Option.none(),
    value: 1,
  })

  DoubleLinkedList.insertBefore(node, {
    _next: Option.none(),
    _previous: Option.none(),
    value: 2,
  })

  expect(DoubleLinkedList.toArray(node).map((node) => node.value)).toEqual([1, 2, 3])
})
