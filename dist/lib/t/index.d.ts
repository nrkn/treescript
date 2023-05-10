import { Wnode } from '../wnode/types';
export type TArg<T> = Wnode | Partial<T>;
export declare const T: (createNode: <N>(value: N) => Wnode<N>) => <T extends {}>(initial: T, ...args: TArg<T>[]) => Wnode<T>;
