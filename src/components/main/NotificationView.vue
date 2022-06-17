<template>
  <div class="notificationarea">
    <div
      v-for="(notify, i) in notifies"
      :key="notify.time"
      class="notification"
      @click="removeNotify(i)"
    >
      {{ notify.text }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { notifications } from "@/data/main";
import { computed } from "vue";
const notifies = computed(() => notifications.notifications.slice().reverse());
const removeNotify = (i: number) => {
  notifications.removeNotify(i);
};
</script>
<style scoped>
.notificationarea {
  position: fixed;
  top: 0px;
  right: 0px;
  z-index: 1;
}
.notification {
  position: relative;
  right: 0px;
  margin: 0px;
  padding: 2px;
  background-color: #000000;
  color: #ffffff;
  text-align: center;
  border-radius: 6px;
  z-index: 1;
}
</style>
