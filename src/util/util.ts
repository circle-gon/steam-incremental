import type {
  GenericObjectType,
  KeyType,
  BasicType,
  ArrayOrObj,
  AllValues,
} from '../types/types';
import { ComputedKey } from '../compose/reactive';
import { isObjectTP } from './types';
import { isRef, unref } from 'vue';
// number display
const displayNumber = function (what: number, prec = 2, overide = false) {
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
};

// time utils
const getTime = function () {
  return Date.now();
};
function getTimePassed(time: number) {
  return (getTime() - time) / 1000;
}

// time formatting
const formatTime = function (data: number) {
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
};
// util functions
type Result<T, O> = T extends undefined ? O : T;
function R<T, O>(item: T, replacer: O): Result<T, O> {
  return (item !== undefined ? item : replacer) as Result<T, O>;
}
function iterateObject<T>(
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
function getAllProperties<T>(
  data: ArrayOrObj<T>,
  func: (keys: KeyType, value: AllValues<T>) => void,
  keys: KeyType = []
) {
  iterateObject(
    data,
    (keys, val) => {
      if (isObjectTP(val) && !isRef(val)) {
        getAllProperties(val as { [key: string]: any }, func, keys);
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
function getOrSetCustom(
  data: GenericObjectType,
  key: string,
  get: boolean,
  val?: BasicType
) {
  return Function(
    'data',
    'value',
    (get ? 'return ' : '') + 'data' + key + (!get ? '=value' : '')
  )(data, val);
}
// prevent ts-prune from erroring the functions below
export {
  // ts-prune-ignore-next
  displayNumber,
  // ts-prune-ignore-next
  formatTime,
  getTime,
  R,
  iterateObject,
  getTimePassed,
  getAllProperties,
  getOrSetCustom,
};
