"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wdoc = void 0;
const tree_1 = require("../symbol-tree/tree");
const const_1 = require("./const");
const wdoc = (utils) => {
    const tree = (0, tree_1.stree)();
    const wnode = (value) => {
        const node = {
            get value() {
                return value;
            },
            get children() {
                return tree.childrenIterator(node);
            },
            get ancestors() {
                return tree.ancestorsIterator(node);
            },
            get descendants() {
                return tree.treeIterator(node);
            },
            get previousSiblings() {
                return tree.previousSiblingsIterator(node);
            },
            get nextSiblings() {
                return tree.nextSiblingsIterator(node);
            },
            get parent() {
                return tree.parent(node);
            },
            get prev() {
                return tree.previousSibling(node);
            },
            get next() {
                return tree.nextSibling(node);
            },
            get firstChild() {
                return tree.firstChild(node);
            },
            get lastChild() {
                return tree.lastChild(node);
            },
            get isAttached() {
                return tree._node(node).isAttached;
            },
            get hasChildren() {
                return tree.hasChildren(node);
            },
            get index() {
                return tree.index(node);
            },
            get childrenCount() {
                return tree.childrenCount(node);
            },
            remove() {
                return tree.remove(node);
            },
            insertBefore(newNode, referenceNode) {
                if (referenceNode === null) {
                    return node.appendChild(newNode);
                }
                assertReferenceHasParent(referenceNode, node);
                return tree.insertBefore(referenceNode, newNode);
            },
            insertAfter(newNode, referenceNode) {
                if (referenceNode === null) {
                    return node.prependChild(newNode);
                }
                assertReferenceHasParent(referenceNode, node);
                return tree.insertAfter(referenceNode, newNode);
            },
            prependChild(newNode) {
                return tree.prependChild(node, newNode);
            },
            appendChild(newNode) {
                return tree.appendChild(node, newNode);
            },
            compareTreePosition(otherNode) {
                return tree.compareTreePosition(node, otherNode);
            },
            lastInclusiveDescendant() {
                return tree.lastInclusiveDescendant(node);
            },
            preceding(options) {
                const precedingNode = tree.preceding(node, options);
                return precedingNode;
            },
            following(options) {
                const followingNode = tree.following(node, options);
                return followingNode;
            }
        };
        tree.initialize(node);
        if (typeof utils === 'function') {
            Object.assign(node, utils(node));
        }
        node[const_1.wsymbol] = true;
        return node;
    };
    return wnode;
};
exports.wdoc = wdoc;
const assertReferenceHasParent = (referenceNode, parentNode) => {
    if (referenceNode.parent !== parentNode) {
        throw Error('referenceNode is not a child of node');
    }
};
//# sourceMappingURL=index.js.map