import {
  I_PREV, I_NEXT, I_PARENT, I_PRECEDING, I_FOLLOWING
} from './const'

import { Siteration } from './types'

export const iterator = <T extends {}>(
  tree: Siteration<T>,
  root: T,
  firstResult: T | null,
  iterateFunction: number
): IterableIterator<T> => {
  const next = () => {
    if (nextVal === null) return { done: true, value: root }

    const value = nextVal
    const result = { done: false, value }

    if (iterateFunction === I_PREV) {
      nextVal = tree._node(value)!.previousSibling
    } else if (iterateFunction === I_NEXT) {
      nextVal = tree._node(value)!.nextSibling
    } else if (iterateFunction === I_PARENT) {
      nextVal = tree._node(value)!.parent
    } else if (iterateFunction === I_PRECEDING) {
      nextVal = tree.preceding(value, { root })
    } else if (iterateFunction === I_FOLLOWING) {
      nextVal = tree.following(value, { root })
    } else {
      throw Error(`Unknown iterateFunction: "${iterateFunction}"`)
    }

    return result
  }

  const it = {
    next,
    [Symbol.iterator]: () => it
  }

  let nextVal: any = firstResult

  return it
}
