import { wdoc } from '.'
import { wsymbol } from './const'

import {
  Wnode, WnodeSelector, WnodeExtra, Wdecorator, WnodeAny, WnodeAA
} from './types'

export const wnodeExtra: Wdecorator<WnodeExtra> = <T extends {}, D extends {}>(
  node: Wnode<T, D>
) => {
  const dnode = node as unknown as Wnode<T, WnodeExtra>

  const extra: WnodeExtra = {
    after(...nodes) {
      if (dnode.parent === null) {
        throw Error('Cannot insert after root node')
      }

      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i]
        dnode.parent.insertAfter(n, dnode)
      }
    },
    append(...nodes) {
      for (const n of nodes) {
        dnode.appendChild(n)
      }
    },
    before(...nodes) {
      if (dnode.parent === null) {
        throw Error('Cannot insert before root node')
      }

      for (const n of nodes) {
        dnode.parent.insertBefore(n, dnode)
      }
    },
    prepend(...nodes) {
      for (let i = nodes.length - 1; i >= 0; i--) {
        const n = nodes[i]

        dnode.prependChild(n)
      }
    },
    replaceChildren(...nodes) {
      while (node.firstChild) {
        node.firstChild.remove()
      }

      extra.append(...nodes)
    },
    replaceWith(...nodes) {
      extra.before(...nodes)
      node.remove()
    },
    ancestor(selector) {
      let n: any = dnode

      while (n) {
        if (selector(n)) {
          return n
        }

        n = n.parent
      }

      return null
    },
    find(selector) {
      for (const n of dnode.descendants) {
        if (selector(n)) {
          return n
        }
      }

      return null
    },
    all(selector) {
      return allIterator(dnode.descendants, selector)
    },
    matches(selector) {
      return selector(node)
    }
  }

  return extra
}

export const allIterator = function* <D extends {}>(
  it: IterableIterator<WnodeAny<D>>, selector: WnodeSelector
): IterableIterator<WnodeAny<D>> {
  for (const node of it) {
    if (selector(node)) {
      yield node
    }
  }
}

export const isWnode = <T extends {} = any, D extends {} = any>(
  value: any
): value is Wnode<T, D> =>
  value && value[wsymbol] !== undefined

export const serialize = (
  node: WnodeAA,
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

export const deserialize = (create = wdoc(wnodeExtra)) =>
  (value: any[], valueTransformer?: (value: any) => any): WnodeAA => {
    const node = create(valueTransformer ? valueTransformer(value[0]) : value[0])

    for (const child of value.slice(1)) {
      node.appendChild(deserialize(create)(child, valueTransformer))
    }

    return node
  }
