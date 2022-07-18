import { iterateObject, setPropStr } from './util';
import { isObjectTP } from './types';
import { ComputedKey } from '../compose/reactive';
import type { UniqueComputed } from '../compose/reactive';
import type { KeyType, AllValues, ArrayOrObj } from '../types/types';
import { isRef, toRaw } from 'vue';
import { getStringKey } from '../main/saving';

export function createLayer<T extends object>(func: () => T) {
  const data = func() as T & { $reset: () => void };
  const paths: [KeyType, AllValues<T>][] = [];
  function getPaths<S>(obj: ArrayOrObj<S>, initkeys: KeyType = []) {
    iterateObject(
      obj,
      (keys: KeyType, value: AllValues<T>) => {
        //console.log(value);
        if (
          value === undefined ||
          value === null ||
          typeof value === 'function' ||
          (value as UniqueComputed<object>)[ComputedKey] === true
        )
          return;
        if (isRef(value)) {
          paths.push([[...keys, 'value'], value.value]);
        } else if (Object.keys(value).length === 0) {
          paths.push([keys, structuredClone(toRaw(value))]);
        } else if (isObjectTP(value)) {
          getPaths(value, keys);
        }
      },
      initkeys
    );
  }
  getPaths(data);
  data.$reset = () => {
    paths.forEach((path) => {
      setPropStr(
        data,
        path[0].reduce((p, c) => p + getStringKey(c), '').toString(),
        path[1]
      );
    });
  };
  return data;
}
