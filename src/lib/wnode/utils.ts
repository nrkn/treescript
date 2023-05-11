import { wdoc } from '.'
import { wsymbol } from './const'

import {
  Wnode, WnodeSelector, WnodeExtra, Wdecorator, WnodeAny, WnodeAA, CreateWnode
} from './types'

export const wnodeExtra: Wdecorator<WnodeExtra> = (
  <Val extends {}, Deco extends {}>(
    node: Wnode<Val, Deco>
  ) => {
    const dnode = node as unknown as Wnode<Val, WnodeExtra>

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
)

export const allIterator = function* <Deco extends {}>(
  it: IterableIterator<WnodeAny<Deco>>, selector: WnodeSelector
): IterableIterator<WnodeAny<Deco>> {
  for (const node of it) {
    if (selector(node)) {
      yield node
    }
  }
}

export const isWnode = ( value: any ): value is WnodeAA =>
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

export const deserializeFrom = <Deco extends {}>(create: CreateWnode<Deco> ) =>
  (value: any[], valueTransformer?: (value: any) => any): WnodeAny<Deco> => {
    const node = create(valueTransformer ? valueTransformer(value[0]) : value[0])

    for (const child of value.slice(1)) {
      node.appendChild(deserializeFrom(create)(child, valueTransformer))
    }

    return node
  }

export const deserialize = deserializeFrom( wdoc( wnodeExtra ) )
