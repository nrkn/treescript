import { SincdescOpts } from '../symbol-tree/types'

export type WnodeProps<Val extends {}, Deco extends {}> = {
  value: Val
  children: IterableIterator<WnodeAny<Deco>>
  ancestors: IterableIterator<WnodeAny<Deco>>
  descendants: IterableIterator<WnodeAny<Deco>>
  previousSiblings: IterableIterator<WnodeAny<Deco>>
  nextSiblings: IterableIterator<WnodeAny<Deco>>

  parent: MaybeNode<Deco>
  prev: MaybeNode<Deco>
  next: MaybeNode<Deco>
  firstChild: MaybeNode<Deco>
  lastChild: MaybeNode<Deco>

  hasChildren: boolean

  index: number
  childrenCount: number
}

export type WnodeSelector = <Deco extends {}>(node: WnodeAny<Deco>) => boolean

export type WnodeMethods<Val extends {}, Deco extends {}> = {
  remove: () => Wnode<Val, Deco>

  insertBefore: <NewV extends {}>(
    newNode: Wnode<NewV, Deco>, referenceNode?: MaybeNode<Deco>
  ) => Wnode<NewV, Deco>

  insertAfter: <NewV extends {}>(
    newNode: Wnode<NewV, Deco>, referenceNode?: MaybeNode<Deco>
  ) => Wnode<NewV, Deco>

  prependChild: <NewV extends {}>(
    newNode: Wnode<NewV, Deco>
  ) => Wnode<NewV, Deco>
  
  appendChild: <NewV extends {}>(
    newNode: Wnode<NewV, Deco>
  ) => Wnode<NewV, Deco>

  lastInclusiveDescendant: () => WnodeAny<Deco>
  preceding: (options?: SincdescOpts<WnodeAny<Deco>>) => MaybeNode<Deco>
  following: (options?: SincdescOpts<WnodeAny<Deco>>) => MaybeNode<Deco>
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
  all: (selector: WnodeSelector) => IterableIterator<WnodeAny<WnodeExtra>>
  matches: (selector: WnodeSelector) => boolean
}

export type Wnode<Val extends {}, Deco extends {}> = (
  Readonly<WnodeProps<Val, Deco>> & WnodeMethods<Val, Deco> & Deco
)

export type WnodeAny<Deco extends {}> = Wnode<any, Deco>

export type WnodeAA = WnodeAny<any>

export type MaybeNode<Deco extends {}> = WnodeAny<Deco> | null

export type Wdecorator<Deco extends {}> = (node: WnodeAny<any>) => Deco

export type CreateWnode<Deco extends {}> = <Val extends {}>( value: Val ) => (
  Wnode<Val, Deco>
)
