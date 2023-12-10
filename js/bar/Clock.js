import { App, Utils, Widget } from "../imports.js";
import ClockLabel from "../widgets/ClockLabel.js";

export default () =>
  Widget.Button({
    className: "clock-button",
    onPrimaryClick: () => App.toggleWindow("dashboard"),
    onScrollUp: () => Utils.execAsync(["brightness-up"]),
    onScrollDown: () => Utils.execAsync(["brightness-down"]),
    child: ClockLabel(),
  });
