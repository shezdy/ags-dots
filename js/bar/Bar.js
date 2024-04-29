import { App, Hyprland, Widget } from "../imports.js";
import Clock from "./Clock.js";
import Media from "./Media.js";
import Network from "./Network.js";
import SysTray from "./SysTray.js";
import Tasklist from "./Tasklist.js";
import Volume from "./Volume.js";
import Workspaces from "./Workspaces.js";

const LauncherButton = () => {
  return Widget.Button({
    onClicked: () => App.toggleWindow("launcher"),
    className: "launcher-button",
  });
};

const SysIndicators = () => {
  return Widget.Box({
    className: "system-indicators",
    children: [
      Widget.EventBox({
        className: "eventbox",
        child: Widget.Box({
          children: [Volume(), Network(), Clock()],
        }),
        setup: (self) => {
          self.hook(App, (self, win, visible) => {
            if (win === "dashboard") {
              self.toggleClassName("active", visible);
            }
          });
        },
      }),
    ],
  });
};

const ConfigErrorIndicator = () =>
  Widget.Button({
    className: "error-indicator",
    child: Widget.Label({ label: "-------", visible: true }),
    visible: false,
    onClicked: () => {
      Hyprland.messageAsync(
        "dispatch exec [float;move onscreen 0% 0%;size 800, 500] kitty -e hyprpm update",
      );
    },
    setup: (self) => {
      const errors = JSON.parse(Hyprland.message("j/configerrors"));
      if (errors[0] !== "") {
        self.visible = true;
        self.tooltipText = errors.join("\n");
      } else {
        self.visible = false;
      }

      self.hook(
        Hyprland,
        (self, name, _data) => {
          if (name === "configreloaded") {
            const errors = JSON.parse(Hyprland.message("j/configerrors"));
            if (errors[0] !== "") {
              self.visible = true;
              self.tooltipText = errors.join("\n");
            } else {
              self.visible = false;
            }
            print("configreloaded");
          }
        },
        "event",
      );
    },
  });

const Left = (monitor) =>
  Widget.Box({
    className: "left",
    children: [LauncherButton(), Workspaces(monitor)],
    setup: (self) => {
      Utils.idle(() => self.add(ConfigErrorIndicator()));
    },
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

export default (monitor, gdkmonitor) =>
  Widget.Window({
    name: `bar${monitor}`,
    exclusivity: "exclusive",
    gdkmonitor,
    anchor: ["top", "left", "right"],
    child: Widget.Box({
      className: "bar",
      homogeneous: false,
      hpack: "fill",
      children: [Left(monitor), Center(monitor), Right()],
    }),
  });
