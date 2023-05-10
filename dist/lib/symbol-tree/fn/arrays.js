"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sarrays = void 0;
const util_1 = require("../util");
const sarrays = (_node, following) => {
    const childrenToArray = (parent, { array = [], filter = util_1._true, thisArg } = {}) => {
        const parentNode = _node(parent);
        let object = parentNode === null || parentNode === void 0 ? void 0 : parentNode.firstChild;
        let index = 0;
        while (object) {
            const node = _node(object);
            node.setCachedIndex(parentNode, index);
            if (filter.call(thisArg, object)) {
                array.push(object);
            }
            object = node.nextSibling;
            ++index;
        }
        return array;
    };
    const ancestorsToArray = (value, { array = [], filter = util_1._true, thisArg } = {}) => {
        var _a;
        let current = value;
        while (current) {
            if (filter.call(thisArg, current)) {
                array.push(current);
            }
            current = (_a = _node(current)) === null || _a === void 0 ? void 0 : _a.parent;
        }
        return array;
    };
    const treeToArray = (root, { array = [], filter = util_1._true, thisArg } = {}) => {
        let object = root;
        while (object) {
            if (filter.call(thisArg, object)) {
                array.push(object);
            }
            object = following(object, { root });
        }
        return array;
    };
    return {
        childrenToArray, ancestorsToArray, treeToArray
    };
};
exports.sarrays = sarrays;
//# sourceMappingURL=arrays.js.map