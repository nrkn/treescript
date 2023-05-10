import { _Node } from '../types'

export const squery = <T extends {}>(
  _node: _Node<T>
) => {
  const hasChildren = (value: T) =>
    !!_node(value)?.hasChildren

  const firstChild = (value: T) =>
    _node(value)?.firstChild as T | null

  const lastChild = (value: T) =>
    _node(value)?.lastChild as T | null

  const previousSibling = (value: T) =>
    _node(value)?.previousSibling as T | null

  const nextSibling = (value: T) =>
    _node(value)?.nextSibling as T | null

  const parent = (value: T) =>
    _node(value)?.parent as T | null

  return {
    hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent
  }
}
