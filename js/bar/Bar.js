import { Widget, App, Audio } from "../imports.js";
import Clock from "./Clock.js";
import Media from "./Media.js";
import Network from "./Network.js";
import SysTray from "./SysTray.js";
import Tasklist from "./Tasklist.js";
import Volume from "./Volume.js";
import Workspaces from "./Workspaces.js";

const SysIndicators = () => {
  return Widget.Box({
    className: "system-indicators",
    children: [
      Widget.EventBox({
        className: "eventbox",
        child: Widget.Box({
          children: [Volume(), Network(), Clock()],
        }),
        connections: [
          [
            App,
            (self, win, visible) => {
              self.toggleClassName("active", win === "dashboard" && visible);
            },
          ],
        ],
      }),
    ],
  });
};

const Left = (monitor) =>
  Widget.Box({
    className: "left",
    children: [Workspaces(monitor)],
  });

const Center = (monitor) =>
  Widget.Box({
    className: "center",
    children: [Tasklist(monitor)],
  });

const Right = () =>
  Widget.Box({
    className: "right",
    hpack: "end",
    children: [SysTray(), Media(), SysIndicators()],
  });

export default (monitor, gdkMonitor) =>
  Widget.Window({
    name: `bar${monitor}`,
    exclusivity: "exclusive",
    monitor: gdkMonitor,
    anchor: ["top", "left", "right"],
    child: Widget.Box({
      className: "bar",
      homogeneous: false,
      hpack: "fill",
      children: [Left(monitor), Center(monitor), Right()],
    }),
  });
