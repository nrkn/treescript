"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = exports.serialize = exports.isWnode = exports.allIterator = exports.wnodeUtils = void 0;
const _1 = require(".");
const const_1 = require("./const");
const wnodeUtils = (node) => {
    const utils = {
        after(...nodes) {
            for (const n of nodes) {
                node.insertAfter(n, node);
            }
        },
        append(...nodes) {
            for (const n of nodes) {
                node.appendChild(n);
            }
        },
        before(...nodes) {
            for (const n of nodes) {
                node.insertBefore(n, node);
            }
        },
        prepend(...nodes) {
            for (const n of nodes) {
                node.prependChild(n);
            }
        },
        replaceChildren(...nodes) {
            while (node.firstChild) {
                node.firstChild.remove();
            }
            utils.append(...nodes);
        },
        replaceWith(...nodes) {
            utils.before(...nodes);
            node.remove();
        },
        ancestor(selector) {
            let n = node;
            while (n) {
                if (selector(n)) {
                    return n;
                }
                n = n.parent;
            }
            return null;
        },
        find(selector) {
            for (const n of node.descendants) {
                if (selector(n)) {
                    return n;
                }
            }
            return null;
        },
        all(selector) {
            return (0, exports.allIterator)(node.descendants, selector);
        },
        matches(selector) {
            return selector(node);
        }
    };
    return utils;
};
exports.wnodeUtils = wnodeUtils;
const allIterator = function* (it, selector) {
    for (const node of it) {
        if (selector(node)) {
            yield node;
        }
    }
};
exports.allIterator = allIterator;
const isWnode = (value) => value && value[const_1.wsymbol];
exports.isWnode = isWnode;
const serialize = (node, valueTransformer) => {
    const result = [
        valueTransformer ? valueTransformer(node.value) : node.value,
    ];
    for (const child of node.children) {
        result.push((0, exports.serialize)(child, valueTransformer));
    }
    return result;
};
exports.serialize = serialize;
const deserialize = (create = (0, _1.wdoc)(exports.wnodeUtils)) => (value, valueTransformer) => {
    const node = create(valueTransformer ? valueTransformer(value[0]) : value[0]);
    for (const child of value.slice(1)) {
        node.appendChild((0, exports.deserialize)(create)(child, valueTransformer));
    }
    return node;
};
exports.deserialize = deserialize;
//# sourceMappingURL=utils.js.map