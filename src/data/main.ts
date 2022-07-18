import { getTime, getTimePassed } from '../util/util';
import { createLayer } from '../util/layers';
import { getSave, loadSave } from '../main/saving';
import { steam } from './steam';
import { notifications } from './notifications';
import { reactive } from 'vue';
import type { UpgradeType } from '../compose/upgrades';

export const main = createLayer(() => {
  const id = 'main';
  const internals = reactive({
    timestamp: getTime(),
    rafID: 0,
    fps: 0,
    save: '',
    lastSaveTimer: getTime(),
  });
  const settings = reactive({
    displayFPS: false,
    maxFPS: 60,
    saveInterval: 10000,
  });
  function getData(layer: number) {
    switch (layer) {
      case 1:
        return steam;
      default:
        console.error('invalid layer: ' + layer);
    }
  }
  function buyUpgrade(data: { name: string; layer: number; oneTime: boolean }) {
    const layer = getData(data.layer);
    if (layer === undefined) {
      console.error('Invalid data.layer: ' + data.layer);
    } else if (!data.oneTime) {
      //upg.upgrades[data.name].buy();
      console.error('No multi-buy steam upgrades');
    } else {
      const upg = (
        layer.oneUpgrades as Record<string, UpgradeType | undefined>
      )[data.name];
      if (upg !== undefined) {
        upg.buy();
      } else {
        console.warn(`could not find upgrade ${data.name} in ${layer.id}`);
      }
    }
  }
  function updateGame(delta: number) {
    steam.update(delta);
  }
  function updateExternal(timepassed: number) {
    internals.fps = 1 / timepassed;
    internals.timestamp = getTime();
    updateSaveGameTick();
    notifications.updateNotifications();
  }
  function updateSaveGameTick() {
    if (getTime() - internals.lastSaveTimer > settings.saveInterval) {
      saveGame();
      internals.lastSaveTimer = getTime();
    }
  }
  function saveGame() {
    localStorage.setItem('sgsave', getSave());
    notifications.notify('Game saved.');
  }
  function loadGame() {
    const save = internals.save || localStorage.getItem('sgsave') || '';
    if (!save) return;
    loadSave(save);
  }
  function hardReset() {
    Object.values(layers).forEach((layer) => {
      layer.$reset();
    });
  }
  function mainGameLoop() {
    const timepassed = getTimePassed(internals.timestamp);
    if (timepassed > 1 / settings.maxFPS) {
      updateGame(timepassed);
      updateExternal(timepassed);
    }
    internals.rafID = requestAnimationFrame(() => {
      mainGameLoop();
    });
  }
  function toJSON() {
    return {
      settings,
    };
  }
  return {
    internals,
    settings,
    mainGameLoop,
    id,
    loadGame,
    buyUpgrade,
    toJSON,
    hardReset,
  };
});
function getData<T extends { id: string }>(layers: T[]) {
  const obj: Record<string, T> = {};
  layers.forEach((item) => {
    obj[item.id] = item;
  });
  return obj;
}

export const layers = getData([steam, main]);
