import { Wnode } from '../wnode/types'
import { isWnode } from '../wnode/utils'

export type TArg<T> = Wnode | Partial<T>

export const T = (
  createNode: <N>(value: N) => Wnode<N>
) =>
  <T extends {}>(initial: T, ...args: TArg<T>[]) => {
    const node = createNode(initial)

    for (const arg of args) {
      if (isWnode(arg)) {
        node.appendChild(arg)
      } else {
        Object.assign(initial, arg)
      }
    }

    return node
  }
