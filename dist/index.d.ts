import { TArg } from './lib/t';
export { serialize, deserialize, wnodeUtils } from './lib/wnode/utils';
export { wdoc } from './lib/wnode';
export { T, TArg } from './lib/t';
export { stree } from './lib/symbol-tree/tree';
export declare const wnode: <T>(value: T) => Readonly<import("./lib/wnode/types").WnodeProps<T>> & import("./lib/wnode/types").WnodeMethods & import("./lib/wnode/types").WnodeUtils;
export declare const t: <T extends {}>(initial: T, ...args: TArg<T>[]) => import("./lib/wnode/types").Wnode<T>;
export declare const ne: (...args: TArg<any>[]) => import("./lib/wnode/types").Wnode<any>;
export declare const tOf: <T extends {}>(createDefault: () => T) => (...args: TArg<T>[]) => import("./lib/wnode/types").Wnode<T>;
