import { _Node, Sfollowing, Spreceding } from '../types';
export declare const sincdesc: <T extends {}>(_node: _Node<T>) => {
    lastInclusiveDescendant: (value: T) => T;
    preceding: Spreceding<T>;
    following: Sfollowing<T>;
};
