import { App, Widget } from "../imports.js";

export default (monitor, gdkmonitor) =>
  Widget.Window({
    name: `desktop${monitor}`,
    className: "desktop",
    gdkmonitor,
    layer: "background",
    anchor: ["top", "bottom", "left", "right"],
    child: Widget.EventBox({
      onSecondaryClick: () => App.openWindow("launcher"),
    }),
  });
