import { _Node } from '../types'

export const squery = <T extends {}>(
  _node: _Node<T>
) => {
  const hasChildren = (value: T) =>
    !!_node(value)!.hasChildren

  const firstChild = (value: T) =>
    _node(value)!.firstChild

  const lastChild = (value: T) =>
    _node(value)!.lastChild

  const previousSibling = (value: T) =>
    _node(value)!.previousSibling

  const nextSibling = (value: T) =>
    _node(value)!.nextSibling

  const parent = (value: T) =>
    _node(value)!.parent

  return {
    hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent
  }
}
