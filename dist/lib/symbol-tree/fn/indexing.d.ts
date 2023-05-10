import { Squery, _Node } from '../types';
export declare const sindex: <T extends {}>(_node: _Node<T>, parent: Squery<T>) => {
    index: (child: T) => number;
    childrenCount: (parent: T) => number;
    compareTreePosition: (left: T, right: T) => number;
};
