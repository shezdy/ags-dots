import { App, Utils, Widget } from "../imports.js";
import Clock from "../misc/Clock.js";

export default () =>
  Widget.Button({
    className: "datetime",
    onPrimaryClick: () => App.toggleWindow("dashboard"),
    onScrollUp: () => Utils.execAsync(["brightness-up"]),
    onScrollDown: () => Utils.execAsync(["brightness-down"]),
    child: Clock(),
  });
