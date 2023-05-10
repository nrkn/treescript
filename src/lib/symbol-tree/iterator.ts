import {
  A_TREE, A_ROOT, A_ITERATE_FN, A_NEXT,
  I_PREV, I_NEXT, I_PARENT, I_PRECEDING, I_FOLLOWING
} from './const'

import { Siteration, Stree } from './types'

export const iterator = <T extends {}>(
  tree: Siteration<T>,
  root: T,
  firstResult: T | null,
  iterateFunction: number
): IterableIterator<T> => {
  const next = () => {
    const tree: Stree<T> = it[A_TREE]
    const root: T = it[A_ROOT]
    const iterateFunction = it[A_ITERATE_FN]

    if (it[A_NEXT] === null) return { done: true, value: root }

    const value = it[A_NEXT]

    if (iterateFunction === I_PREV) {
      it[A_NEXT] = tree._node(value)?.previousSibling
    } else if (iterateFunction === I_NEXT) {
      it[A_NEXT] = tree._node(value)?.nextSibling
    } else if (iterateFunction === I_PARENT) {
      it[A_NEXT] = tree._node(value)?.parent
    } else if (iterateFunction === I_PRECEDING) {
      it[A_NEXT] = tree.preceding(value, { root })
    } else if (iterateFunction === I_FOLLOWING) {
      it[A_NEXT] = tree.following(value, { root })
    }

    return { done: false, value }
  }

  const it = {
    next,
    [Symbol.iterator]: () => it
  }

  it[A_TREE] = tree
  it[A_ROOT] = root
  it[A_NEXT] = firstResult
  it[A_ITERATE_FN] = iterateFunction

  return it
}
