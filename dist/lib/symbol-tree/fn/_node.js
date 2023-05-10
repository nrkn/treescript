"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s_node = void 0;
const node_1 = require("../node");
const s_node = (description) => {
    const symbol = Symbol(description || 'stree');
    const _node = value => {
        if (value === undefined || value === null)
            return null;
        const node = value[symbol];
        if (node !== undefined)
            return node;
        return (value[symbol] = (0, node_1.snode)());
    };
    return _node;
};
exports.s_node = s_node;
//# sourceMappingURL=_node.js.map