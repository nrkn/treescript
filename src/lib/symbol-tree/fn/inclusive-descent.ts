import { _Node, Sfollowing, Spreceding } from '../types'

export const sincdesc = <T extends {}>(_node: _Node<T>) => {
  const lastInclusiveDescendant = (value: T) => {
    let last: any
    let current = value

    while (last = _node(current)!.lastChild) current = last

    return current
  }

  const preceding: Spreceding<T> = (value, { root } = {}) => {
    if (value === root) return null

    const previousSibling = _node(value)!.previousSibling

    if (previousSibling) {
      return lastInclusiveDescendant(previousSibling)
    }

    return _node(value)!.parent
  }

  const following: Sfollowing<T> = (value, { root, skipChildren } = {}) => {
    const firstChild = !skipChildren && _node(value)!.firstChild

    if (firstChild) return firstChild

    let current: any = value

    do {
      if (current === root) return null

      const nextSibling = _node(current)!.nextSibling

      if (nextSibling) {
        return nextSibling
      }

      current = _node(current)!.parent
    } while (current)

    return null
  }

  return {
    lastInclusiveDescendant, preceding, following
  }
}
