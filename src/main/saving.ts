import { layers } from '../data/main';
import type { GenericObjectType } from '../types/types';
import { getAllProperties, getOrSetCustom } from '../util/util';
import { isNumber } from '../util/types';
import LZString from 'lz-string';
import { notifications } from '../data/main';

function getProperType(isNum: boolean) {
  return isNum ? [] : {};
}
function getStringKey(key: string | number) {
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
function importObject(save: GenericObjectType) {
  getAllProperties(save, (keys, value) => {
    let accessKey = '';
    keys.forEach((key, ind) => {
      accessKey += getStringKey(key);
      const isLast = ind >= keys.length - 1;
      const val = getOrSetCustom(layers as GenericObjectType, accessKey, true);
      if (val === undefined || isLast) {
        const set = !isLast ? getProperType(isNumber(keys[ind + 1])) : value;
        getOrSetCustom(layers as GenericObjectType, accessKey, false, set);
      }
    });
  });
}
function getSave() {
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
function loadSave(save: string) {
  importObject(decodeSave(save));
}
export { getSave, loadSave, getStringKey };
