import * as assert from 'assert'
import { wnode, wdoc, wnodeUtils, serialize, deserialize } from '..'
import { isWnode } from '../lib/wnode/utils';

function o() {
  // return an object that is unique in a deepEqual check

  return {
    unique: Symbol(),
  };
}

describe('Wnode', () => {
  it('with or without utils', () => {
    const wn1 = wnode // has utils by default
    const wn2 = wdoc() // no utils
    const wn3 = wdoc( wnodeUtils ) // same as wnode, but explicitly passed utils

    const n1 = wn1(o())
    const n2 = wn2(o())
    const n3 = wn3(o())

    assert('append' in n1)
    assert(!('append' in n2))
    assert('append' in n3)
  })

  it('unassociated object', () => {
    const a = o()
    const n = wnode(a)

    assert.equal(false, n.hasChildren)
    assert.equal(null, n.firstChild)
    assert.equal(null, n.lastChild)
    assert.equal(null, n.prev)
    assert.equal(null, n.next)
    assert.equal(null, n.parent)
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

  it('insertBefore', () => {
    const a = o()
    const b = o()
    const c = o()
    const d = o()

    const na = wnode(a)
    const nb = wnode(b)
    const nc = wnode(c)
    const nd = wnode(d)

    na.insertBefore(nb) // should just append

    assert.equal(1, na.childrenCount)
    assert.equal(nb, na.firstChild)

    na.insertBefore(nc, nb)

    assert.equal(2, na.childrenCount)
    assert.equal(nc, na.firstChild)
    assert.equal(nb, na.lastChild)

    assert.throws(() => {
      na.insertBefore(nb, nd) // nd is not a child of na
    })
  })

  it('insertAfter', () => {
    const a = o()
    const b = o()
    const c = o()
    const d = o()

    const na = wnode(a)
    const nb = wnode(b)
    const nc = wnode(c)
    const nd = wnode(d)

    na.insertAfter(nb) // should just append

    assert.equal(1, na.childrenCount)
    assert.equal(nb, na.firstChild)

    na.insertAfter(nc, nb)

    assert.equal(2, na.childrenCount)
    assert.equal(nb, na.firstChild)
    assert.equal(nc, na.lastChild)

    assert.throws(() => {
      na.insertAfter(nb, nd) // nd is not a child of na
    })
  })

  it('lastInclusiveDescendant', () => {
    const a = wnode(o())
    const aa = wnode(o())
    const ab = wnode(o())
    const aba = wnode(o())
    const abaa = wnode(o())

    a.appendChild(aa)
    a.appendChild(ab)
    ab.appendChild(aba)
    aba.appendChild(abaa)

    assert.equal(abaa, a.lastInclusiveDescendant())
    assert.equal(abaa, abaa.lastInclusiveDescendant())
  })

  it('look up preceding with a previous sibling', () => {
    const a = wnode(o());
    const b = wnode(o());

    a.insertAfter(b);

    assert.equal(null, a.preceding());
    assert.equal(a, b.preceding());
  });

  it('look up preceding with a previous sibling with a child', () => {
    const parent = wnode(o())
    const a = wnode(o())
    const aa = wnode(o())
    const ab = wnode(o())
    const b = wnode(o())

    parent.appendChild(a)
    a.appendChild(aa)
    a.appendChild(ab)
    parent.insertBefore(b, null)

    assert.equal(null, parent.preceding())
    assert.equal(parent, a.preceding())
    assert.equal(a, aa.preceding())
    assert.equal(aa, ab.preceding())
    assert.equal(ab, b.preceding())
  })

  it('look up preceding with a previous sibling with descendants', () => {
    const parent = wnode(o())
    const a = wnode(o())
    const aa = wnode(o())
    const ab = wnode(o())
    const aba = wnode(o())
    const abaa = wnode(o())
    const b = wnode(o())

    parent.appendChild(a)
    a.appendChild(aa)
    a.appendChild(ab)
    ab.appendChild(aba)
    aba.appendChild(abaa)
    parent.insertBefore(b, null)

    assert.equal(abaa, b.preceding())
  })

  it('look up preceding using a specified root', () => {
    const a = wnode(o())
    const aa = wnode(o())

    a.appendChild(aa)

    assert.equal(null, a.preceding({ root: a }))
    assert.equal(a, aa.preceding({ root: a }))
    assert.equal(null, aa.preceding({ root: aa }))
  })

  it('following with a child', () => {
    const a = wnode(o());
    const aa = wnode(o());

    a.appendChild(aa);

    assert.equal(aa, a.following());
    assert.equal(null, aa.following());
  });

  it('following with a nextSibling sibling', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());

    parent.appendChild(a);
    parent.insertBefore(b, null);

    assert.equal(b, a.following());
    assert.equal(null, b.following());
  });

  it('following with sibling of parent', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const aa = wnode(o());
    const b = wnode(o());

    parent.appendChild(a);
    a.appendChild(aa);
    parent.insertBefore(b, null);

    assert.equal(b, aa.following());
  });

  it('following with sibling of grandparent', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const aa = wnode(o());
    const aaa = wnode(o());
    const b = wnode(o());

    parent.appendChild(a);
    a.appendChild(aa);
    aa.appendChild(aaa);
    parent.insertBefore(b, null);

    assert.equal(b, aaa.following());
  });

  it('following using a specified root', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const aa = wnode(o());
    const aaa = wnode(o());
    const b = wnode(o());

    parent.appendChild(a);
    a.appendChild(aa);
    aa.appendChild(aaa);
    parent.insertBefore(b, null);

    assert.equal(null, aaa.following({ root: aaa }));
    assert.equal(null, aaa.following({ root: aa }));
    assert.equal(null, aaa.following({ root: a }));
    assert.equal(aa, a.following({ root: a }));
    assert.equal(aaa, aa.following({ root: a }));
  });

  it('following with skipChildren', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const aa = wnode(o());
    const b = wnode(o());

    parent.appendChild(a);
    a.appendChild(aa);
    parent.insertBefore(b, null);

    assert.equal(b, a.following({ skipChildren: true }));
  });
})

describe('wnodeUtils', () => {
  it('insert nodes after the current node', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());
    const d = wnode(o());

    parent.append(a);
    a.after(b, c, d);

    assert.equal(a.next, b);
    assert.equal(b.next, c);
    assert.equal(c.next, d);
  });

  it('throws an error if trying to insert after the root node', () => {
    const a = wnode(o());
    const b = wnode(o());

    assert.throws(() => a.after(b), Error, 'Cannot insert after root node');
  });


  it('append nodes as children to the current node', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());

    parent.append(a, b, c);

    assert.equal(parent.firstChild, a);
    assert.equal(a.next, b);
    assert.equal(b.next, c);
  });

  it('insert nodes before the current node', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());
    const d = wnode(o());

    parent.append(a);
    a.before(b, c, d);

    assert.equal(a.prev, d);
    assert.equal(d.prev, c);
    assert.equal(c.prev, b);
  });

  it('throws an error if trying to insert before the root node', () => {
    const a = wnode(o());
    const b = wnode(o());

    assert.throws(() => a.before(b), Error, 'Cannot insert before root node');
  });

  it('prepend nodes as children of the current node', () => {
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());
    const d = wnode(o());
    const e = wnode(o());

    a.appendChild(e)

    a.prepend(b, c, d);

    assert.equal(a.firstChild, b)
    assert.equal(b.next, c);
    assert.equal(c.next, d);
    assert.equal(d.next, e);
  });

  it('replace children of the current node with new nodes', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());

    parent.append(a);
    parent.replaceChildren(b, c);

    assert.equal(parent.firstChild, b);
    assert.equal(b.next, c);
    assert.equal(a.parent, null);
  });

  it('replace the current node with new nodes', () => {
    const parent = wnode(o());
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());

    parent.append(a);
    a.replaceWith(b, c);

    assert.equal(parent.firstChild, b);
    assert.equal(b.next, c);
    assert.equal(a.parent, null);
  });

  it('find the ancestor of the current node that matches a given selector', () => {
    const grandparent = wnode(o());
    const parent = wnode(o());
    const child = wnode(o());

    grandparent.append(parent);
    parent.append(child);

    const selector = (node) => node === parent;
    assert.equal(child.ancestor(selector), parent);
  });

  it('ancestor method returns null when selector does not match any ancestor', () => {
    const a = wnode(o());
    const b = wnode(o());
    const c = wnode(o());
    const d = wnode(o());

    a.appendChild(b);
    b.appendChild(c);
    c.appendChild(d);

    const selector = (n) => n.value === 'non-existent';

    assert.equal(d.ancestor(selector), null);
  });

  it('find method returns the first node matching the selector', () => {
    const a = wnode({ name: 'A' });
    const b = wnode({ name: 'B' });
    const c = wnode({ name: 'C' });
    const d = wnode({ name: 'D' });

    a.appendChild(b);
    b.appendChild(c);
    c.appendChild(d);

    const selector = (n) => n.value.name === 'C';

    assert.equal(a.find(selector), c);
  });

  it('all method returns all nodes matching the selector', () => {
    const a = wnode({ name: 'A' });
    const b = wnode({ name: 'B' });
    const c = wnode({ name: 'C' });
    const d = wnode({ name: 'D' });
    const e = wnode({ name: 'B' });

    a.appendChild(b);
    a.appendChild(c);
    b.appendChild(d);
    c.appendChild(e);

    const selector = (n) => n.value.name === 'B';

    const matchingNodes = [...a.all(selector)];

    assert.equal(matchingNodes.length, 2);
    assert.equal(matchingNodes[0], b);
    assert.equal(matchingNodes[1], e);
  });

  it('find method returns null when no nodes match the selector', () => {
    const a = wnode({ name: 'A' });
    const b = wnode({ name: 'B' });
    const c = wnode({ name: 'C' });
    const d = wnode({ name: 'D' });

    a.appendChild(b);
    b.appendChild(c);
    c.appendChild(d);

    const selector = (n) => n.value.name === 'E';

    assert.equal(a.find(selector), null);
  });

  it('matches method returns true when the node matches the selector', () => {
    const a = wnode({ name: 'A' });
    const selector = (n) => n.value.name === 'A';

    assert.equal(a.matches(selector), true);
  });

  it('matches method returns false when the node does not match the selector', () => {
    const a = wnode({ name: 'A' });
    const selector = (n) => n.value.name === 'B';

    assert.equal(a.matches(selector), false);
  });
})

describe('other utils', () => {
  it('serialize method correctly serializes the node structure', () => {
    const a = wnode({ name: 'A' });
    const b = wnode({ name: 'B' });
    const c = wnode({ name: 'C' });

    a.appendChild(b);
    b.appendChild(c);

    const expectedResult = [
      { name: 'A' },
      [{ name: 'B' }, [{ name: 'C' }]],
    ];

    assert.deepStrictEqual(serialize(a), expectedResult);
  });

  it('deserialize method correctly deserializes the node structure', () => {
    const serialized = [
      { name: 'A' },
      [{ name: 'B' }, [{ name: 'C' }]],
    ];

    const deserializedNode = deserialize()(serialized);

    assert.equal(deserializedNode.value.name, 'A');
    assert.equal(deserializedNode.firstChild!.value.name, 'B');
    assert.equal(deserializedNode.firstChild!.firstChild!.value.name, 'C');
  });

  it('serialize and deserialize methods work with value transformers', () => {
    const a = wnode({ name: 'A' });
    const b = wnode({ name: 'B' });
    const c = wnode({ name: 'C' });

    a.appendChild(b);
    b.appendChild(c);

    const valueTransformer = (value) => ({ ...value, transformed: true });

    const serialized = serialize(a, valueTransformer);
    const expectedResult = [
      { name: 'A', transformed: true },
      [{ name: 'B', transformed: true }, [{ name: 'C', transformed: true }]],
    ];

    assert.deepStrictEqual(serialized, expectedResult);

    const deserializedNode = deserialize()(serialized, valueTransformer);

    assert.deepStrictEqual(deserializedNode.value, { name: 'A', transformed: true });
    assert.deepStrictEqual(deserializedNode.firstChild!.value, { name: 'B', transformed: true });
    assert.deepStrictEqual(deserializedNode.firstChild!.firstChild!.value, { name: 'C', transformed: true });
  });

  it('isWnode correctly identifies Wnode instances', () => {
    const a = wnode({ name: 'A' });
    const nonWnode = { value: { name: 'Non-Wnode' } };
  
    assert.equal(isWnode(a), true);
    assert.equal(isWnode(nonWnode), false);
  });
})