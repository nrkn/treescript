export const _true = () => true

export const reverseArrayIndex = <T>(array: T[], reverseIndex: number) =>
  array[array.length - 1 - reverseIndex]
