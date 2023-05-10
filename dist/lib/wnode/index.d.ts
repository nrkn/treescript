import { WutilFactory } from './types';
export declare const wdoc: <U = {}>(utils?: WutilFactory<U> | undefined) => <T>(value: T) => Readonly<import("./types").WnodeProps<T>> & import("./types").WnodeMethods & U;
