"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iterator = void 0;
const const_1 = require("./const");
const iterator = (tree, root, firstResult, iterateFunction) => {
    const next = () => {
        var _a, _b, _c;
        const tree = it[const_1.A_TREE];
        const root = it[const_1.A_ROOT];
        const iterateFunction = it[const_1.A_ITERATE_FN];
        if (it[const_1.A_NEXT] === null)
            return { done: true, value: root };
        const value = it[const_1.A_NEXT];
        if (iterateFunction === const_1.I_PREV) {
            it[const_1.A_NEXT] = (_a = tree._node(value)) === null || _a === void 0 ? void 0 : _a.previousSibling;
        }
        else if (iterateFunction === const_1.I_NEXT) {
            it[const_1.A_NEXT] = (_b = tree._node(value)) === null || _b === void 0 ? void 0 : _b.nextSibling;
        }
        else if (iterateFunction === const_1.I_PARENT) {
            it[const_1.A_NEXT] = (_c = tree._node(value)) === null || _c === void 0 ? void 0 : _c.parent;
        }
        else if (iterateFunction === const_1.I_PRECEDING) {
            it[const_1.A_NEXT] = tree.preceding(value, { root });
        }
        else if (iterateFunction === const_1.I_FOLLOWING) {
            it[const_1.A_NEXT] = tree.following(value, { root });
        }
        return { done: false, value };
    };
    const it = {
        next,
        [Symbol.iterator]: () => it
    };
    it[const_1.A_TREE] = tree;
    it[const_1.A_ROOT] = root;
    it[const_1.A_NEXT] = firstResult;
    it[const_1.A_ITERATE_FN] = iterateFunction;
    return it;
};
exports.iterator = iterator;
//# sourceMappingURL=iterator.js.map