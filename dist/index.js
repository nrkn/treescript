"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tOf = exports.ne = exports.t = exports.wnode = exports.stree = exports.T = exports.wdoc = exports.wnodeUtils = exports.deserialize = exports.serialize = void 0;
const wnode_1 = require("./lib/wnode");
const utils_1 = require("./lib/wnode/utils");
const t_1 = require("./lib/t");
var utils_2 = require("./lib/wnode/utils");
Object.defineProperty(exports, "serialize", { enumerable: true, get: function () { return utils_2.serialize; } });
Object.defineProperty(exports, "deserialize", { enumerable: true, get: function () { return utils_2.deserialize; } });
Object.defineProperty(exports, "wnodeUtils", { enumerable: true, get: function () { return utils_2.wnodeUtils; } });
var wnode_2 = require("./lib/wnode");
Object.defineProperty(exports, "wdoc", { enumerable: true, get: function () { return wnode_2.wdoc; } });
var t_2 = require("./lib/t");
Object.defineProperty(exports, "T", { enumerable: true, get: function () { return t_2.T; } });
var tree_1 = require("./lib/symbol-tree/tree");
Object.defineProperty(exports, "stree", { enumerable: true, get: function () { return tree_1.stree; } });
exports.wnode = (0, wnode_1.wdoc)(utils_1.wnodeUtils);
exports.t = (0, t_1.T)(exports.wnode);
const ne = (...args) => (0, exports.t)({}, ...args);
exports.ne = ne;
const tOf = (createDefault) => (...args) => (0, exports.t)(createDefault(), ...args);
exports.tOf = tOf;
//# sourceMappingURL=index.js.map