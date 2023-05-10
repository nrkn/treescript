export type Snode<T extends {}> = {
  parent: T | null
  previousSibling: T | null
  nextSibling: T | null
  firstChild: T | null
  lastChild: T | null

  childIndexCachedUpTo: T | null
  childrenVersion: number
  cachedIndex: number
  cachedIndexVersion: number

  get isAttached(): boolean
  get hasChildren(): boolean

  childrenChanged: () => void
  getCachedIndex: (parentNode: Snode<T>) => number
  setCachedIndex: (parentNode: Snode<T>, index: number) => void
}

export type Stree<T extends {}> = {
  initialize: (value: T) => T
  _node: (value?: T) => Snode<T> | null

  hasChildren: (value: T) => boolean
  firstChild: Squery<T>
  lastChild: Squery<T>
  previousSibling: Squery<T>
  nextSibling: Squery<T>
  parent: Squery<T>

  remove: (value: T) => T
  insertBefore: Smanip<T>
  insertAfter: Smanip<T>
  prependChild: Smanip<T>
  appendChild: Smanip<T>

  index: (value: T) => number
  childrenCount: (value: T) => number
  compareTreePosition: (left: T, right: T) => number

  lastInclusiveDescendant: (value: T) => T
  preceding: Spreceding<T>
  following: Sfollowing<T>

  childrenToArray: Sarray<T>
  ancestorsToArray: Sarray<T>
  treeToArray: Sarray<T>

  childrenIterator: Siterator<T>
  previousSiblingsIterator: Siterator<T>
  nextSiblingsIterator: Siterator<T>
  ancestorsIterator: Siterator<T>
  treeIterator: Siterator<T>
}

type SarrayOptions<T> = {
  array: T[]
  filter: (value: T) => boolean
  thisArg: any
}

type SincdescOptions<T> = {
  root: T
  skipChildren: boolean
}

type SiteratorOptions = {
  reverse: boolean
}

export type SarrOpts<T> = Partial<SarrayOptions<T>> | undefined

export type SincdescOpts<T> = Partial<SincdescOptions<T>> | undefined

export type SiterOpts = Partial<SiteratorOptions> | undefined

type Siter = '_node' | 'preceding' | 'following'

export type Siteration<T extends {}> = Pick<Stree<T>, Siter>

export type _Node<T extends {}> = (value?: T | null ) => Snode<T> | null

export type Spreceding<T extends {}> = (
  value: T, options?: SincdescOpts<T>
) => T | null

export type Sfollowing<T extends {}> = Spreceding<T>

export type Sarray<T extends {}> = (value: T, options?: SarrOpts<T>) => T[]

export type Squery<T extends {}> = (value: T) => T | null

export type Smanip<T extends {}> = (refOrParent: T, value: T) => T

export type Siterator<T extends {}> = (
  value: T, options?: SiterOpts
) => IterableIterator<T>
