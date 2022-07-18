import type { KeyType, ArrayOrObj, AllValues } from '../types/types';
import { ComputedKey } from '../compose/reactive';
import { isObjectTP } from './types';
import { isRef, unref } from 'vue';
// number display
export function displayNumber(what: number, prec = 2, overide = false) {
  // if number is interger, display it as whole
  if (Number.isInteger(what)) {
    return what.toString();
  } else if (what < 1e9) {
    if (what > 1e3) {
      return what.toLocaleString('en-US');
    } else if (Number.isInteger(what * 10) && !overide) {
      return what.toFixed(1);
    }
    return what.toFixed(prec);
  }
  return what.toExponential(prec);
}

// time utils
export function getTime() {
  return Date.now();
}
export function getTimePassed(time: number) {
  return (getTime() - time) / 1000;
}

// time formatting
export function formatTime(data: number) {
  const hours = Math.floor(data / 3600);
  const minutes = Math.floor((data % 3600) / 60);
  const seconds = parseFloat(((data % 3600) % 60).toFixed(2));
  function format(time: number, name: string, comma = true) {
    return time > 0
      ? time + ' ' + name + (time > 1 ? 's' : '') + (comma ? ',' : '')
      : '';
  }
  return [
    format(hours, 'hour'),
    format(minutes, 'minute'),
    format(seconds, 'second', false),
  ].join(' ');
}
// util functions
type Result<T, O> = T extends undefined ? O : T;
export function R<T, O>(item: T, replacer: O) {
  return (item !== undefined ? item : replacer) as Result<T, O>;
}
export function iterateObject<T>(
  arg: ArrayOrObj<T>,
  cb: (path: KeyType, data: T) => void,
  keys: KeyType = []
) {
  if (Array.isArray(arg)) {
    arg.forEach((item, ind) => {
      cb([...keys, ind], item);
    });
  } else {
    Object.entries(arg).forEach((item) => {
      cb([...keys, item[0]], item[1]);
    });
  }
}
export function getAllProperties<T>(
  data: ArrayOrObj<T>,
  func: (keys: KeyType, value: AllValues<T>) => void,
  keys: KeyType = []
) {
  iterateObject(
    data,
    (keys, val) => {
      if (isObjectTP(val) && !isRef(val)) {
        getAllProperties(val as any, func, keys);
      } else if (
        val === undefined ||
        val === null ||
        !((val as any)[ComputedKey] === true)
      ) {
        func(keys, unref(val) as AllValues<T>);
      }
    },
    keys
  );
}
export function getPropStr<T extends object>(obj: T, desc: string): T {
  let arr = desc.split('.').filter((i) => i.length > 0);
  let newObj: any = obj;
  while (arr.length) {
    const key = arr.shift();
    if (key === undefined) throw new TypeError('Key ' + key + ' is invalid.');
    newObj = newObj[key];
  }
  return newObj;
}
export function setPropStr<T extends object>(
  obj: T,
  desc: string,
  value: unknown
) {
  let arr = desc.split('.').filter((i) => i.length > 0);
  let newObj: any = obj;
  while (arr.length > 1) {
    const key = arr.shift();
    if (key === undefined) throw new TypeError('Key ' + key + ' is invalid.');
    newObj = newObj[key];
  }
  newObj[arr[0]] = value;
}
