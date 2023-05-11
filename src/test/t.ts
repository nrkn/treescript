import * as assert from 'assert'
import { t, ne, tOf, wnode, T } from '..'

describe('t', () => {
  it('creates a node with initial value and appends children', () => {
    const child1 = t({ name: 'child1', age: 0 })
    const child2 = t({ name: 'child2', age: 0 })

    const parent = t({ name: 'parent', age: 0 }, child1, child2)

    assert.deepEqual(parent.value, { name: 'parent', age: 0 })
    assert.equal(parent.firstChild, child1)
    assert.equal(parent.lastChild, child2)
  })

  it('updates properties in the initial value', () => {
    const node = t({ name: 'test', age: 0 }, { age: 42 })

    assert.deepEqual(node.value, { name: 'test', age: 42 })
  })
})

describe('ne', () => {
  it('creates a node with an empty initial value and appends children', () => {
    const child1 = t({ name: 'child1', age: 0 })
    const child2 = t({ name: 'child2', age: 0 })

    const parent = ne(child1, child2)

    assert.deepEqual(parent.value, {})
    assert.equal(parent.firstChild, child1)
    assert.equal(parent.lastChild, child2)
  })
})

describe('tOf', () => {
  it('creates a specialized node creator with a predefined default value', () => {
    const createDefaultPerson = () => ({ name: 'John Doe', age: 30 })
    const tPerson = tOf(createDefaultPerson)

    const child1 = tPerson({ age: 25 })
    const child2 = tPerson({ name: 'Jane Doe' })

    const parent = tPerson(child1, child2)

    assert.deepEqual(parent.value, { name: 'John Doe', age: 30 })
    assert.deepEqual(child1.value, { name: 'John Doe', age: 25 })
    assert.deepEqual(child2.value, { name: 'Jane Doe', age: 30 })
    assert.equal(parent.firstChild, child1)
    assert.equal(parent.lastChild, child2)
  })
})

describe('T with custom createNode', () => {
  const customCreateNode = (value) => {
    const newNode = wnode(value)
    newNode.value.custom = true
    return newNode
  }

  const customT = T(customCreateNode)

  it('creates a node with custom createNode function', () => {
    const child1 = customT({ name: 'child1', age: 0 })
    const child2 = customT({ name: 'child2', age: 0 })

    const parent = customT({ name: 'parent', age: 0 }, child1, child2)

    assert.deepEqual(parent.value, { name: 'parent', age: 0, custom: true })
    assert.equal(parent.firstChild, child1)
    assert.equal(parent.lastChild, child2)

    assert.deepEqual(child1.value, { name: 'child1', age: 0, custom: true })
    assert.deepEqual(child2.value, { name: 'child2', age: 0, custom: true })
  })
})
