import type {
  ConfigType,
  CoreConfigType,
  UniqueComputed,
  UpgradeType,
} from '../types/types';
import { ref } from 'vue';
import type { Ref } from 'vue';
import { R } from '../util/util';
import { computed } from './computed';
import { steam } from '../data/steam';

const baseConfig: CoreConfigType = { layer: Infinity };
export function Upgrade(
  name: string,
  desc: string,
  getPrice: (level: number) => number,
  getEffect: (level: number) => number,
  isUnlocked: UniqueComputed<boolean>,
  config: ConfigType = baseConfig
): UpgradeType {
  const level = ref(0);
  const layer = config.layer;
  const maxLevel = ref(R(config.maxLevel, Infinity));
  const currentPrice = computed(() => getPrice(level.value));
  const priceDisplay = computed(
    () => currentPrice.value + ' ' + resource.value
  );
  const isMaxLevel = computed(() => level.value === maxLevel.value);
  const hasBought = computed(() => level.value > 0);
  const store = computed(() => {
    let curr: { owned: Ref<number> } = { owned: ref(0) };
    switch (layer) {
      case 1:
        curr = steam.steam;
        break;
      default:
        break;
    }
    return curr;
  });
  const resource = computed(() => {
    const res = 'steam';
    switch (layer) {
      default:
        break;
    }
    return res;
  });
  const isUnbuyable = computed(() => {
    const res = store.value;
    if (isMaxLevel.value) return true;
    return res.owned.value < currentPrice.value;
  });
  function buy() {
    const amt = store.value.owned;
    const price = currentPrice.value;
    if (price <= amt.value && !isMaxLevel) {
      switch (layer) {
        case 1:
          amt.value -= price;
          break;
        default:
          break;
      }
      level.value++;
    }
  }
  return {
    name,
    desc,
    isUnlocked,
    layer,
    level,
    maxLevel,
    isUnbuyable,
    isMaxLevel,
    priceDisplay,
    buy,
    getPrice,
    getEffect,
    hasBought,
  };
}
