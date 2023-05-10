"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stree = void 0;
const const_1 = require("./const");
const iterator_1 = require("./iterator");
const _node_1 = require("./fn/_node");
const manipulation_1 = require("./fn/manipulation");
const indexing_1 = require("./fn/indexing");
const inclusive_descent_1 = require("./fn/inclusive-descent");
const arrays_1 = require("./fn/arrays");
const query_1 = require("./fn/query");
const stree = (description) => {
    const _node = (0, _node_1.s_node)(description);
    const initialize = (value) => {
        _node(value);
        return value;
    };
    const { hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent } = (0, query_1.squery)(_node);
    const { remove, insertBefore, insertAfter, prependChild, appendChild } = (0, manipulation_1.smanipulation)(_node);
    const { index, childrenCount, compareTreePosition } = (0, indexing_1.sindex)(_node, parent);
    const { lastInclusiveDescendant, preceding, following } = (0, inclusive_descent_1.sincdesc)(_node);
    const { childrenToArray, ancestorsToArray, treeToArray } = (0, arrays_1.sarrays)(_node, following);
    const sit = { _node, preceding, following };
    const childrenIterator = (parent, { reverse = false } = {}) => {
        const parentNode = _node(parent);
        return (0, iterator_1.iterator)(sit, parent, reverse ? parentNode === null || parentNode === void 0 ? void 0 : parentNode.lastChild : parentNode === null || parentNode === void 0 ? void 0 : parentNode.firstChild, reverse ? const_1.I_PREV : const_1.I_NEXT);
    };
    const previousSiblingsIterator = (value) => {
        var _a;
        return (0, iterator_1.iterator)(sit, value, (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.previousSibling, const_1.I_PREV);
    };
    const nextSiblingsIterator = (value) => {
        var _a;
        return (0, iterator_1.iterator)(sit, value, (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.nextSibling, const_1.I_NEXT);
    };
    const ancestorsIterator = (value) => {
        return (0, iterator_1.iterator)(sit, value, value, const_1.I_PARENT);
    };
    const treeIterator = (root, { reverse = false } = {}) => {
        return (0, iterator_1.iterator)(sit, root, reverse ? lastInclusiveDescendant(root) : root, reverse ? const_1.I_PRECEDING : const_1.I_FOLLOWING);
    };
    const tree = {
        _node, initialize,
        hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent,
        remove, insertBefore, insertAfter, prependChild, appendChild,
        index, childrenCount, compareTreePosition,
        lastInclusiveDescendant, preceding, following,
        childrenToArray, ancestorsToArray, treeToArray,
        childrenIterator, previousSiblingsIterator, nextSiblingsIterator,
        ancestorsIterator, treeIterator
    };
    return tree;
};
exports.stree = stree;
//# sourceMappingURL=tree.js.map