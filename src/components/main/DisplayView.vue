<template>
  <div class="business-display">
    <span>
      <span v-if="shown"> FPS: {{ displayNumber(actFPS, 0, true) }} </span>
      <span v-else class="hide"> FPS: 60 </span>
    </span>
    <span>
      You currently have {{ displayNumber(steam.steam.owned.value) }} steam.
    </span>
    <span class="hide"> FPS: 60 </span>
  </div>
</template>
<script setup lang="ts">
import { main, steam } from "@/data/main";
import { displayNumber } from "@/util/util";
import { computed } from "vue";

const actFPS = computed(() => main.internals.fps);
const shown = computed(() => main.settings.displayFPS);
</script>
<style scoped>
.business-display {
  display: flex;
  justify-content: space-between;
}
</style>
