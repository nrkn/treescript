import { snode } from '../node'
import { _Node } from '../types'

export const s_node = <T extends {}>(description?: string) => {
  const symbol = Symbol(description || 'stree')

  const _node: _Node<T> = value => {
    if (value === undefined || value === null ) return null

    const node = value[symbol]

    if (node !== undefined) return node

    return (value[symbol] = snode<T>())
  }

  return _node
}
