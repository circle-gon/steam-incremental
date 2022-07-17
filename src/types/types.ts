import type { Ref, ComputedRef } from 'vue';

// unexported types

// generic types
type KeyType = (string | number)[];

type Primitive =
  | string
  | number
  | boolean
  | undefined
  | null
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function;
type Count = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type BasicType =
  | Primitive
  | Ref<Primitive>
  | { [key: string]: BasicType }
  | BasicType[];
interface WrapObject<T> {
  [key: string]: T;
}
type ArrayOrObj<T> = T[] | Record<string, T>;
type AllValues<T, D extends Count[number] = 9> = [D] extends [never]
  ? never
  : T extends object
  ? AllValues<T[keyof T], Count[D]>
  : T;
type GenericObjectType = WrapObject<BasicType>;
export type {
  // prevent ts-prune from erroring the isTypeSupported below
  // generic types
  KeyType,
  Primitive,
  BasicType,
  ArrayOrObj,
  AllValues,
  WrapObject,
};
