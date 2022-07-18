export type KeyType = (string | number)[];

type Count = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export type ArrayOrObj<T> = T[] | Record<string, T>;
export type AllValues<T, D extends Count[number] = 9> = [D] extends [never]
  ? never
  : T extends object
  ? AllValues<T[keyof T], Count[D]>
  : T;
