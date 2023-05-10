import { SincdescOpts } from '../symbol-tree/types'

export type WnodeProps<T = any> = {
  value: T
  children: IterableIterator<Wnode>
  ancestors: IterableIterator<Wnode>
  descendants: IterableIterator<Wnode>
  previousSiblings: IterableIterator<Wnode>
  nextSiblings: IterableIterator<Wnode>
  
  parent: MaybeNode
  prev: MaybeNode
  next: MaybeNode
  firstChild: MaybeNode
  lastChild: MaybeNode

  hasChildren: boolean

  index: number
  childrenCount: number
}

export type WnodeSelector = (node: Wnode) => boolean

export type WnodeMethods = {
  remove: () => Wnode
  insertBefore: (newNode: Wnode, referenceNode?: MaybeNode) => Wnode
  insertAfter: (newNode: Wnode, referenceNode?: MaybeNode) => Wnode
  prependChild: (newNode: Wnode) => Wnode
  appendChild: (newNode: Wnode) => Wnode
  lastInclusiveDescendant: () => Wnode  
  preceding: (options?: SincdescOpts<Wnode>) => MaybeNode
  following: (options?: SincdescOpts<Wnode>) => MaybeNode
}

export type WnodeUtils = {
  after: (...nodes: Wnode[]) => void
  append: (...nodes: Wnode[]) => void
  before: (...nodes: Wnode[]) => void
  prepend: (...nodes: Wnode[]) => void

  replaceChildren: (...nodes: Wnode[]) => void
  replaceWith: (...nodes: Wnode[]) => void

  ancestor: (selector: WnodeSelector) => MaybeNode
  find: (selector: WnodeSelector) => MaybeNode
  all: (selector: WnodeSelector) => IterableIterator<Wnode>
  matches: (selector: WnodeSelector) => boolean
}

export type Wnode<T = any> = Readonly<WnodeProps<T>> & WnodeMethods

export type MaybeNode = Wnode | null

export type WutilFactory<T> = ( node: Wnode ) => T
