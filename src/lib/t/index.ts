import { Wnode, WnodeAny } from '../wnode/types'
import { isWnode } from '../wnode/utils'

export type TArg<Val extends {}, Deco extends {}> = (
  WnodeAny<Deco> | Partial<Val>
)

export const T = <Deco extends {}>(
  createNode: <NewVal extends {}>(value: NewVal) => Wnode<NewVal, Deco>
) =>
  <Val extends {}>(initial: Val, ...args: TArg<Val, Deco>[]) => {
    const node = createNode(initial)

    for (const arg of args) {
      if (isWnode(arg)) {
        node.appendChild(arg as Wnode<any, Deco>)
      } else {
        Object.assign(initial, arg)
      }
    }

    return node
  }
