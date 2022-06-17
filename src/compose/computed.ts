import { computed as _computed } from "vue";
import type { UniqueComputed } from "../types/types";

export const ComputedKey = Symbol("Computed");

/**
 * overides default computed function for determining if it is computed or not
 */
export function computed<T>(func: () => T) {
  const val = _computed(func) as UniqueComputed<T>;
  val[ComputedKey] = true;
  return val;
}
