import { App, Gdk, Widget } from "../imports.js";
import PopupWindow from "./PopupWindow.js";

const WINDOW_NAME = "confirm";

let action = () => {};

export function ConfirmAction(fun) {
  action = fun;
  App.openWindow("confirm");
}

export default () =>
  PopupWindow({
    name: WINDOW_NAME,
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
              setup: (self) => {
                self
                  .on("enter-notify-event", (self) => {
                    self.grab_focus();
                  })
                  .on("map", (self) => {
                    self.grab_focus();
                  });
              },
            }),
            Widget.Button({
              child: Widget.Label("Yes"),
              onClicked: () => {
                action();
                App.closeWindow("confirm");
              },
              hexpand: true,
              setup: (self) => {
                self.on("enter-notify-event", (self) => {
                  self.grab_focus();
                });
              },
            }),
          ],
          setup: (self) => {
            self.on("key-press-event", (self, event) => {
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
            });
            self.keybind("Escape", () => App.closeWindow(WINDOW_NAME));
          },
        }),
      ],
    }),
  });
