import { Notifications, Utils, Widget } from "../imports.js";
import Notification from "./Notification.js";

const blackList = ["Spotify"];

const Popups = (parent) => {
  const map = new Map();

  const onDismissed = (_, id, force = false) => {
    if (!id || !map.has(id)) return;

    if (map.get(id)._hovered.value && !force) return;

    if (map.size - 1 === 0) parent.reveal_child = false;

    Utils.timeout(200, () => {
      map.get(id)?.destroy();
      map.delete(id);
    });
  };

  const onNotified = (box, id) => {
    if (!id || Notifications.dnd) return;

    const n = Notifications.getNotification(id);
    if (!n) return;

    if (blackList.includes(n?.app_name)) return;

    map.delete(id);
    map.set(id, Notification(n));
    box.children = Array.from(map.values()).reverse();
    Utils.timeout(10, () => {
      parent.reveal_child = true;
    });
  };

  return Widget.Box({
    vertical: true,
    connections: [
      [Notifications, onNotified, "notified"],
      [Notifications, onDismissed, "dismissed"],
      [Notifications, (box, id) => onDismissed(box, id, true), "closed"],
    ],
  });
};

const PopupList = ({ transition = "slide_down" } = {}) =>
  Widget.Box({
    className: "notifications-popup-list",
    css: "padding: 1px",
    children: [
      Widget.Revealer({
        transition,
        setup: (self) => {
          self.child = Popups(self);
        },
      }),
    ],
  });

export default () =>
  Widget.Window({
    name: "notifications",
    anchor: ["top", "right"],
    child: PopupList(),
  });
