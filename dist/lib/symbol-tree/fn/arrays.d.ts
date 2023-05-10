import { Sarray, Sfollowing, _Node } from '../types';
export declare const sarrays: <T extends {}>(_node: _Node<T>, following: Sfollowing<T>) => {
    childrenToArray: Sarray<T>;
    ancestorsToArray: Sarray<T>;
    treeToArray: Sarray<T>;
};
