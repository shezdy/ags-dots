import { Notifications, Widget } from "../imports.js";
import Notification from "../notifications/Notification.js";

const ClearButton = () =>
  Widget.Button({
    onPrimaryClick: () => Notifications.clear(),
    binds: [["sensitive", Notifications, "notifications", (n) => n.length > 0]],
    child: Widget.Box({
      children: [
        Widget.Label("Clear "),
        Widget.Icon({
          binds: [
            [
              "icon",
              Notifications,
              "notifications",
              (n) => (n.length > 0 ? "user-trash-full-symbolic" : "user-trash-symbolic"),
            ],
          ],
        }),
      ],
    }),
  });

const Header = () =>
  Widget.Box({
    className: "header",
    children: [Widget.Label({ label: "Notifications", hexpand: true, xalign: 0 }), ClearButton()],
  });

const NotificationList = () =>
  Widget.Box({
    vertical: true,
    vexpand: false,
    connections: [
      [
        Notifications,
        (self) => {
          self.children = Notifications.notifications.reverse().map(Notification);
        },
      ],
    ],
  });

const Placeholder = () =>
  Widget.Box({
    className: "placeholder",
    vertical: true,
    vexpand: true,
    vpack: "center",
    hpack: "center",
    children: [
      // Widget.Icon("notifications-disabled-symbolic"),
      Widget.Label("No notifications"),
    ],
    binds: [["visible", Notifications, "notifications", (n) => n.length === 0]],
  });

export default () =>
  Widget.Box({
    className: "notifications",
    vexpand: true,
    vertical: true,
    children: [
      Header(),
      Placeholder(),
      Widget.Scrollable({
        vexpand: true,
        className: "notification-scrollable",
        hscroll: "never",
        vscroll: "automatic",
        child: Widget.Box({
          className: "notification-list",
          vertical: true,
          children: [NotificationList()],
        }),
        binds: [["visible", Notifications, "notifications", (n) => n.length > 0]],
      }),
    ],
  });
