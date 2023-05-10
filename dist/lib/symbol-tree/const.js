"use strict";
// compare consts
Object.defineProperty(exports, "__esModule", { value: true });
exports.NEXIST = exports.A_ITERATE_FN = exports.A_NEXT = exports.A_ROOT = exports.A_TREE = exports.I_FOLLOWING = exports.I_PRECEDING = exports.I_PARENT = exports.I_NEXT = exports.I_PREV = exports.C_CONTAINED_BY = exports.C_CONTAINS = exports.C_FOLLOWING = exports.C_PRECEDING = exports.C_DISCONNECTED = void 0;
exports.C_DISCONNECTED = 1;
exports.C_PRECEDING = 2;
exports.C_FOLLOWING = 4;
exports.C_CONTAINS = 8;
exports.C_CONTAINED_BY = 16;
// iterator function consts
exports.I_PREV = 1;
exports.I_NEXT = 2;
exports.I_PARENT = 3;
exports.I_PRECEDING = 4;
exports.I_FOLLOWING = 5;
// iterator arg symbols
exports.A_TREE = Symbol();
exports.A_ROOT = Symbol();
exports.A_NEXT = Symbol();
exports.A_ITERATE_FN = Symbol();
// errors etc
exports.NEXIST = 'Given object already present in tree, remove it first';
//# sourceMappingURL=const.js.map