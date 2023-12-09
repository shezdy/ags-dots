import { App, Widget } from "../imports.js";

export default (monitor) =>
  Widget.Window({
    name: `desktop${monitor}`,
    className: "desktop",
    monitor: monitor,
    layer: "background",
    anchor: ["top", "bottom", "left", "right"],
    child: Widget.EventBox({
      onSecondaryClick: () => App.openWindow("launcher"),
    }),
  });
