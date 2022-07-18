import { layers } from '../data/main';
import { getAllProperties, getPropStr, setPropStr } from '../util/util';
import { isNumber } from '../util/types';
import type { ArrayOrObj } from '../types/types';
import LZString from 'lz-string';
import { notifications } from '../data/notifications';

export function getStringKey(key: string | number) {
  const nT = isNumber(key);
  return nT ? `[${key}]` : `.${key}`;
}
function getObject() {
  const wantdata: { [key: string]: typeof layers[keyof typeof layers] } = {};
  for (const data of Object.values(layers)) {
    wantdata[data.id] = data;
  }
  return wantdata;
}
function importObject<T>(save: ArrayOrObj<T>) {
  getAllProperties(save, (keys, value) => {
    let accessKey = '';
    keys.forEach((key, ind) => {
      accessKey += getStringKey(key);
      const isLast = ind >= keys.length - 1;
      const val = getPropStr(layers, accessKey);
      if (val === undefined || isLast) {
        const set = !isLast ? (isNumber(keys[ind + 1]) ? [] : {}) : value;
        setPropStr(layers, accessKey, set);
      }
    });
  });
}
export function getSave() {
  return LZString.compressToBase64(JSON.stringify(getObject()));
}
function decodeSave(save: string) {
  try {
    return JSON.parse(LZString.decompressFromBase64(save) || '');
  } catch (e) {
    notifications.notify('An error occured while loading your save.');
    return {};
  }
}
export function loadSave(save: string) {
  importObject(decodeSave(save));
}
