import { Sarray, Sfollowing, _Node } from '../types'
import { _true } from '../util'

export const sarrays = <T extends {}>(
  _node: _Node<T>,
  following: Sfollowing<T>
) => {
  const childrenToArray: Sarray<T> = (
    parent, { array = [], filter = _true, thisArg } = {}
  ) => {
    const parentNode = _node(parent)!
    let object = parentNode.firstChild
    let index = 0

    while (object) {
      const node = _node(object)!

      node.setCachedIndex(parentNode, index)

      if (filter.call(thisArg, object)) {
        array.push(object)
      }

      object = node.nextSibling
      ++index
    }

    return array
  }

  const ancestorsToArray: Sarray<T> = (
    value, { array = [], filter = _true, thisArg } = {}
  ) => {
    let current: any = value

    while (current) {
      if (filter.call(thisArg, current)) {
        array.push(current)
      }

      current = _node(current)!.parent
    }

    return array
  }

  const treeToArray: Sarray<T> = (
    root, { array = [], filter = _true, thisArg } = {}
  ) => {
    let object: any = root

    while (object) {
      if (filter.call(thisArg, object)) {
        array.push(object)
      }
      object = following(object, { root })
    }

    return array
  }

  return {
    childrenToArray, ancestorsToArray, treeToArray
  }
}
