import { wdoc } from './lib/wnode'
import { wnodeExtra } from './lib/wnode/utils'
import { T, TArg } from './lib/t'
import { WnodeExtra } from './lib/wnode/types'

export { serialize, deserialize, wnodeExtra } from './lib/wnode/utils'
export { wdoc } from './lib/wnode'
export { T, TArg } from './lib/t'
export { stree } from './lib/symbol-tree/tree'

export const wnode = wdoc(wnodeExtra)

export const t = T(wnode)

export const ne = (...args: TArg<any,WnodeExtra>[]) => t({}, ...args)

export const tOf = <T extends {}>(createDefault: () => T) =>
  (...args: TArg<T,WnodeExtra>[]) => t(createDefault(), ...args)
