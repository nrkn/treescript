"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const clubs = (0, _1.t)({ type: 'clubs' }, (0, _1.t)({ type: 'club', name: 'star gazers' }, (0, _1.t)('alex sun'), (0, _1.t)('nick moon')), (0, _1.t)({ type: 'club', name: 'wildlife watchers' }, (0, _1.t)('quinn bird'), (0, _1.t)('blake bear')));
const clubsData = (0, _1.serialize)(clubs, value => {
    if (typeof value === 'string') {
        return { type: 'person', name: value };
    }
    return value;
});
console.log(JSON.stringify(clubsData, null, 2));
const roundTripped = (0, _1.deserialize)()(clubsData, value => {
    if (value.type === 'person') {
        return value.name;
    }
    return value;
});
console.log(JSON.stringify((0, _1.serialize)(roundTripped), null, 2));
//# sourceMappingURL=sandbox.js.map