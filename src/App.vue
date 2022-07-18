<template>
  <div>
    <display-view />
    <business-tab />
    <notification-view />
  </div>
</template>

<script setup lang="ts">
import { main } from './data/main';
import BusinessTab from './components/main/BusinessTab.vue';
import DisplayView from './components/main/DisplayView.vue';
import NotificationView from './components/main/NotificationView.vue';
import { onMounted } from 'vue';

onMounted(() => {
  main.loadGame();
  main.mainGameLoop();
});
</script>

<style>
/* *** All components styling *** */
* {
  box-sizing: border-box;
  text-align: center;
}
button {
  font-family: inherit;
  font-size: 100%;
  background: #ffffff;
  border: 1px solid #000000;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  transition: 500ms;
}

.flex {
  display: flex;
  justify-content: center;
}

/* Specific tabs */
.innertab {
  padding: 0.25rem 1rem;
}
.tab-display {
  text-align: center;
}
/* Generic styles */
.center {
  text-align: center;
}
/* For mainly upgrades, but can also be used for other things */
.useable {
  background: #00ff00;
}
.useable:hover {
  transform: scale(1.1);
}
.hide {
  visibility: hidden;
}
.style-as-button {
  font-family: inherit;
  font-size: 100%;
  background: #ffffff;
  border: 0.1px solid #000000;
  box-sizing: border-box;
  border-radius: 4px;
  transition: 500ms;
}
/* Overides default center class for tables */
table.center {
  margin-left: auto;
  margin-right: auto;
}

/* Tooltips. Note: these can be extended. */
/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  /* Important detail, will be shown on hover */
  visibility: hidden;

  /* By default */
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Used to position the tooltip */
  position: absolute;
  z-index: 1;

  /* ****** How it looks ********* */
  background-color: grey;
  color: #ffffff;

  /* ****** Show tooltip on top ******* */
  width: 120px;
  bottom: 100%;
  left: 50%;
  margin-left: -60px;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
