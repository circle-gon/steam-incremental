function isOfType<T>(test: T, prop: keyof T): test is T {
  return test[prop] !== undefined;
}
function isObject(obj: unknown, notarray = false): boolean {
  return (
    obj !== null &&
    typeof obj === "object" &&
    (notarray ? !Array.isArray(obj) : true)
  );
}
function isObjectTP(obj: unknown, notarray = false): obj is object {
  return isObject(obj, notarray);
}
function isNumber(thing: string | number): thing is number {
  return Number.isInteger(thing);
}
export { isOfType, isObjectTP, isObject, isNumber };
