"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sincdesc = void 0;
const sincdesc = (_node) => {
    const lastInclusiveDescendant = (value) => {
        var _a;
        let last;
        let current = value;
        while (last = (_a = _node(current)) === null || _a === void 0 ? void 0 : _a.lastChild)
            current = last;
        return current;
    };
    const preceding = (value, { root } = {}) => {
        var _a, _b;
        if (value === root)
            return null;
        const previousSibling = (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.previousSibling;
        if (previousSibling) {
            return lastInclusiveDescendant(previousSibling);
        }
        return (_b = _node(value)) === null || _b === void 0 ? void 0 : _b.parent;
    };
    const following = (value, { root, skipChildren } = {}) => {
        var _a, _b, _c;
        const firstChild = !skipChildren && ((_a = _node(value)) === null || _a === void 0 ? void 0 : _a.firstChild);
        if (firstChild)
            return firstChild;
        let current = value;
        do {
            if (current === root)
                return null;
            const nextSibling = (_b = _node(current)) === null || _b === void 0 ? void 0 : _b.nextSibling;
            if (nextSibling) {
                return nextSibling;
            }
            current = (_c = _node(current)) === null || _c === void 0 ? void 0 : _c.parent;
        } while (current);
        return null;
    };
    return {
        lastInclusiveDescendant, preceding, following
    };
};
exports.sincdesc = sincdesc;
//# sourceMappingURL=inclusive-descent.js.map