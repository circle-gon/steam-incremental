<template>
  <div>
    <div>You have {{ displayNumber(steam.water.owned.value) }} water.</div>
    <button
      :class="{ useable: isUseable('fill') }"
      @click="getResource('fill')"
    >
      Fill the furnace
    </button>
    <button
      :class="{ useable: isUseable('heat') }"
      @click="getResource('heat')"
    >
      Heat the furnace
    </button>
    <button
      :class="{ useable: isUseable('water') }"
      @click="getResource('water')"
    >
      Get 1 Water
    </button>
    <div>
      Heat in furnace: {{ displayNumber(steam.heat.owned.value) }}/{{
        displayNumber(steam.heat.queueData.req.value)
      }}<br />
      Water in furnace: {{ displayNumber(steam.fill.owned.value) }}/{{
        displayNumber(steam.fill.queueData.req.value)
      }}
    </div>
    <!--<upgrade-button
      v-for="(upgrade, i) in steam.upgrades"
      :key="upgrade.name"
      :upgrade="upgrade"
      :upg-id="i"
      :one-time="false"
    />-->
    <div>Upgrades:</div>
    <div class="flex">
      <upgrade-button
        v-for="(upgrade, i) in steam.oneUpgrades"
        :key="upgrade.name"
        :upgrade="upgrade"
        :upg-id="i"
        :one-time="true"
      ></upgrade-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { steam } from '@/data/steam';
import UpgradeButton from '../generic/UpgradeButton.vue';
import { displayNumber } from '@/util/util';
import type { SteamResourceType } from '@/data/steam';

const isUseable = (otherRes: SteamResourceType) => steam.isUseable(otherRes);
const getResource = (res: SteamResourceType) => {
  steam.getResource(res);
};
</script>
