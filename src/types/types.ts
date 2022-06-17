import type { TabOptionsType, InnerTabOptionsType } from './tabTypes';
import type { Ref, ComputedRef } from 'vue';
import { ComputedKey } from '../compose/computed';

// unexported types

// generic types
interface UniqueComputed<T> extends ComputedRef<T> {
  [ComputedKey]: true;
}
type KeyType = (string | number)[];

type Primitive =
  | string
  | number
  | boolean
  | undefined
  | null
  // eslint-disable-next-line @typescript-eslint/ban-types
  | Function;
type BasicType =
  | Primitive
  | Ref<Primitive>
  | { [key: string]: BasicType }
  | BasicType[];
interface GenericObjectType {
  [key: string]: BasicType;
}

// setting buttons
interface InputType {
  min: number;
  max: number;
  getValue: () => number;
  result: (r: number) => number;
}
interface SettingButtonType {
  type: 'button';
  display: () => string | null;
  do: () => void;
}
interface SettingButtonInputType {
  type: 'input';
  display: () => string | null;
  doInput: (value: number) => void;
  other: InputType;
}
type RealSettingButtonType = SettingButtonType | SettingButtonInputType;

// upgrades
interface UpgradeType {
  name: string;
  desc: string;
  isUnlocked: UniqueComputed<boolean>;
  layer: number;
  level: Ref<number>;
  maxLevel: Ref<number>;
  isUnbuyable: UniqueComputed<boolean>;
  priceDisplay: UniqueComputed<string>;
  isMaxLevel: UniqueComputed<boolean>;
  buy: () => void;
  hasBought: UniqueComputed<boolean>;
  getPrice: (level: number) => number;
  getEffect: (level: number) => number;
}

// upgrade config
interface CoreConfigType {
  layer: number;
}
interface ConfigType extends CoreConfigType {
  maxLevel?: number;
}

// tabs
interface CoreTabsType {
  display: string;
  actual: string;
  shown: () => boolean;
  buttons?: Array<RealSettingButtonType | undefined>[];
}
interface InnerTabsType extends CoreTabsType {
  actual: InnerTabOptionsType;
}
interface TabsType extends CoreTabsType {
  actual: TabOptionsType;
  subtabs: InnerTabsType[] | [];
}

// steam types
type SteamResourceType = 'heat' | 'water' | 'fill';

// resource types
interface QueueType {
  remain: number;
  onStart: number;
  time: number;
  drainFactor: number;
  c: number;
  lastRemain: number;
  manual: boolean;
}
type GainType = (data: QueueType) => number;
interface DrainType {
  req: Ref<number>;
  k: Ref<number>;
  c: Ref<number>;
  queue: QueueType[];
  gainPerTick: GainType;
  sideEffect: (diff: number) => void;
  canDo: UniqueComputed<boolean>;
  computeDiff: (diff: number) => number;
}
interface ResourceType {
  owned: Ref<number>;
  multi: Ref<number>;
  update: () => void;
  addNewQueue: (drain: number) => void;
  queueData?: DrainType;
  isEmpty: (shouldEmpty?: boolean) => boolean;
  isNotFull: UniqueComputed<boolean>;
}
type ResourceQueueType = Required<ResourceType>;
interface ResourceInputType {
  owned?: number;
  multi?: number;
  req?: number;
  k?: number;
  c?: number;
  gainPerTick?: GainType;
  sideEffect?: (diff: number) => void;
  canDo?: UniqueComputed<boolean>;
  computeDiff?: (diff: number) => number;
}

// misc stuff
interface AchievementType {
  desc: string;
  hoverText: string;
  img: string;
  isUnlocked: () => boolean;
  bonus: number;
}

interface NotificationType {
  text: string;
  time: number;
}
export type {
  // prevent ts-prune from erroring the isTypeSupported below
  // generic types
  UniqueComputed,
  KeyType,
  Primitive,
  BasicType,
  GenericObjectType,
  // setting buttons (below)
  // ts-prune-ignore-next
  SettingButtonType,
  // ts-prune-ignore-next
  SettingButtonInputType,
  // upgrades
  // types of upgrades
  UpgradeType,
  // configs
  CoreConfigType,
  ConfigType,
  // tab types
  InnerTabsType,
  TabsType,
  // steam types
  SteamResourceType,
  // resource types
  QueueType,
  ResourceQueueType,
  ResourceInputType,
  DrainType,
  // misc types
  AchievementType,
  NotificationType,
};
