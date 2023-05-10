"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sindex = void 0;
const const_1 = require("../const");
const util_1 = require("../util");
const sindex = (_node, parent) => {
    const index = (child) => {
        const childNode = _node(child);
        const parentNode = _node(childNode === null || childNode === void 0 ? void 0 : childNode.parent);
        if (!parentNode)
            return -1;
        let currentIndex = childNode === null || childNode === void 0 ? void 0 : childNode.getCachedIndex(parentNode);
        if (currentIndex >= 0)
            return currentIndex;
        currentIndex = 0;
        let object = parentNode.firstChild;
        if (parentNode.childIndexCachedUpTo) {
            const cachedUpToNode = _node(parentNode === null || parentNode === void 0 ? void 0 : parentNode.childIndexCachedUpTo);
            object = cachedUpToNode === null || cachedUpToNode === void 0 ? void 0 : cachedUpToNode.nextSibling;
            currentIndex = cachedUpToNode.getCachedIndex(parentNode) + 1;
        }
        while (object) {
            const node = _node(object);
            node.setCachedIndex(parentNode, currentIndex);
            if (object === child) {
                break;
            }
            ++currentIndex;
            object = node.nextSibling;
        }
        parentNode.childIndexCachedUpTo = child;
        return currentIndex;
    };
    const childrenCount = (parent) => {
        const parentNode = _node(parent);
        if (!(parentNode === null || parentNode === void 0 ? void 0 : parentNode.lastChild)) {
            return 0;
        }
        return index(parentNode.lastChild) + 1;
    };
    const compareTreePosition = (left, right) => {
        if (left === right)
            return 0;
        const leftAncestors = [];
        {
            let leftAncestor = left;
            while (leftAncestor) {
                if (leftAncestor === right) {
                    return const_1.C_CONTAINS | const_1.C_PRECEDING;
                }
                leftAncestors.push(leftAncestor);
                leftAncestor = parent(leftAncestor);
            }
        }
        const rightAncestors = [];
        {
            let rightAncestor = right;
            while (rightAncestor) {
                if (rightAncestor === left) {
                    return const_1.C_CONTAINED_BY | const_1.C_FOLLOWING;
                }
                rightAncestors.push(rightAncestor);
                rightAncestor = parent(rightAncestor);
            }
        }
        const root = (0, util_1.reverseArrayIndex)(leftAncestors, 0);
        if (!root || root !== (0, util_1.reverseArrayIndex)(rightAncestors, 0)) {
            return const_1.C_DISCONNECTED;
        }
        let commonAncestorIndex = 0;
        const ancestorsMinLength = Math.min(leftAncestors.length, rightAncestors.length);
        for (let i = 0; i < ancestorsMinLength; ++i) {
            const leftAncestor = (0, util_1.reverseArrayIndex)(leftAncestors, i);
            const rightAncestor = (0, util_1.reverseArrayIndex)(rightAncestors, i);
            if (leftAncestor !== rightAncestor)
                break;
            commonAncestorIndex = i;
        }
        const leftIndex = index((0, util_1.reverseArrayIndex)(leftAncestors, commonAncestorIndex + 1));
        const rightIndex = index((0, util_1.reverseArrayIndex)(rightAncestors, commonAncestorIndex + 1));
        return rightIndex < leftIndex
            ? const_1.C_PRECEDING
            : const_1.C_FOLLOWING;
    };
    return {
        index, childrenCount, compareTreePosition
    };
};
exports.sindex = sindex;
//# sourceMappingURL=indexing.js.map