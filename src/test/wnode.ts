import * as assert from 'assert'
import { wnode, wdoc, wnodeUtils } from '..'

function o() {
  // return an object that is unique in a deepEqual check

  return {
    unique: Symbol(),
  };
}

describe('Wnode', () => {
  it('unassociated object', () => {
    const a = o()
    const n = wnode(a)

    assert.equal(false, n.hasChildren)
    assert.equal(null, n.firstChild)
    assert.equal(null, n.lastChild)
    assert.equal(null, n.prev)
    assert.equal(null, n.next)
    assert.equal(null, n.parent)
    assert.equal(false, n.isAttached)
    assert.equal(a, n.value)
    assert.equal(0, [...n.children].length)
    assert.equal(1, [...n.ancestors].length) // includes self
    assert.equal(1, [...n.descendants].length) // includes self
    assert.equal(0, [...n.previousSiblings].length)
    assert.equal(0, [...n.nextSiblings].length)
    assert.equal(-1, n.index) // no parent
    assert.equal(0, n.childrenCount)

    // should not throw and should return itself
    const b = n.remove()

    assert.equal(n, b)
  })
})
