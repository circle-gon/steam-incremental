export function isOfType<T>(test: T, prop: keyof T): test is T {
  return test[prop] !== undefined;
}
export function isObject(obj: unknown, notarray = false) {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    (notarray ? !Array.isArray(obj) : true)
  );
}
export function isObjectTP(obj: unknown, notarray = false): obj is object {
  return isObject(obj, notarray);
}
export function isNumber(thing: unknown): thing is number {
  return Number.isInteger(thing);
}
