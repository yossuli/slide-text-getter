export const inspect =
  <T>(fn?: (mes: T) => any) =>
  (elm: T, i: number, arr: T[]) =>
    ((i === 0 && console.log(...arr.map((e) => fn?.(e) ?? e))) ?? elm) || elm
