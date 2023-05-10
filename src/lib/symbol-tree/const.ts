// compare consts

export const C_DISCONNECTED = 1
export const C_PRECEDING = 2
export const C_FOLLOWING = 4
export const C_CONTAINS = 8
export const C_CONTAINED_BY = 16

// iterator function consts

export const I_PREV = 1
export const I_NEXT = 2
export const I_PARENT = 3
export const I_PRECEDING = 4
export const I_FOLLOWING = 5

// iterator arg symbols

export const A_TREE = Symbol()
export const A_ROOT = Symbol()
export const A_NEXT = Symbol()
export const A_ITERATE_FN = Symbol()

// errors etc

export const NEXIST = 'Given object already present in tree, remove it first'
