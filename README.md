# treescript

Hyperscript-like creation of generic trees in typescript

`npm install @nrkn/treescript`

```js
import { t, serialize } from '@nrkn/treescript'

const carnivora = t(
  'Carnivora',
  t('Caniformia',
    t('Canids',
      t('Dogs'), t('Wolves'), t('Foxes')
    ),
    t('Ursids',
      t('Brown Bears'), t('Polar Bears'), t('Black Bears'), t('Pandas')
    ),
    t('Mustelids',
      t('Weasels'), t('Otters'), t('Badgers')
    )
  ),
  t('Feliformia',
    t('Felids',
      t('Domestic Cats'), t('Lions'), t('Tigers'), t('Leopards')
    ),
    t('Hyenas',
      t('Spotted Hyenas'), t('Striped Hyenas'), t('Brown Hyenas')
    ),
    t('Mongooses',
      t('Meerkats'), t('Banded Mongooses')
    )
  )
)

/* 
  don't do this, it will throw, string trees expect nothing but nodes after the 
  initial value

  t( 'a', 'b' )
*/

const ursids = carnivora.find( n => n.value === 'Ursids' )

const pandaNote = { value: 'herbivore', note: 'We know this one' }

for( const bear of ursids.children ){
  console.log( 'adding todo metadata to', bear.value )

  // don't have to be strings - they were just clear and concise above
  const additionalBearData = t(
    { type: 'metadata' },
    t( { key: 'weight', value: 0, note: 'Todo - update weight' } ),
    t( { key: 'height', value: 0, note: 'Todo - update height' } ),
    t( 
      { key: 'diet', value: '', note: '' },

      // if it's an object tree, we can pass partial objects as well as nodes
      bear.value === 'Pandas' ? pandaNote : { note: 'Todo - update diet' }

      // in typescript, the type is inferred from the initial value, so all
      // potential properties must be present for partials to work. javascript
      // doesn't care, but you'll get a runtime error if you try mix eg
      // strings and objects within the same node
    )
  )

  bear.append( additionalBearData )
}

console.log( serialize( ursids ) )
```

## Contents

- [Usage](#usage)
  - [treescript](#treescript-1)
    - [t](#t)
    - [ne](#ne)
    - [tOf](#tof)
    - [T](#t-1)
  - [wnode](#wnode)
    - [properties](#properties)
    - [methods](#methods)
    - [decorator](#decorator)
  - [stree](#stree)
  - [utils](#utils)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Usage

We have three levels of abstraction:

1. High - treescript - [hyperscript](https://github.com/hyperhype/hyperscript) 
   like creation of trees
2. Mid - wnode - creation of nodes, similar to the DOM, backing treescript
3. Low - stree - a [symbol-tree](https://github.com/jsdom/js-symbol-tree) clone, 
   backing for wnode

The default exports from the module are:

```js
import { 
  t, ne, tOf, T, wnode, wdoc, wnodeExtra, stree, serialize, deserialize, isWnode 
} from '@nrkn/treescript'
```

- `t` - primary hyperscript-like factory for creating typed `wnode` instances
  (in typescript - see notes below about javascript) - the default exported `t`
  (and `ne` and `tOf`) creates `wnode` instances that are pre-decorated with 
  extra functions, see below
- `ne` - factory for creating `wnode` instances with an `any` type, for 
  composition
- `tOf` - factory for creating `t` factories bound to an initial value returned
  by a `create` function - useful for concisely creating nodes of different 
  types
- `T` - a factory for creating a `t` instance with a custom `createNode` 
  function, eg one that has or does not have decorators
- `TArg` - in typescript, the type of the args passed to `t` et al
- `wnode` - a factory function for creating `wnode` instances - the 
  default export is decorated with extra functions
- `wdoc` - a factory function for creating a `wnode` create node factory, with
  no extra decoration, or custom decoration
- `wnodeExtra` - a decorator for `wnode` instances, contains the extra functions
  which decorate many of the default exports
- `stree` - `symbol-tree` clone, used by `wnode` instances
- `serialize`, `deserialize` - functions for serializing and deserializing 
  `wnode` instances
- `isWnode` - a type guard predicate for `wnode` instances 

A brief description of how the parts are created and how they relate to each
other, if you want to customize or override behaviour, at any level:

- tOf is backed by t
- ne is backed by t
- t is backed by T
- T is backed by wnode
- wnode is backed by wdoc
- wdoc is backed by stree

### treescript

Create `wnode` instances with a hyperscript-like syntax. More on `wnode` later.

There are three factories provided for creating nodes, the nodes created by them
can be used interchangeably, eg you can append a node created by `t` to a node
created by `ne` etc - they are all just `wnode` instances

#### t

```ts
type TArg<T> = Wnode | Partial<T>

const t: <T extends {}>(initial: T, ...args: TArg<T>[]) => Wnode<T>
```

The initial value sets the type of the node.

The `args` can be a mix of `Partial<T>` and `Wnode`, the partials are 
applied to the initial value, and the nodes are added as children.

```js
import { t } from '@nrkn/treescript'

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

In typescript, the initial value *must* provide the full value for the type if
using inference, eg, this works:

```ts
t({ type: 'foo', name: '' }, { name: 'bar' } )
```

And this fails:

```ts
t({ type: 'foo' }, { name: 'bar' } )
```

```
Argument of type '{ name: string; }' is not assignable to parameter of type 
'TArg<{ type: string; }>'.
  Object literal may only specify known properties, and 'name' does not exist in 
  type 'TArg<{ type: string; }>'.ts(2345)
```

You can compose using partial types if you use `ne`, see below, or, you can
explicitly set the type as Partial, eg:

```ts
type MyType = { type: string, name: string }

const p = t<Partial<MyType>>({ type: 'foo' }, { name: 'bar' } )
```

In javascript, provided your developement environment doesn't enforce typescript
types, you can use `t` in the same way as `ne` below, the run time behaviour is
the same.

#### ne

Like `t`, but with no initial value required, therefore the node type is 'any',
and the value is the composite of all non-node arguments. Useful for 
composition, eg

```js
import { ne } from '@nrkn/treescript'

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
import { tOf } from '@nrkn/treescript'

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

#### T

`T` is a factory function that creates a `t` function, where nodes are created
using the passed in `create` function. 

You can use this when:

- you want to use the decorate capability of `wnode` (see below), so you have
  a custom wnode you want to use
- you want to wrap an instance of wnode in a function that modifies it in some
  way, or adds logging etc

```ts
const T: (createNode: <N>(value: N) => Wnode<N>) => 
  <T extends {}>(initial: T, ...args: TArg<T>[]) => Wnode<T>
```  

```js
import { T, wdoc, wnode } from '@nrkn/treescript'

const myCustomDecorator = { /* see below */ }

const create = wdoc( myCustomDecorator )

const t = T( create )

const myDoc = t(
  { type: 'doc' },
  t( { type: 'section' }, t( 'section 1' ) ),
  t( { type: 'section' }, t( 'section 2' ) )
)

// or:

const myCreate = value => {
  console.log( 'creating a node with value:', value )

  return wnode( value )
}

const t2 = T( myCreate )

const myDoc2 = t2(
  { type: 'doc' },
  t2( { type: 'section' }, t2( 'section 1' ) ),
  t2( { type: 'section' }, t2( 'section 2' ) )
)
```

### wnode

The backing node for `treescript` is `wnode`, which is similar to a DOM node in
operation, but has a different API. It is basically just a light weight wrapper
around `symbol-tree`

The custom value is stored in `wnode.value`

```ts
import { wnode } from '@nrkn/treescript'

const chest = wnode({ type: 'chest', capacity: 10, used: 0, size: 12 })
const sword = wnode({ type: 'sword', quality: 'rusty af', size: 3 })

const addToContainer = ( container, item } ) => {
  const { value: c } = container
  const { value: i } = item

  if( ( c.used + i.size ) > c.capacity ){
    return false
  }

  container.appendChild( item )
  c.used += i.size

  return true
}

if( !addToContainer( chest, sword ) ){
  console.log( 'no room for sword' )
}
```

#### properties

```ts
type WnodeProps<T = any> = {
  // the value passed in eg wnode( value ) or t( value ) etc
  value: T
  // iterator of child nodes
  children: IterableIterator<Wnode>
  // iterator of ancestor nodes - includes self
  ancestors: IterableIterator<Wnode>
  // iterator of descendant nodes - includes self
  descendants: IterableIterator<Wnode>
  // iterator of previous sibling nodes
  previousSiblings: IterableIterator<Wnode>
  // iterator of next sibling nodes
  nextSiblings: IterableIterator<Wnode>
  
  // the parent node, if any
  parent: MaybeNode // MaybeNode = Wnode | null
  // the previous sibling node, if any
  prev: MaybeNode
  // the next sibling node, if any
  next: MaybeNode
  // the first child node, if any
  firstChild: MaybeNode
  // the last child node, if any
  lastChild: MaybeNode

  // true if the node has children
  hasChildren: boolean
  // the index within parent, or -1 if no parent
  index: number
  // the number of children
  childrenCount: number
}
```

#### methods

```ts
type WnodeMethods = {
  // removes the node from its parent, if any
  remove: () => Wnode
  // insert the newNode before the referenceNode - the referenceNode must be a 
  // child of this node, or null or undefined, in which case the newNode is
  // appended to the end of the children
  insertBefore: (newNode: Wnode, referenceNode?: MaybeNode) => Wnode
  // same as insertBefore, but inserts after the referenceNode
  insertAfter: (newNode: Wnode, referenceNode?: MaybeNode) => Wnode
  // prepends the newNode to the start of children
  prependChild: (newNode: Wnode) => Wnode
  // appends the newNode to the end of children
  appendChild: (newNode: Wnode) => Wnode
  // get the last node traversing the tree downwards - could be self
  lastInclusiveDescendant: () => Wnode  

  // gets the previous node in a depth-first tree traversal, if any
  preceding: (options?: SincdescOpts<Wnode>) => MaybeNode
  // gets the next node in a depth-first tree traversal, if any
  following: (options?: SincdescOpts<Wnode>) => MaybeNode
}

type SincdescOpts<T> = Partial<{
  // must be inclusive ancestor of the returned node, or null is returned
  root: T
  // following only - ignores the children of the current node when traversing
  skipChildren: boolean
}>

```

#### decorators

Decorate `wnode` instances with custom methods. 

```js
import { wdoc } from '@nrkn/treescript'
import { myCustom } from './custom'

const wnode = wdoc( myCustom )

const myNode = wnode({ name: 'hello' })
```

There is an example provided that adds the following useful methods:

```ts
type WnodeSelector = (node: Wnode) => boolean

type WnodeExtra = {
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
import { wdoc, wnodeExtra } from '@nrkn/treescript'

const wnode = wdoc( wnodeExtra )
```

If you use a custom decorator, the instances created by `wnode` will be typed with 
your additional methods. 

Custom decorators are structured like so:

```ts
export const wnodeExtra: Wdecorator<WnodeExtra> = (node: Wnode) => {
  const wnodeExtra: WnodeExtra = {
    after(...nodes) {
      for (const n of nodes) {
        node.insertAfter(n, node)
      }
    },
    // etc
  }

  return wnodeExtra
}
```

You can only pass through a single decorator object - if you want to combine 
several, to eg extend wnodeExtra, you can do with a pattern like this:

```ts
import { wnodeExtra, wdoc } from '@nrkn/treescript'

import { myCustomDecorator } from './myCustomDecorator'

const myDecorator = node => {
  return {
    ...wnodeExtra( node ),
    
    myCustomMethod() {
      console.log( 
        `this node's value has ${ Object.keys( node.value ).length } keys` 
      )
    }

    ...myCustomDecorator( node )
  }
}

const wnode = wdoc( myDecorator )
```

### stree

`stree` is a clone of `symbol-tree`, but ported to functional style typescript 
and using conventions that I find comfortable. It's used to create the backing 
tree for `wnode`. It has the same interface as the official `symbol-tree` 
package, except instances are generated via `stree()` rather than 
`new SymbolTree()`

```js
import { stree } from '@nrkn/treescript'

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

### utils

Serialize and deserialize wnodes to a plain array of value followed by children. 
You can pass a value transformer if you plan to export to JSON and your value
is not JSON serializable.

```js
import { t, serialize, deserialize } from '@nrkn/treescript'

const tree = t(
  'a',
  t( 'b' ),
  t( 'c' ),
  t( 'd', t( 'e' ) )
)

const serialized = JSON.stringify( serialize( tree ), null, 2 )

/*

[
  "a",
  [ "b" ],
  [ "c" ],
  [
    "d",
    [ "e" ]
  ]
]

*/
console.log( serialized )

const deserialized = deserialize( JSON.parse( serialized ) )

console.log( deserialized.firstChild.value ) // 'b'
```

With transformers:

```js
import { t, serialize, deserialize } from '@nrkn/treescript'

const tree = t(
  { id: 'foo', created: new Date() },
  t( { id: 'bar' } ),
  t( { id: 'baz' } )
)

const serializeDate = value => {
  if( !('created' in value) ) return value
  
  return { ...value, created: value.date.toJSON() }
}
const deserializeDate = value => {
  if( !('created' in value) ) return value

  return { ...value, created: new Date( value.created ) }
}

const serialized = JSON.stringify( serialize( tree, serializeDate ), null, 2 )

console.log( serialized )
/*
[
  {
    "id": "foo",
    "created": "2021-08-01T00:00:00.000Z"
  },
  [
    {
      "id": "bar"
    }
  ],
  [
    {
      "id": "baz"
    }
  ]
]
*/

const deserialized = deserialize( JSON.parse( serialized ), deserializeDate )

console.log( deserialized.value.created instanceof Date ) // true
```

## Acknowledgements

This package came about because I was really interested in how  `symbol-tree` 
worked, so I cloned it as a learning exercise. Once it was passing the test 
suite for real `symbol-tree`, I ended up building the other parts on top of that 
as I wanted something as concise, readable and composable as hyperscript, but
for generic tree nodes of varying kinds. 

This project is based on [symbol-tree](https://github.com/jsdom/js-symbol-tree) 
by Joris van der Wel. The original code is licensed under the MIT License, and 
the modified code in this project is also distributed under the same license. 
See the [LICENSE](./src/lib/symbol-tree/LICENSE) file in the `/src/symbol-tree` 
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
