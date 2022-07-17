import { createLayer } from '../util/layers';
import { isOfType } from '../util/types';
import type { ResourceQueueType } from '../compose/resource';
import { computed } from '../compose/reactive';
import { Upgrade } from '../compose/upgrades';
import { drainingResource } from '../compose/resource';

function baseConfig() {
  return { layer: 1 } as const;
}
function oneTimeUpg() {
  return {
    ...baseConfig(),
    maxLevel: 1,
  };
}
export type SteamResourceType = 'heat' | 'water' | 'fill';
export const steam = createLayer(() => {
  const id = 'steam';
  const steam = drainingResource();
  const water = drainingResource({
    req: Number.MAX_VALUE,
    owned: 10,
  }) as ResourceQueueType;
  const fill = drainingResource({
    req: 1,
    sideEffect(diff: number) {
      water.owned.value -= diff;
    },
    canDo: computed(() => water.owned.value > 0),
    computeDiff(diff: number) {
      return Math.min(diff, water.owned.value);
    },
  }) as ResourceQueueType;
  const heat = drainingResource({
    req: 1,
  }) as ResourceQueueType;
  const oneUpgrades = {
    stronger: Upgrade(
      'Getting stronger!',
      'Multiplies speed of all resources by 2',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (level: number) => 1,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (level: number) => 1,
      computed(() => true),
      oneTimeUpg()
    ),
  };
  const drainRes = computed(() => {
    return {
      water,
      heat,
      fill,
    };
  });
  const isDoing = computed(() => {
    const isDoingAttr = [];
    for (const value of Object.values(drainRes.value)) {
      if (isOfType<ResourceQueueType>(value, 'queueData')) {
        isDoingAttr.push(value.isEmpty(false));
      }
    }
    return isDoingAttr.includes(false);
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateResources(delta: number) {
    for (const value of Object.values(drainRes.value)) {
      if (isOfType<ResourceQueueType>(value, 'queueData')) {
        value.update();
      }
    }
  }
  function isUseable(innerRes: SteamResourceType) {
    const res = drainRes.value[innerRes];
    return !isDoing.value && res.isEmpty() && res.queueData.canDo.value;
  }
  function getResource(res: SteamResourceType) {
    const value = drainRes.value[res];
    const doubleMulti = oneUpgrades.stronger.hasBought.value
      ? oneUpgrades.stronger.currentEffect.value + 1
      : 1;
    if (isUseable(res)) {
      value.addNewQueue(value.multi.value * doubleMulti);
    }
  }
  function updateFurnace() {
    if (
      fill.owned.value >= fill.queueData.req.value &&
      heat.owned.value >= heat.queueData.req.value
    ) {
      fill.owned.value -= fill.queueData.req.value;
      heat.owned.value -= heat.queueData.req.value;
      steam.owned.value += steam.multi.value;
    }
  }
  function update(delta: number) {
    //this.updateMulti();
    updateResources(delta);
    updateFurnace();
  }
  function toJSON() {
    return {
      steam,
      water,
      fill,
      heat,
      oneUpgrades,
    };
  }
  return {
    id,
    steam,
    water,
    heat,
    fill,
    isUseable,
    getResource,
    update,
    oneUpgrades,
    toJSON,
  };
});
window.steam = steam;
