import { _Node } from '../types';
export declare const smanipulation: <T extends {}>(_node: _Node<T>) => {
    remove: (value: T) => T;
    insertBefore: (reference: T, newChild: T) => T;
    insertAfter: (reference: T, newChild: T) => T;
    prependChild: (reference: T, newChild: T) => T;
    appendChild: (reference: T, newChild: T) => T;
};
