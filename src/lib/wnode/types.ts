import { SincdescOpts } from '../symbol-tree/types'

export type WnodeProps<T extends {}, D extends {}> = {
  value: T
  children: IterableIterator<WnodeAny<D>>
  ancestors: IterableIterator<WnodeAny<D>>
  descendants: IterableIterator<WnodeAny<D>>
  previousSiblings: IterableIterator<WnodeAny<D>>
  nextSiblings: IterableIterator<WnodeAny<D>>

  parent: MaybeNode<D>
  prev: MaybeNode<D>
  next: MaybeNode<D>
  firstChild: MaybeNode<D>
  lastChild: MaybeNode<D>

  hasChildren: boolean

  index: number
  childrenCount: number
}

export type WnodeSelector = <D extends {}>(node: WnodeAny<D>) => boolean

export type WnodeMethods<T extends {}, D extends {}> = {
  remove: () => Wnode<T, D>
  insertBefore: <A extends {}>(
    newNode: Wnode<A, D>, referenceNode?: MaybeNode<D>
  ) => Wnode<A, D>
  insertAfter: <A extends {}>(
    newNode: Wnode<A, D>, referenceNode?: MaybeNode<D>
  ) => Wnode<A, D>
  prependChild: <A extends {}>(newNode: Wnode<A, D>) => Wnode<A, D>
  appendChild: <A extends {}>(newNode: Wnode<A, D>) => Wnode<A, D>
  lastInclusiveDescendant: () => WnodeAny<D>
  preceding: (options?: SincdescOpts<WnodeAny<D>>) => MaybeNode<D>
  following: (options?: SincdescOpts<WnodeAny<D>>) => MaybeNode<D>
}

export type WnodeExtra = {
  after: (...nodes: WnodeAny<WnodeExtra>[]) => void
  append: (...nodes: WnodeAny<WnodeExtra>[]) => void
  before: (...nodes: WnodeAny<WnodeExtra>[]) => void
  prepend: (...nodes: WnodeAny<WnodeExtra>[]) => void

  replaceChildren: (...nodes: WnodeAny<WnodeExtra>[]) => void
  replaceWith: (...nodes: WnodeAny<WnodeExtra>[]) => void

  ancestor: (selector: WnodeSelector) => WnodeAny<WnodeExtra>
  find: (selector: WnodeSelector) => MaybeNode<WnodeExtra>
  all: (selector: WnodeSelector) => IterableIterator<Wnode<any, WnodeExtra>>
  matches: (selector: WnodeSelector) => boolean
}

export type Wnode<T extends {}, D extends {}> = (
  Readonly<WnodeProps<T, D>> & WnodeMethods<T, D> & D
)

export type WnodeAny<D extends {}> = Wnode<any, D>

export type WnodeAA = WnodeAny<any>

export type MaybeNode<D extends {}> = WnodeAny<D> | null

export type Wdecorator<D> = (node: WnodeAny<any>) => D
