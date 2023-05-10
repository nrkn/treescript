import { stree } from '../'
import * as assert from 'assert'
import { iterator } from '../lib/symbol-tree/iterator'

function o() {
  // return an object that is unique in a deepEqual check

  return {
    unique: Symbol(),
  };
}

describe('symbol-tree', () => {
  it('test case internal prerequisite', () => {
    const a = o();
    assert.notDeepEqual([o()], [o()]);
    assert.deepEqual([a], [a]);
  });

  it('initialize', () => {
    const tree = stree();
    const obj = { foo: 'bar' };

    assert.equal(obj, tree.initialize(obj));
    assert.deepEqual(['foo'], Object.getOwnPropertyNames(obj),
      'initialize() should not introduce any enumerable properties');
  });

  it('unassociated object', () => {
    const tree = stree();
    const a = o();

    assert.equal(false, tree.hasChildren(a));
    assert.equal(null, tree.firstChild(a));
    assert.equal(null, tree.lastChild(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(a));
    assert.equal(null, tree.parent(a));


  });

  it('insertBefore without parent or siblings', () => {
    const tree = stree();
    const a = o();
    const b = o();

    assert.equal(a, tree.insertBefore(b, a));

    assert.equal(false, tree.hasChildren(a));
    assert.equal(null, tree.firstChild(a));
    assert.equal(null, tree.lastChild(a));
    assert.equal(null, tree.parent(a));
    assert.equal(false, tree.hasChildren(b));
    assert.equal(null, tree.firstChild(b));
    assert.equal(null, tree.lastChild(b));
    assert.equal(null, tree.parent(b));

    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));


  });

  it('insertAfter without parent or siblings', () => {
    const tree = stree();
    const a = o();
    const b = o();

    assert.equal(b, tree.insertAfter(a, b));

    assert.equal(false, tree.hasChildren(a));
    assert.equal(null, tree.firstChild(a));
    assert.equal(null, tree.lastChild(a));
    assert.equal(null, tree.parent(a));
    assert.equal(false, tree.hasChildren(b));
    assert.equal(null, tree.firstChild(b));
    assert.equal(null, tree.lastChild(b));
    assert.equal(null, tree.parent(b));

    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));


  });

  it('prependChild without children', () => {
    const tree = stree();
    const parent = o();
    const a = o();

    assert.equal(a, tree.prependChild(parent, a));

    assert.equal(false, tree.hasChildren(a));
    assert.equal(null, tree.firstChild(a));
    assert.equal(null, tree.lastChild(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(a));
    assert.equal(parent, tree.parent(a));

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(a, tree.lastChild(parent));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(parent));
    assert.equal(null, tree.parent(parent));


  });

  it('appendChild without children', () => {
    const tree = stree();
    const parent = o();
    const a = o();

    assert.equal(a, tree.appendChild(parent, a));

    assert.equal(false, tree.hasChildren(a));
    assert.equal(null, tree.firstChild(a));
    assert.equal(null, tree.lastChild(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(a));
    assert.equal(parent, tree.parent(a));

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(a, tree.lastChild(parent));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(parent));
    assert.equal(null, tree.parent(parent));


  });

  it('prependChild with children', () => {
    const tree = stree();
    const parent = o();
    const a = o();
    const b = o();

    tree.prependChild(parent, b);
    tree.prependChild(parent, a);

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(b, tree.lastChild(parent));

    assert.equal(parent, tree.parent(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(parent, tree.parent(b));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));

  });

  it('appendChild with children', () => {
    const tree = stree();
    const parent = o();
    const a = o();
    const b = o();

    tree.appendChild(parent, a);
    tree.appendChild(parent, b);

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(b, tree.lastChild(parent));

    assert.equal(parent, tree.parent(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(parent, tree.parent(b));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));

  });

  it('insertBefore with parent', () => {
    const tree = stree();
    const parent = o();
    const a = o();
    const b = o();

    tree.prependChild(parent, b);
    tree.insertBefore(b, a);

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(b, tree.lastChild(parent));

    assert.equal(parent, tree.parent(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(parent, tree.parent(b));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));

  });

  it('insertAfter with parent', () => {
    const tree = stree();
    const parent = o();
    const a = o();
    const b = o();

    tree.appendChild(parent, a);
    tree.insertAfter(a, b);

    assert.equal(true, tree.hasChildren(parent));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(b, tree.lastChild(parent));

    assert.equal(parent, tree.parent(a));
    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(parent, tree.parent(b));
    assert.equal(a, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));

  });

  it('insertBefore with siblings', () => {
    const tree = stree();
    const a = o();
    const b = o();
    const c = o();

    tree.insertBefore(c, a);
    tree.insertBefore(c, b);

    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(a, tree.previousSibling(b));
    assert.equal(c, tree.nextSibling(b));

    assert.equal(b, tree.previousSibling(c));
    assert.equal(null, tree.nextSibling(c));


  });

  it('insertAfter with siblings', () => {
    const tree = stree();
    const a = o();
    const b = o();
    const c = o();

    tree.insertAfter(a, c);
    tree.insertAfter(a, b);

    assert.equal(null, tree.previousSibling(a));
    assert.equal(b, tree.nextSibling(a));

    assert.equal(a, tree.previousSibling(b));
    assert.equal(c, tree.nextSibling(b));

    assert.equal(b, tree.previousSibling(c));
    assert.equal(null, tree.nextSibling(c));


  });

  it('remove with previous sibling', () => {
    const tree = stree();
    const a = o();
    const b = o();

    tree.insertAfter(a, b);
    tree.remove(b);

    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(a));
    assert.equal(null, tree.parent(a));

    assert.equal(null, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));
    assert.equal(null, tree.parent(b));


  });

  it('remove with next sibling', () => {
    const tree = stree();
    const a = o();
    const b = o();

    tree.insertAfter(a, b);
    tree.remove(a);

    assert.equal(null, tree.previousSibling(a));
    assert.equal(null, tree.nextSibling(a));
    assert.equal(null, tree.parent(a));

    assert.equal(null, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));
    assert.equal(null, tree.parent(b));


  });

  it('remove with siblings', () => {
    const tree = stree();
    const a = o();
    const b = o();
    const c = o();

    tree.insertAfter(a, b);
    tree.insertAfter(b, c);
    tree.remove(b);

    assert.equal(null, tree.previousSibling(a));
    assert.equal(c, tree.nextSibling(a));
    assert.equal(null, tree.parent(a));

    assert.equal(null, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));
    assert.equal(null, tree.parent(b));

    assert.equal(a, tree.previousSibling(c));
    assert.equal(null, tree.nextSibling(c));
    assert.equal(null, tree.parent(c));


  });

  it('remove with parent', () => {
    const tree = stree();
    const parent = o();
    const a = o();

    tree.prependChild(parent, a);
    tree.remove(a);

    assert.equal(null, tree.parent(a));
    assert.equal(null, tree.firstChild(parent));
    assert.equal(null, tree.lastChild(parent));


  });

  it('remove with children', () => {
    const tree = stree();
    const parent = o();
    const a = o();

    tree.prependChild(parent, a);
    tree.remove(parent);

    assert.equal(parent, tree.parent(a));
    assert.equal(a, tree.firstChild(parent));
    assert.equal(a, tree.lastChild(parent));


  });

  it('remove with parent and siblings', () => {
    const tree = stree();
    const parent = o();
    const a = o();
    const b = o();
    const c = o();

    tree.prependChild(parent, a);
    tree.insertAfter(a, b);
    tree.insertAfter(b, c);
    tree.remove(b);

    assert.equal(a, tree.firstChild(parent));
    assert.equal(c, tree.lastChild(parent));

    assert.equal(null, tree.previousSibling(a));
    assert.equal(c, tree.nextSibling(a));
    assert.equal(parent, tree.parent(a));

    assert.equal(null, tree.previousSibling(b));
    assert.equal(null, tree.nextSibling(b));
    assert.equal(null, tree.parent(b));

    assert.equal(a, tree.previousSibling(c));
    assert.equal(null, tree.nextSibling(c));
    assert.equal(parent, tree.parent(c));


  });

  it('inserting an already associated object should fail', () => {
    const tree = stree();
    const a = o();
    const b = o();

    tree.insertBefore(b, a);

    // jscs:disable requireBlocksOnNewline

    // `nextSibling` check
    assert.throws(() => { tree.insertBefore(b, a); }, /already present/);
    assert.throws(() => { tree.insertAfter(b, a); }, /already present/);
    assert.throws(() => { tree.prependChild(b, a); }, /already present/);
    assert.throws(() => { tree.appendChild(b, a); }, /already present/);

    // `previousSibling` check
    assert.throws(() => { tree.insertBefore(a, b); }, /already present/);
    assert.throws(() => { tree.insertAfter(a, b); }, /already present/);
    assert.throws(() => { tree.prependChild(a, b); }, /already present/);
    assert.throws(() => { tree.appendChild(a, b); }, /already present/);

    tree.remove(a);

    tree.prependChild(b, a);
    // `parent` check
    assert.throws(() => { tree.insertBefore(b, a); }, /already present/);
    assert.throws(() => { tree.insertAfter(b, a); }, /already present/);
    assert.throws(() => { tree.prependChild(b, a); }, /already present/);
    assert.throws(() => { tree.appendChild(b, a); }, /already present/);

    // jscs:enable requireBlocksOnNewline


  });

  it('Multiple SymbolTree instances should not conflict', () => {
    const tree1 = stree();
    const tree2 = stree();
    const a = o();
    const b = o();

    tree1.insertBefore(b, a);
    tree2.insertBefore(a, b);

    assert.equal(null, tree1.previousSibling(a));
    assert.equal(b, tree1.nextSibling(a));
    assert.equal(a, tree1.previousSibling(b));
    assert.equal(null, tree1.nextSibling(b));

    assert.equal(null, tree2.previousSibling(b));
    assert.equal(a, tree2.nextSibling(b));
    assert.equal(b, tree2.previousSibling(a));
    assert.equal(null, tree2.nextSibling(a));


  });

  it('lastInclusiveDescendant', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    assert.equal(abaa, tree.lastInclusiveDescendant(a));


  });

  it('look up preceding with a previous sibling', () => {
    const tree = stree();
    const a = o();
    const b = o();

    tree.insertAfter(a, b);

    assert.equal(null, tree.preceding(a));
    assert.equal(a, tree.preceding(b));


  });

  it('look up preceding with a previous sibling with a child', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.insertAfter(a, b);

    assert.equal(null, tree.preceding(a));
    assert.equal(a, tree.preceding(aa));
    assert.equal(aa, tree.preceding(ab));
    assert.equal(ab, tree.preceding(b));


  });

  it('look up preceding with a previous sibling with a descendants', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    assert.equal(abaa, tree.preceding(b));


  });

  it('look up preceding using a specified root', () => {
    const tree = stree();
    const a = o();
    const aa = o();

    tree.appendChild(a, aa);

    assert.equal(null, tree.preceding(a, { root: a }));
    assert.equal(a, tree.preceding(aa, { root: a }));
    assert.equal(null, tree.preceding(aa, { root: aa }));


  });

  it('following with a child', () => {
    const tree = stree();
    const a = o();
    const aa = o();

    tree.appendChild(a, aa);

    assert.equal(aa, tree.following(a));
    assert.equal(null, tree.following(aa));


  });

  it('following with a nextSibling sibling', () => {
    const tree = stree();
    const a = o();
    const b = o();

    tree.insertAfter(a, b);

    assert.equal(b, tree.following(a));
    assert.equal(null, tree.following(b));


  });

  it('following with sibling of parent', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.insertAfter(a, b);

    assert.equal(b, tree.following(aa));


  });

  it('following with sibling of grandparent', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const aaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(aa, aaa);
    tree.insertAfter(a, b);

    assert.equal(b, tree.following(aaa));


  });

  it('following using a specified root', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const aaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(aa, aaa);
    tree.insertAfter(a, b);

    assert.equal(null, tree.following(aaa, { root: aaa }));
    assert.equal(null, tree.following(aaa, { root: aa }));
    assert.equal(null, tree.following(aaa, { root: a }));
    assert.equal(aa, tree.following(a, { root: a }));
    assert.equal(aaa, tree.following(aa, { root: a }));


  });

  it('following with skipChildren', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.insertAfter(a, b);

    assert.equal(b, tree.following(a, { skipChildren: true }));


  });

  it('childrenToArray', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    assert.deepEqual([aa, ab, ac], tree.childrenToArray(a));

    const arr = ['a', 5];
    tree.childrenToArray(a, { array: arr });
    assert.deepEqual(['a', 5, aa, ab, ac], arr);


  });

  it('childrenToArray with filter', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    const filter = function (this: { filter: (object: any) => boolean; }, object) {
      assert.equal(this, undefined);

      return object !== ab;
    };

    assert.deepEqual([aa, ac], tree.childrenToArray(a, { filter: filter }));

    const thisArg = { a: 123 };
    const filterThis = function (this: { filter: (object: any) => boolean; thisArg: { a: number; }; }, object) {
      assert.equal(this, thisArg);

      return object !== ab;
    };

    assert.deepEqual([aa, ac], tree.childrenToArray(a, { filter: filterThis, thisArg: thisArg }));


  });

  it('children iterator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    const results: any[] = [];

    for (const object of tree.childrenIterator(a)) {
      results.push(object);
    }
    assert.deepEqual([aa, ab, ac], results);


  });

  it('children iterator reverse', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    const results: any[] = [];

    for (const object of tree.childrenIterator(a, { reverse: true })) {
      results.push(object);
    }
    assert.deepEqual([ac, ab, aa], results);


  });

  it('children iterator return value using a generator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const ac = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(a, ac);

    function* generator(it: IterableIterator<{}>) {
      const returnValue = yield* it;
      assert.equal(a, returnValue);
    }

    const results: any[] = [];

    for (const object of generator(tree.childrenIterator(a))) {
      results.push(object);
    }
    assert.deepEqual([aa, ab, ac], results);


  });

  it('previous sibling iterator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const ad = o();
    const ae = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.appendChild(a, ad);
    tree.appendChild(a, ae);
    tree.insertAfter(a, b);

    const results: any[] = [];

    for (const object of tree.previousSiblingsIterator(ad)) {
      results.push(object);
    }
    assert.deepEqual([ac, ab, aa], results);


  });

  it('nextSibling sibling iterator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const ad = o();
    const ae = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.appendChild(a, ad);
    tree.appendChild(a, ae);
    tree.insertAfter(a, b);

    const results: any[] = [];

    for (const object of tree.nextSiblingsIterator(ab)) {
      results.push(object);
    }
    assert.deepEqual([ac, ad, ae], results);


  });

  it('ancestorsToArray', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    assert.deepEqual([abaa, aba, ab, a], tree.ancestorsToArray(abaa));
    assert.deepEqual([aba, ab, a], tree.ancestorsToArray(aba));
    assert.deepEqual([b], tree.ancestorsToArray(b));

    const arr = ['a', 5];
    tree.ancestorsToArray(abaa, { array: arr });
    assert.deepEqual(['a', 5, abaa, aba, ab, a], arr);


  });

  it('ancestorsToArray with filter', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    const thisArg = { foo: 'bar' };
    const filter = function (this: { filter: (object: any) => boolean; thisArg: { foo: string; }; }, object) {
      assert.equal(this, thisArg);

      return object !== abaa && object !== ab;
    };

    assert.deepEqual([aba, a], tree.ancestorsToArray(abaa, { filter: filter, thisArg: thisArg }));


  });

  it('ancestors iterator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    const results: any[] = [];
    const iterator = tree.ancestorsIterator(abaa);

    for (const object of iterator) {
      results.push(object);
    }
    assert.deepEqual([abaa, aba, ab, a], results);
    assert.deepEqual({ done: true, value: abaa }, iterator.next());
    assert.deepEqual({ done: true, value: abaa }, iterator.next()); // should keep returning done: true


  });

  it('treeToArray', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    assert.deepEqual([a, aa, ab, aba, abaa], tree.treeToArray(a));

    const arr = ['a', 5];
    tree.treeToArray(a, { array: arr });
    assert.deepEqual(['a', 5, a, aa, ab, aba, abaa], arr);


  });

  it('treeToArray with filter', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.insertAfter(a, b);

    const filter = function (this: { filter: (object: any) => boolean; }, object) {
      assert.equal(this, undefined);

      return object !== a && object !== aba;
    };

    assert.deepEqual([aa, ab, abaa], tree.treeToArray(a, { filter: filter }));

    const thisArg = { foo: 'bar' };
    const filterThis = function (this: { filter: (object: any) => boolean; thisArg: { foo: string; }; }, object) {
      assert.equal(this, thisArg);

      return object !== a && object !== aba;
    };

    assert.deepEqual([aa, ab, abaa], tree.treeToArray(a, { filter: filterThis, thisArg: thisArg }));


  });

  it('tree iterator', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    const results: any[] = [];
    const iterator = tree.treeIterator(a);

    for (const object of iterator) {
      results.push(object);
    }
    assert.deepEqual([a, aa, ab, aba, abaa, ac], results);
    assert.deepEqual({ done: true, value: a }, iterator.next());
    assert.deepEqual({ done: true, value: a }, iterator.next()); // should keep returning done: true


  });

  it('tree iterator reverse', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    const results: any[] = [];
    const iterator = tree.treeIterator(a, { reverse: true });

    for (const object of iterator) {
      results.push(object);
    }
    assert.deepEqual([ac, abaa, aba, ab, aa, a], results);
    assert.deepEqual({ done: true, value: a }, iterator.next());
    assert.deepEqual({ done: true, value: a }, iterator.next()); // should keep returning done: true


  });

  it( 'bad iterateFunction', () => {
    const tree = stree()
    const a = o()
    const aa = o()

    tree.appendChild(a, aa)

    assert.throws( () => {
      const it = iterator( tree, a, aa, 100 )
      it.next()
    })
  })

  it('look up the index of an object', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    assert.equal(-1, tree.index(a), 'should return -1 if an object has no parent');
    assert.equal(0, tree.index(aa));
    assert.equal(1, tree.index(ab));
    assert.equal(0, tree.index(aba));
    assert.equal(2, tree.index(ac));
    assert.equal(-1, tree.index(b));


  });

  it('cached index', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    // looking up ac, will also set the cached index for aa and ab, so check that those are valid
    assert.equal(2, tree.index(ac));
    assert.equal(1, tree.index(ab));
    assert.equal(0, tree.index(aa));

    // removing something should invalidate the cache
    tree.remove(ab);
    assert.equal(1, tree.index(ac));
    assert.equal(-1, tree.index(ab));
    assert.equal(0, tree.index(aa));

    // insertAfter should invalidate
    tree.insertAfter(aa, ab);
    assert.equal(0, tree.index(aa));
    assert.equal(1, tree.index(ab));
    assert.equal(2, tree.index(ac));

    // insertBefore should invalidate
    const foo = o();
    tree.insertBefore(ab, foo);
    assert.equal(0, tree.index(aa));
    assert.equal(2, tree.index(ab));
    assert.equal(3, tree.index(ac));


  });

  it('cached index warmed up by childrenToArray', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    tree.childrenToArray(a);
    assert.equal(0, tree.index(aa));
    assert.equal(1, tree.index(ab));
    assert.equal(2, tree.index(ac));

    tree.appendChild(a, o());
    assert.equal(2, tree.index(ac));
    tree.childrenToArray(a);
    assert.equal(2, tree.index(ac));


  });

  it('regression test: remove() should invalidate the child index cache', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const b = o();
    const ba = o();
    const bb = o();

    tree.appendChild(a, aa);
    tree.appendChild(b, ba);
    tree.appendChild(b, bb);

    assert.equal(0, tree.index(ba));
    tree.remove(ba);
    assert.equal(-1, tree.index(ba));
    tree.appendChild(a, ba);
    assert.equal(1, tree.index(ba));


  });

  it('children count', () => {
    // no need to test the caching since we already tested for that in childrenCount
    const tree = stree();
    const a = o();
    const aa = o();
    const ab = o();
    const aba = o();
    const ac = o();
    const b = o();

    tree.appendChild(a, aa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(a, ac);
    tree.insertAfter(a, b);

    assert.equal(3, tree.childrenCount(a), 'foo');
    assert.equal(0, tree.childrenCount(aa));
    assert.equal(1, tree.childrenCount(ab));
    assert.equal(0, tree.childrenCount(b));


  });


  it('compare tree position', () => {
    const tree = stree();
    const a = o();
    const aa = o();
    const aaa = o();
    const ab = o();
    const aba = o();
    const abaa = o();
    const ac = o();

    const b = o();
    const ba = o();

    tree.appendChild(a, aa);
    tree.appendChild(aa, aaa);
    tree.appendChild(a, ab);
    tree.appendChild(ab, aba);
    tree.appendChild(aba, abaa);
    tree.appendChild(a, ac);

    tree.insertAfter(a, b);
    tree.appendChild(b, ba);

    assert.equal(0, tree.compareTreePosition(a, a), 'object equal');

    assert.equal(1, tree.compareTreePosition(a, o()), 'object disconnected');
    assert.equal(1, tree.compareTreePosition(a, b), 'object disconnected');

    assert.equal(20, tree.compareTreePosition(a, aa), 'contained by & following');
    assert.equal(10, tree.compareTreePosition(aa, a), 'contains & preceding');
    assert.equal(20, tree.compareTreePosition(a, abaa), 'contained by & following');
    assert.equal(10, tree.compareTreePosition(abaa, a), 'contains & preceding');

    assert.equal(4, tree.compareTreePosition(aa, ab), 'following');
    assert.equal(2, tree.compareTreePosition(ab, aa), 'preceding');
    assert.equal(4, tree.compareTreePosition(aa, aba), 'following');
    assert.equal(2, tree.compareTreePosition(aba, aa), 'preceding');
    assert.equal(4, tree.compareTreePosition(aa, abaa), 'following');
    assert.equal(2, tree.compareTreePosition(abaa, aa), 'preceding');
    assert.equal(4, tree.compareTreePosition(aaa, abaa), 'following');
    assert.equal(2, tree.compareTreePosition(abaa, aaa), 'preceding');


  });

})
