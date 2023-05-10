"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.T = void 0;
const utils_1 = require("../wnode/utils");
const T = (createNode) => (initial, ...args) => {
    const node = createNode(initial);
    for (const arg of args) {
        if ((0, utils_1.isWnode)(arg)) {
            node.appendChild(arg);
        }
        else {
            Object.assign(initial, arg);
        }
    }
    return node;
};
exports.T = T;
//# sourceMappingURL=index.js.map