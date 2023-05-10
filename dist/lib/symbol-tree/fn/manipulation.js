"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smanipulation = void 0;
const const_1 = require("../const");
const smanipulation = (_node) => {
    const remove = (value) => {
        const removeNode = _node(value);
        const parentNode = _node(removeNode.parent);
        const prevNode = _node(removeNode.previousSibling);
        const nextNode = _node(removeNode.nextSibling);
        if (parentNode) {
            if (parentNode.firstChild === value) {
                parentNode.firstChild = removeNode.nextSibling;
            }
            if (parentNode.lastChild === value) {
                parentNode.lastChild = removeNode.previousSibling;
            }
        }
        if (prevNode) {
            prevNode.nextSibling = removeNode.nextSibling;
        }
        if (nextNode) {
            nextNode.previousSibling = removeNode.previousSibling;
        }
        removeNode.parent = null;
        removeNode.previousSibling = null;
        removeNode.nextSibling = null;
        removeNode.cachedIndex = -1;
        removeNode.cachedIndexVersion = NaN;
        if (parentNode) {
            parentNode.childrenChanged();
        }
        return value;
    };
    const insertBefore = (reference, newChild) => {
        const referenceNode = _node(reference);
        const prevNode = _node(referenceNode.previousSibling);
        const newNode = _node(newChild);
        const parentNode = _node(referenceNode.parent);
        if (newNode.isAttached) {
            throw Error(const_1.NEXIST);
        }
        newNode.parent = referenceNode.parent;
        newNode.previousSibling = referenceNode.previousSibling;
        newNode.nextSibling = reference;
        referenceNode.previousSibling = newChild;
        if (prevNode) {
            prevNode.nextSibling = newChild;
        }
        if (parentNode && parentNode.firstChild === reference) {
            parentNode.firstChild = newChild;
        }
        if (parentNode) {
            parentNode.childrenChanged();
        }
        return newChild;
    };
    const insertAfter = (reference, newChild) => {
        const referenceNode = _node(reference);
        const nextNode = _node(referenceNode.nextSibling);
        const newNode = _node(newChild);
        const parentNode = _node(referenceNode.parent);
        if (newNode.isAttached) {
            throw Error(const_1.NEXIST);
        }
        newNode.parent = referenceNode.parent;
        newNode.previousSibling = reference;
        newNode.nextSibling = referenceNode.nextSibling;
        referenceNode.nextSibling = newChild;
        if (nextNode) {
            nextNode.previousSibling = newChild;
        }
        if (parentNode && parentNode.lastChild === reference) {
            parentNode.lastChild = newChild;
        }
        if (parentNode) {
            parentNode.childrenChanged();
        }
        return newChild;
    };
    const prependChild = (reference, newChild) => {
        const referenceNode = _node(reference);
        const newNode = _node(newChild);
        if (newNode.isAttached) {
            throw Error(const_1.NEXIST);
        }
        if (referenceNode.hasChildren) {
            insertBefore(referenceNode.firstChild, newChild);
        }
        else {
            newNode.parent = reference;
            referenceNode.firstChild = newChild;
            referenceNode.lastChild = newChild;
            referenceNode.childrenChanged();
        }
        return newChild;
    };
    const appendChild = (reference, newChild) => {
        const referenceNode = _node(reference);
        const newNode = _node(newChild);
        if (newNode.isAttached) {
            throw Error(const_1.NEXIST);
        }
        if (referenceNode.hasChildren) {
            insertAfter(referenceNode.lastChild, newChild);
        }
        else {
            newNode.parent = reference;
            referenceNode.firstChild = newChild;
            referenceNode.lastChild = newChild;
            referenceNode.childrenChanged();
        }
        return newChild;
    };
    return {
        remove, insertBefore, insertAfter, prependChild, appendChild
    };
};
exports.smanipulation = smanipulation;
//# sourceMappingURL=manipulation.js.map