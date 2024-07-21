import { Notifications, Widget } from "../imports.js";
import Notification from "./Notification.js";

Notifications.notificationPopupTimeout = 5000;
Notifications.cacheNotificationActions = true;

const Popups = () =>
  Widget.Box({
    vertical: true,
    hpack: "end",
    attribute: {
      map: new Map(),
      dismiss: (box, id) => {
        if (!box.attribute.map.has(id)) return;

        const notif = box.attribute.map.get(id);
        notif.attribute.count--;

        if (notif.attribute.count <= 0) {
          box.attribute.map.delete(id);
          notif.attribute.destroyWithAnims(box.attribute.map.size === 0);
        }
      },
      notify: (box, id) => {
        const notif = Notifications.getNotification(id);

        if (Notifications.dnd || !notif) return;

        if (box.attribute.map.size === 0) App.openWindow("popupNotifications");

        const replace = box.attribute.map.get(id);

        if (!replace) {
          const notification = Notification(notif);

          box.attribute.map.set(id, notification);
          notification.attribute.count = 1;
          box.pack_start(notification, false, false, 0);
        } else {
          const notification = Notification(notif, true);

          notification.attribute.count = replace.attribute.count + 1;
          box.remove(replace);
          replace.destroy();
          box.pack_start(notification, false, false, 0);
          box.attribute.map.set(id, notification);
        }
      },
    },

    setup: (self) => {
      self
        .hook(Notifications, (box, id) => box.attribute.notify(box, id), "notified")
        .hook(Notifications, (box, id) => box.attribute.dismiss(box, id), "dismissed")
        .hook(Notifications, (box, id) => box.attribute.dismiss(box, id, true), "closed");
    },
  });

const PopupList = () =>
  Widget.Box({
    className: "notifications-popup-list",
    css: "padding: 1px; min-width: 1px",
    children: [Popups()],
  });

export default () =>
  Widget.Window({
    name: "popupNotifications",
    anchor: ["top", "right"],
    child: PopupList(),
    layer: "overlay",
    visible: false,
  });
