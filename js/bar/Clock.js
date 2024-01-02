import { App, Widget } from "../imports.js";
import ClockLabel from "../widgets/ClockLabel.js";

export default () =>
  Widget.Button({
    className: "clock-button",
    onClicked: () => App.toggleWindow("dashboard"),
    child: ClockLabel(),
  });
