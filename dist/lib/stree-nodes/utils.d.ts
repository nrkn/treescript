import { Wnode, WnodeSelector, WnodeUtils, WutilFactory } from './types';
export declare const basicUtils: WutilFactory<WnodeUtils>;
export declare const allIterator: (it: IterableIterator<Wnode>, selector: WnodeSelector) => IterableIterator<Wnode>;
export declare const isWnode: (value: any) => value is Wnode<any>;
export declare const serialize: (node: Wnode, valueTransformer?: ((value: any) => any) | undefined) => any;
export declare const deserialize: (create?: <T>(value: T) => Readonly<import("./types").WnodeProps<T>> & import("./types").WnodeMethods & WnodeUtils) => (value: any[], valueTransformer?: ((value: any) => any) | undefined) => Wnode;
