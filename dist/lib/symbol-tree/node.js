"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snode = void 0;
const snode = () => {
    const node = {
        parent: null,
        previousSibling: null,
        nextSibling: null,
        firstChild: null,
        lastChild: null,
        childIndexCachedUpTo: null,
        childrenVersion: 0,
        cachedIndex: -1,
        cachedIndexVersion: NaN,
        get isAttached() {
            return Boolean(node.parent || node.previousSibling || node.nextSibling);
        },
        get hasChildren() {
            return node.firstChild !== null;
        },
        childrenChanged() {
            node.childrenVersion = (node.childrenVersion + 1) & 0xFFFFFFFF;
            node.childIndexCachedUpTo = null;
        },
        getCachedIndex(parentNode) {
            if (node.cachedIndexVersion !== parentNode.childrenVersion) {
                node.cachedIndexVersion = NaN;
                return -1;
            }
            return node.cachedIndex;
        },
        setCachedIndex(parentNode, index) {
            node.cachedIndexVersion = parentNode.childrenVersion;
            node.cachedIndex = index;
        }
    };
    return node;
};
exports.snode = snode;
//# sourceMappingURL=node.js.map