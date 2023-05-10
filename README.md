# treescript

Hyperscript-like creation of generic trees in typescript

`npm install treescript`

This package came about because I was really interested in how  `symbol-tree` 
worked, so I cloned it as a learning exercise. Once it was passing the test 
suite for real `symbol-tree`, I ended up building the other parts on top of that 
as I wanted something as concise, readable and composable as hyperscript, but
for generic tree nodes of varying kinds. 

## Contents

- [Usage](#usage)
  - [treescript](#treescript-1)
    - [t](#t)
    - [ne](#ne)
    - [tOf](#tof)
  - [wnode](#wnode)
    - [properties](#properties)
    - [methods](#methods)
    - [utils](#utils)
  - [stree](#stree)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Usage

We have three levels of abstraction:

1. High - treescript - [hyperscript](https://github.com/hyperhype/hyperscript) 
   like creation of trees
2. Mid - wnode - creation of nodes, similar to the DOM, backing treescript
3. Low - stree - a [symbol-tree](https://github.com/jsdom/js-symbol-tree) clone, 
   backing for wnode

### treescript

Create `wnode` instances with a hyperscript-like syntax. More on `wnode` later.

#### t

```ts
type TArg<T> = Wnode | Partial<T>

const t: <T extends {}>(initial: T, ...args: TArg<T>[]) => Wnode<T>
```

The initial value sets the type of the node.

The `args` can be a mix of `Partial<T>` and `Wnode`, the partials are 
applied to the initial value, and the nodes are added as children.

```js
import { t } from 'treescript'

const clubs = t(
  { type: 'clubs' },
  t( 
    { type: 'club', name: 'star gazers' },
    t( 'alex sun' ),
    t( 'nick moon' )
  ),
  t( 
    { type: 'club', name: 'wildlife watchers' },
    t( 'quinn bird' ),
    t( 'blake bear' ),
    // I'm guessing someone in the club added this - this partial will override
    // the name of the club - this pattern is useful for composition
    { name: 'the best wildlife watchers club' }
  )
)

const people = clubs.all( n => typeof n.value === 'string' )

for( const person of people ){
  console.log( person.value )
}
```

#### ne

Like `t`, but with no initial value required, therefore the node type is 'any',
and the value is the composite of all non-node arguments. Useful for 
composition, eg

```js
import { ne } from 'treescript'

const feature1 = { fast: true }
const feature2 = { shinyButtons: true }

const machine = ne(
  { name: 'embiggening inversocatorer' }, feature1, feature2,
  ne(
    { name: 'inversocatorer dial' }, feature2
  )
)
```

#### tOf

Takes a `create` function and returns a function similar to `t`, but which
has its initial value populated by the `create` function, so doesn't need to be
passed in.

```js
import { tOf } from 'treescript'

const createOutfit = () => ({ type: 'outfit', hasPockets: true, name: '' })
const createHat = () => ({ type: 'hat', hatBrimSize: 'medium', name: '' })
const createCoat = () => ({ type: 'coat', isWaterproof: false, name: '' })
const createPants = () => ({ type: 'pants', numberOfBeltLoops: 6, name: '' })
const createDress = () => ({ type: 'dress', twirlFactor: 'high', name: '' })
const createTop = () => ({ type: 'top', hasSequins: true, name: '' })

const outfit = tOf( createOutfit )
const hat = tOf( createHat )
const coat = tOf( createCoat )
const pants = tOf( createPants )
const dress = tOf( createDress )
const top = tOf( createTop )

const myOutfit = outfit(
  { name: 'dancing outfit' },

  hat({ name: 'witch hat', hatBrimSize: 'enormous' }),
  dress({ name: 'polka dot dress' }),
  top({ name: 'sparkly blouse' })
)

```

### wnode

The backing node for `treescript` is `wnode`, which is similar to a DOM node in
operation, but has a different API. It is basically just a light weight wrapper
around `symbol-tree`

The custom value is stored in `wnode.value`

```ts
import { wnode } from 'treescript'

const chest = wnode({ type: 'chest', capacity: 10, used: 0, size: 12 })
const sword = wnode({ type: 'sword', quality: 'rusty af', size: 3 })

const addToChest = ( { value: ch }, { value: item } ) => {
  if( ( ch.used + item.size ) > ch.capacity ){
    return false
  }

  ch.appendChild( item )
  ch.used += item.size

  return true
}

if( !addToChest( chest, sword ) ){
  console.log( 'no room for sword' )
}
```

#### properties

```ts
type WnodeProps<T = any> = {
  value: T
  children: IterableIterator<Wnode>
  ancestors: IterableIterator<Wnode>
  descendants: IterableIterator<Wnode>
  previousSiblings: IterableIterator<Wnode>
  nextSiblings: IterableIterator<Wnode>
  
  parent: MaybeNode // Wnode | null
  prev: MaybeNode
  next: MaybeNode
  firstChild: MaybeNode
  lastChild: MaybeNode

  isAttached: boolean
  hasChildren: boolean

  index: number
  childrenCount: number
}
```

#### methods

```ts
type WnodeMethods = {
  remove: () => Wnode
  insertBefore: (newNode: Wnode, referenceNode: MaybeNode) => Wnode
  insertAfter: (newNode: Wnode, referenceNode: MaybeNode) => Wnode
  prependChild: (newNode: Wnode) => Wnode
  appendChild: (newNode: Wnode) => Wnode
  compareTreePosition: (otherNode: Wnode) => number
  lastInclusiveDescendant: () => Wnode  
  preceding: (options?: SincdescOpts<Wnode>) => MaybeNode
  following: (options?: SincdescOpts<Wnode>) => MaybeNode
}
```

#### utils

Decorate `wnode` instances with custom methods. 

```js
import { wdoc } from 'treescript'
import { myCustom } from './custom'

const wnode = wdoc( myCustom )

const myNode = wnode({ name: 'hello' })
```

There is an example provided that adds the following useful methods:

```ts
type WnodeSelector = (node: Wnode) => boolean

type WnodeUtils = {
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
```

```js
import { wdoc, wnodeUtils } from 'treescript'

const wnode = wdoc( wnodeUtils )
```

If you use a custom util, the instances created by `wnode` will be typed with 
your additional methods. 

Custom utils are structured like so:

```ts
export const wnodeUtils: WutilFactory<WnodeUtils> = (node: Wnode) => {
  const utils: WnodeUtils = {
    after(...nodes) {
      for (const n of nodes) {
        node.insertAfter(n, node)
      }
    },
    // etc
  }

  return utils
}
```

You can only pass through a single utils object - if you want to use multiple, 
to eg extend wnodeUtils, you can do with a pattern like this:

```ts
import { wnodeUtils, wdoc } from 'treescript'

const myUtils = node => {
  const baseUtils = wnodeUtils( node )

  return {
    ...baseUtils,
    myCustomMethod() {
      console.log( 
        `this node's value has ${ Object.keys( node.value ).length } keys` 
      )
    }
  }
}

const wnode = wdoc( myUtils )
```

### stree

`stree` is a clone of `symbol-tree`, but ported to functional style typescript 
and using conventions that I find comfortable. It's used to create the backing 
tree for `wnode`. It has the same interface as the official `symbol-tree` 
package, except instances are generated via `stree()` rather than 
`new SymbolTree()`

```js
import { stree } from 'treescript'

const tree = stree()

let a = {foo: 'bar'} // or `new Whatever()`
let b = {foo: 'baz'}
let c = {foo: 'qux'}

tree.insertBefore(b, a) // insert a before b
tree.insertAfter(b, c) // insert c after b

console.log(tree.nextSibling(a) === b)
console.log(tree.nextSibling(b) === c)
console.log(tree.previousSibling(c) === b)

tree.remove(b)
console.log(tree.nextSibling(a) === c)
```

## Acknowledgements

This project is based on [symbol-tree](https://github.com/jsdom/js-symbol-tree) 
by Joris van der Wel. The original code is licensed under the MIT License, and 
the modified code in this project is also distributed under the same license. 
See the [LICENSE](./src/symbol-tree/LICENSE) file in the `/src/symbol-tree` 
folder for the full text of the license.

## License

MIT License

Copyright (c) 2023 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
