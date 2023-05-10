"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.squery = void 0;
const squery = (_node) => {
    const hasChildren = (value) => { var _a; return !!((_a = _node(value)) === null || _a === void 0 ? void 0 : _a.hasChildren); };
    const firstChild = (value) => { var _a; return (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.firstChild; };
    const lastChild = (value) => { var _a; return (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.lastChild; };
    const previousSibling = (value) => { var _a; return (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.previousSibling; };
    const nextSibling = (value) => { var _a; return (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.nextSibling; };
    const parent = (value) => { var _a; return (_a = _node(value)) === null || _a === void 0 ? void 0 : _a.parent; };
    return {
        hasChildren, firstChild, lastChild, previousSibling, nextSibling, parent
    };
};
exports.squery = squery;
//# sourceMappingURL=query.js.map