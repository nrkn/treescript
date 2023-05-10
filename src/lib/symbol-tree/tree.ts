import { I_FOLLOWING, I_NEXT, I_PARENT, I_PRECEDING, I_PREV } from './const'
import { Siterator, Stree, _Node } from './types'
import { _true } from './util'
import { iterator } from './iterator'
import { s_node } from './fn/_node'
import { smanipulation } from './fn/manipulation'
import { sindex } from './fn/indexing'
import { sincdesc } from './fn/inclusive-descent'
import { sarrays } from './fn/arrays'
import { squery } from './fn/query'

export const stree = <T extends {}>(
  description?: string
): Stree<T> => {
  const _node = s_node<T>(description)

  const initialize = (value: T) => {
    _node(value)

    return value
  }

  const {
    hasChildren, firstChild, lastChild, previousSibling,
    nextSibling, parent
  } = squery(_node)

  const {
    remove, insertBefore, insertAfter, prependChild, appendChild
  } = smanipulation(_node)

  const {
    index, childrenCount, compareTreePosition
  } = sindex(_node, parent)

  const {
    lastInclusiveDescendant, preceding, following
  } = sincdesc(_node)

  const {
    childrenToArray, ancestorsToArray, treeToArray
  } = sarrays(_node, following)

  const sit = { _node, preceding, following }

  const childrenIterator: Siterator<T> = (parent, { reverse = false } = {}) => {
    const parentNode = _node(parent)

    return iterator<T>(
      sit,
      parent,
      reverse ? parentNode?.lastChild! : parentNode?.firstChild!,
      reverse ? I_PREV : I_NEXT
    )
  }

  const previousSiblingsIterator = (value: T) => {
    return iterator<T>(
      sit,
      value,
      _node(value)?.previousSibling!,
      I_PREV
    )
  }

  const nextSiblingsIterator = (value: T) => {
    return iterator<T>(
      sit,
      value,
      _node(value)?.nextSibling!,
      I_NEXT
    )
  }

  const ancestorsIterator = (value: T) => {
    return iterator<T>(
      sit,
      value,
      value,
      I_PARENT
    )
  }

  const treeIterator: Siterator<T> = (root: T, { reverse = false } = {}) => {
    return iterator<T>(
      sit,
      root,
      reverse ? lastInclusiveDescendant(root) : root,
      reverse ? I_PRECEDING : I_FOLLOWING
    )
  }

  const tree: Stree<T> = {
    _node, initialize,

    hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent,

    remove, insertBefore, insertAfter, prependChild, appendChild,

    index, childrenCount, compareTreePosition,

    lastInclusiveDescendant, preceding, following,

    childrenToArray, ancestorsToArray, treeToArray,

    childrenIterator, previousSiblingsIterator, nextSiblingsIterator,
    ancestorsIterator, treeIterator
  }

  return tree
}
