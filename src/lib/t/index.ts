import { Wnode, WnodeAny } from '../wnode/types'
import { isWnode } from '../wnode/utils'

export type TArg<V extends {},D extends {}> = WnodeAny<D> | Partial<V>

export const T = <D extends {}>(
  createNode: <N extends {}>(value: N) => Wnode<N,D>
) =>
  <V extends {}>(initial: V, ...args: TArg<V,D>[]) => {
    const node = createNode(initial)

    for (const arg of args) {
      if (isWnode(arg)) {
        node.appendChild(arg as Wnode<any,D>)
      } else {
        Object.assign(initial, arg)
      }
    }

    return node
  }
