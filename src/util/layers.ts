import { iterateObject, getOrSetCustom } from './util';
import { isObjectTP } from './types';
import { ComputedKey } from '../compose/reactive';
import type {
  BasicType,
  KeyType,
  GenericObjectType,
  UniqueComputed,
} from '../types/types';
import { isRef, toRaw } from 'vue';
import { getStringKey } from '../main/saving';

export function createLayer<T extends object>(func: () => T) {
  const data = func() as T & { $reset: () => void };
  const paths: [KeyType, BasicType][] = [];
  function getPaths<T>(obj: object | T[] = data, initkeys: KeyType = []) {
    iterateObject(
      obj as GenericObjectType,
      (keys: KeyType, value: BasicType) => {
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
          //debugger;
          getPaths(value, keys);
        }
      },
      initkeys
    );
  }
  getPaths();
  data.$reset = () => {
    paths.forEach((path) => {
      getOrSetCustom(
        data as GenericObjectType,
        path[0].reduce((p, c) => p + getStringKey(c), '').toString(),
        false,
        path[1]
      );
    });
  };
  return data;
}
