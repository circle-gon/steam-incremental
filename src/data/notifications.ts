import { createLayer } from '../util/layers';
import { reactive } from 'vue';
import { getTime } from '../util/util';

export interface NotificationType {
  text: string;
  time: number;
}
export const notifications = createLayer(() => {
  const notifications = reactive([] as NotificationType[]);
  function updateNotifications() {
    for (const [num, notify] of notifications.entries()) {
      if (getTime() - notify.time > 5000) {
        removeNotify(num);
      }
    }
  }
  function notify(text: string) {
    notifications.push({
      text: text,
      time: getTime(),
    });
  }
  function removeNotify(id: number) {
    notifications.splice(id, 1);
  }
  return {
    notifications,
    notify,
    removeNotify,
    updateNotifications,
  };
});
