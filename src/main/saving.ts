import { layers } from "../data/main";
import type { GenericObjectType, Primitive, KeyType } from "../types/types";
import { getAllProperties, getOrSetCustom } from "../util/util";
import {isNumber} from '../util/types'
import { isRef } from "vue";
import LZString from "lz-string";
import { notifications } from "../data/main";

function getProperType(isNum: boolean) {
  return isNum ? [] : {};
}
function getStringKey(key: string | number) {
  const nT = isNumber(key);
  return nT ? `[${key}]` : `.${key}`;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function excludeFromOutput(keys: KeyType, value: Primitive): boolean {
  return keys.includes("internals");
}
function getObject() {
  const wantdata: GenericObjectType = {};
  for (const data of Object.values(layers)) {
    getAllProperties(
      data,
      (keys: KeyType, value: Primitive) => {
        if (typeof value === "function") return;
        if (excludeFromOutput(keys, value)) return;
        keys.forEach((key, ind) => {
          const accessKey = keys
            .slice(0, ind + 1)
            .reduce((p, c) => p + getStringKey(c), "")
            .toString();
          if (getOrSetCustom(wantdata, accessKey, true) === undefined) {
            const set =
              ind < keys.length - 1
                ? getProperType(isNumber(keys[ind + 1]))
                : value;
            getOrSetCustom(wantdata, accessKey, false, set);
          }
        });
      },
      [data.id]
    );
  }
  return wantdata;
}
function importObject(save: GenericObjectType) {
  getAllProperties(save, (keys: KeyType, value: Primitive) => {
    let accessKey = "";
    keys.forEach((key, ind) => {
      accessKey += getStringKey(key);
      const isLast = ind >= keys.length - 1;
      const val = getOrSetCustom(layers as GenericObjectType, accessKey, true);
      if (val === undefined || isLast) {
        const shouldRef = isRef(val);
        const set = !isLast ? getProperType(isNumber(keys[ind + 1])) : value;
        getOrSetCustom(
          layers as GenericObjectType,
          accessKey + (shouldRef ? ".value" : ""),
          false,
          set
        );
      }
    });
  });
}
function getSave() {
  return LZString.compressToBase64(JSON.stringify(getObject()));
}
function decodeSave(save: string) {
  try {
    return JSON.parse(LZString.decompressFromBase64(save) || "");
  } catch (e) {
    notifications.notify("An error occured while loading your save.");
    return {};
  }
}
function loadSave(save: string) {
  importObject(decodeSave(save));
}
export { getSave, loadSave, getStringKey };
