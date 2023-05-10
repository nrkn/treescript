import { _Node } from '../types';
export declare const squery: <T extends {}>(_node: _Node<T>) => {
    hasChildren: (value: T) => boolean;
    firstChild: (value: T) => T | null;
    lastChild: (value: T) => T | null;
    previousSibling: (value: T) => T | null;
    nextSibling: (value: T) => T | null;
    parent: (value: T) => T | null;
};
