import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

/** @param {string} windowName */
const Padding = (windowName) =>
  Widget.EventBox({
    className: "padding",
    hexpand: true,
    vexpand: true,
    setup: (self) => self.on("button-press-event", () => App.toggleWindow(windowName)),
  });

/**
 * @param {import('types/widgets/window').WindowProps & {
 *      name: string
 *      child: import('types/widgets/box').default
 *  }} o
 */
export default ({ name, child, ...rest }) =>
  Widget.Window({
    ...rest,
    classNames: ["popup-window", name],
    name,
    visible: false,
    popup: true,
    keymode: "on-demand",
    anchor: ["top", "bottom", "left", "right"],
    exclusivity: "ignore",
    setup() {
      child.toggleClassName("window-content");
    },
    child: Widget.CenterBox({
      className: "shade",
      children: [
        Padding(name),
        Widget.CenterBox({
          vertical: true,
          children: [Padding(name), child, Padding(name)],
        }),
        Padding(name),
      ],
    }),
  });
