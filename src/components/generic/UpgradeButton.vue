<template>
  <button
    :class="{
      useable: !upgrade.isUnbuyable.value,
      maxed: upgrade.isMaxLevel.value,
    }"
    :disabled="upgrade.isUnbuyable.value"
    @click="buyUpgrade(upgData)"
    v-if="upgrade.isUnlocked"
    style="width: 200px; height: 200px; font-size: 90%"
  >
    {{ upgrade.name }}
    <br />{{ upgrade.desc }} <br />
    <div><slot></slot></div>
    Cost: {{ upgrade.priceDisplay.value }}
  </button>
</template>
<script setup lang="ts">
import { main } from '@/data/main';
import { computed } from 'vue';
import type { UpgradeType } from '@/compose/upgrades';
const props = defineProps<{
  upgId: string | number;
  upgrade: UpgradeType;
  oneTime: boolean;
}>();
const buyUpgrade = (obj: { name: string; layer: number; oneTime: boolean }) => {
  main.buyUpgrade(obj);
};
const upgData = computed(() => {
  return {
    name: props.upgId as string,
    layer: props.upgrade.layer,
    oneTime: props.oneTime,
  };
});
</script>
<style scoped>
.maxed {
  background: #1fad1f;
}
</style>
