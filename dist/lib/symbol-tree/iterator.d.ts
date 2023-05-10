import { Siteration } from './types';
export declare const iterator: <T extends {}>(tree: Siteration<T>, root: T, firstResult: T | null, iterateFunction: number) => IterableIterator<T>;
