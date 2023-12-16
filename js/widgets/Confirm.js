import { App, Gdk, Widget } from "../imports.js";
import PopupWindow from "./PopupWindow.js";

let action = () => {};

export function ConfirmAction(fun) {
  action = fun;
  App.openWindow("confirm");
}

export default () =>
  PopupWindow({
    name: "confirm",
    layer: "overlay",
    child: Widget.Box({
      vertical: true,
      className: "confirm",
      children: [
        Widget.Box({
          className: "text-box",
          vertical: true,
          children: [
            Widget.Label({
              className: "desc",
              label: "Are you sure?",
            }),
          ],
        }),
        Widget.Box({
          className: "buttons horizontal",
          vexpand: true,
          children: [
            Widget.Button({
              child: Widget.Label("No"),
              onClicked: () => App.closeWindow("confirm"),
              hexpand: true,
              connections: [
                [
                  "enter-notify-event",
                  (self) => {
                    self.grab_focus();
                  },
                ],
                [
                  "map",
                  (self) => {
                    self.grab_focus();
                  },
                ],
              ],
            }),
            Widget.Button({
              child: Widget.Label("Yes"),
              onClicked: () => {
                action();
                App.closeWindow("confirm");
              },
              hexpand: true,
              connections: [
                [
                  "enter-notify-event",
                  (self) => {
                    self.grab_focus();
                  },
                ],
              ],
            }),
          ],
          connections: [
            [
              "key-press-event",
              (self, event) => {
                const key = event.get_keyval()[1];
                switch (key) {
                  case Gdk.KEY_y:
                  case Gdk.KEY_Y:
                    self.children[1].grab_focus();
                    return true;
                  case Gdk.KEY_n:
                  case Gdk.KEY_N:
                    self.children[0].grab_focus();
                    return true;
                  default:
                    return false;
                }
              },
            ],
          ],
        }),
      ],
    }),
  });
