import { computed as _computed, ref as _ref } from 'vue';
import type { UniqueComputed, UniqueRef } from '../types/types';

export const ComputedKey = Symbol('Computed');

/**
 * overides default computed function for determining if it is computed or not
 */
export function computed<T>(func: () => T) {
  const val = _computed(func) as UniqueComputed<T>;
  val[ComputedKey] = true;
  val.toJSON = () => {
    return undefined;
  };
  return val;
}
/**
 * overides default ref function for json.stringify
 */
export function ref<T>(data: T) {
  const val = _ref(data) as unknown as UniqueRef<T>;
  val.toJSON = () => {
    return {
      value: val.value,
    };
  };
  return val;
}
