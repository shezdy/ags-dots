import { App, Utils, Variable, Widget } from "../imports.js";
import ShadedPopupWindow from "./ShadedPopupWindow.js";

let action = () => {};

export function ConfirmAction(fun) {
  action = fun;
  App.openWindow("confirm");
}

export default () =>
  ShadedPopupWindow({
    name: "confirm",
    expand: true,
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
          vpack: "end",
          homogeneous: true,
          children: [
            Widget.Button({
              child: Widget.Label("No"),
              onClicked: () => App.closeWindow("confirm"),
            }),
            Widget.Button({
              child: Widget.Label("Yes"),
              onClicked: () => {
                action();
                App.closeWindow("confirm");
              },
            }),
          ],
        }),
      ],
    }),
  });
