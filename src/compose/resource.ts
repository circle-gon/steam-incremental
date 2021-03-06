import { reactive } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import { R, getTime } from '../util/util';
import { isOfType } from '../util/types';
import { upThenDown as defaultQueue } from './queue';
import { computed, ref } from './reactive';

function resourceError(func: string): Error {
  return new Error(
    `Can not perform ${func} on Resource that does not have queueData`
  );
}

export interface QueueType {
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
  canDo: ComputedRef<boolean>;
  computeDiff: (diff: number) => number;
}
type ResourceType = ReturnType<typeof drainingResource>;
export type ResourceQueueType = Required<ResourceType> & {
  queueData: QueueType[];
};
interface ResourceInputType {
  owned?: number;
  multi?: number;
  req?: number;
  k?: number;
  c?: number;
  gainPerTick?: GainType;
  sideEffect?: (diff: number) => void;
  canDo?: ComputedRef<boolean>;
  computeDiff?: (diff: number) => number;
}
export function drainingResource(options: ResourceInputType = {}) {
  const owned = ref(R(options.owned, 0));
  const multi = ref(R(options.multi, 1));
  let queueData: undefined | DrainType;
  if (options.req !== undefined) {
    queueData = {
      req: ref(options.req),
      k: ref(1),
      c: ref(5),
      queue: reactive([]),
      gainPerTick: R(options.gainPerTick, defaultQueue),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      sideEffect: R(options.sideEffect, () => {}),
      computeDiff: R(options.computeDiff, (diff: number) => diff),
      canDo: R(
        options.canDo,
        computed(() => true)
      ),
    };
  }
  const isNotFull = computed(() => {
    if (queueData) {
      return owned.value < queueData.req.value;
    }
    throw resourceError('isNotFull');
  });
  function addNewQueue(drainAmt: number, manual = true) {
    if (queueData) {
      queueData.queue.push({
        remain: drainAmt,
        onStart: drainAmt,
        time: getTime(),
        drainFactor: queueData.k.value,
        c: queueData.c.value,
        lastRemain: 0,
        manual,
      });
    } else {
      throw resourceError('addNewQueue');
    }
  }
  function resetToMax() {
    if (queueData) {
      owned.value = Math.min(queueData.req.value, owned.value);
    } else {
      throw resourceError('resetToMax');
    }
  }
  function isEmpty(notFull = true) {
    if (queueData) {
      return (
        (notFull ? isNotFull.value : true) &&
        !queueData.queue.some((element) => {
          return element.manual === true;
        })
      );
    }
    throw resourceError('isEmpty');
  }
  function removeQueue(id: number) {
    if (queueData) {
      queueData.queue.splice(id, 1);
    } else {
      throw resourceError('removeQueue');
    }
  }
  function update() {
    if (queueData) {
      for (const [num, data] of [...queueData.queue].entries()) {
        if (isOfType<QueueType>(data, 'c')) {
          if (!queueData.canDo.value) {
            removeQueue(num);
            continue;
          }
          data.lastRemain = data.remain;
          data.remain = queueData.gainPerTick(data);
          // (c+1)/c because of start errors
          // now todo: figure out c and k's effect on result
          const diff = queueData.computeDiff(data.lastRemain - data.remain);
          owned.value += diff;
          queueData.sideEffect(diff);
          if (owned.value > queueData.req.value) {
            queueData.queue.splice(0, queueData.queue.length);
            owned.value = queueData.req.value;
            break;
          } else if (data.remain < 0.01) {
            owned.value += data.remain;
            queueData.sideEffect(data.remain);
            removeQueue(num);
          }
        }
      }
    } else {
      throw resourceError('update');
    }
  }
  return {
    owned,
    multi,
    queueData,
    isNotFull,
    addNewQueue,
    resetToMax,
    isEmpty,
    update,
  };
}
