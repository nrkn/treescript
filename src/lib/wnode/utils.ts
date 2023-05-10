import { wdoc } from '.'
import { wsymbol } from './const'

import {
  MaybeNode, Wnode, WnodeSelector, WnodeUtils, WutilFactory
} from './types'

export const wnodeUtils: WutilFactory<WnodeUtils> = (node: Wnode) => {
  const utils: WnodeUtils = {
    after(...nodes) {
      for (const n of nodes) {
        node.insertAfter(n, node)
      }
    },
    append(...nodes) {
      for (const n of nodes) {
        node.appendChild(n)
      }
    },
    before(...nodes) {
      for (const n of nodes) {
        node.insertBefore(n, node)
      }
    },
    prepend(...nodes) {
      for (const n of nodes) {
        node.prependChild(n)
      }
    },
    replaceChildren(...nodes) {
      while (node.firstChild) {
        node.firstChild.remove()
      }

      utils.append(...nodes)
    },
    replaceWith(...nodes) {
      utils.before(...nodes)
      node.remove()
    },
    ancestor(selector) {
      let n: MaybeNode = node

      while (n) {
        if (selector(n)) {
          return n
        }

        n = n.parent
      }

      return null
    },
    find(selector) {
      for (const n of node.descendants) {
        if (selector(n)) {
          return n
        }
      }

      return null
    },
    all(selector) {
      return allIterator(node.descendants, selector)
    },
    matches(selector) {
      return selector(node)
    }
  }

  return utils
}

export const allIterator = function* (
  it: IterableIterator<Wnode>, selector: WnodeSelector
): IterableIterator<Wnode> {
  for (const node of it) {
    if (selector(node)) {
      yield node
    }
  }
}

export const isWnode = (value: any): value is Wnode =>
  value && value[wsymbol]
  
export const serialize = (
  node: Wnode,
  valueTransformer?: (value: any) => any
) => {
  const result: any = [
    valueTransformer ? valueTransformer(node.value) : node.value,
  ]

  for (const child of node.children) {
    result.push(serialize(child, valueTransformer))
  }

  return result
}

export const deserialize = (create = wdoc(wnodeUtils)) =>
  (value: any[], valueTransformer?: (value: any) => any): Wnode => {
    const node = create(valueTransformer ? valueTransformer(value[0]) : value[0])

    for (const child of value.slice(1)) {
      node.appendChild(deserialize(create)(child, valueTransformer))
    }

    return node
  }