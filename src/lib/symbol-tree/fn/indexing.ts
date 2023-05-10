import { 
  C_CONTAINS, C_PRECEDING, C_CONTAINED_BY, C_FOLLOWING, C_DISCONNECTED 
} from '../const'

import { Squery, _Node } from '../types'
import { reverseArrayIndex } from '../util'

export const sindex = <T extends {}>(
  _node: _Node<T>,
  parent: Squery<T>
) => {
  const index = (child: T) => {
    const childNode = _node(child)!
    const parentNode = _node(childNode.parent)

    if (!parentNode) return -1

    let currentIndex = childNode.getCachedIndex(parentNode)

    if (currentIndex >= 0) return currentIndex

    currentIndex = 0
    let object = parentNode.firstChild

    if (parentNode.childIndexCachedUpTo) {
      const cachedUpToNode = _node(parentNode.childIndexCachedUpTo)!
      object = cachedUpToNode.nextSibling
      currentIndex = cachedUpToNode.getCachedIndex(parentNode) + 1
    }

    while (object) {
      const node = _node(object)!

      node.setCachedIndex(parentNode, currentIndex)

      if (object === child) {
        break
      }

      ++currentIndex
      object = node.nextSibling
    }

    parentNode.childIndexCachedUpTo = child

    return currentIndex
  }

  const childrenCount = (parent: T) => {
    const parentNode = _node(parent)!

    if (!parentNode.lastChild) {
      return 0
    }

    return index(parentNode.lastChild) + 1
  }

  const compareTreePosition = (left: T, right: T) => {
    if (left === right) return 0

    const leftAncestors: T[] = []
    { 
      let leftAncestor: any = left

      while (leftAncestor) {
        if (leftAncestor === right) {
          return C_CONTAINS | C_PRECEDING
        }

        leftAncestors.push(leftAncestor)
        leftAncestor = parent(leftAncestor)
      }
    }


    const rightAncestors: T[] = []
    {
      let rightAncestor: any = right

      while (rightAncestor) {
        if (rightAncestor === left) {
          return C_CONTAINED_BY | C_FOLLOWING
        }

        rightAncestors.push(rightAncestor)
        rightAncestor = parent(rightAncestor)
      }
    }


    const root = reverseArrayIndex(leftAncestors, 0)

    if (!root || root !== reverseArrayIndex(rightAncestors, 0)) {
      return C_DISCONNECTED
    }

    let commonAncestorIndex = 0

    const ancestorsMinLength = Math.min(
      leftAncestors.length, rightAncestors.length
    )

    for (let i = 0; i < ancestorsMinLength; ++i) {
      const leftAncestor = reverseArrayIndex(leftAncestors, i)
      const rightAncestor = reverseArrayIndex(rightAncestors, i)

      if (leftAncestor !== rightAncestor) break

      commonAncestorIndex = i
    }

    const leftIndex = index(
      reverseArrayIndex(leftAncestors, commonAncestorIndex + 1)
    )

    const rightIndex = index(
      reverseArrayIndex(rightAncestors, commonAncestorIndex + 1)
    )

    return rightIndex < leftIndex
      ? C_PRECEDING
      : C_FOLLOWING
  }

  return {
    index, childrenCount, compareTreePosition
  }
}
