import icons from "../icons.js";
import { App, Hyprland, Widget } from "../imports.js";
import Brightness from "../services/Brightness.js";
import FontIcon from "../widgets/FontIcon.js";

const BrightnessPreset = (brightness, text) =>
  Widget.Button({
    className: "brightness-preset",
    hexpand: true,
    onClicked: () => {
      Brightness.screens = brightness;
    },
    child: FontIcon(text),
  });

const ExecQuickTile = ({ exec, icon, labelText }) => {
  return Widget.Button({
    hexpand: true,
    onClicked: () => {
      App.closeWindow("dashboard");
      Hyprland.messageAsync(`dispatch exec ${exec}`);
    },
    child: Widget.CenterBox({
      vpack: "center",
      startWidget: Widget.Box({
        vpack: "center",
        children: [icon, Widget.Label(labelText)],
      }),
      endWidget: Widget.Box({
        vpack: "center",
        hpack: "end",
        children: [
          Widget.Icon({
            icon: icons.ui.go.next,
            className: "open-icon",
          }),
        ],
      }),
    }),
  });
};

export default () =>
  Widget.Box({
    className: "quick-tiles horizontal",
    children: [
      Widget.Box({
        vertical: true,
        children: [
          Widget.Box({
            vertical: false,
            homogeneous: true,
            children: [
              ExecQuickTile({
                exec: "nm-connection-editor",
                icon: Widget.Icon(icons.network.wired.connected),
                labelText: "Connections",
              }),
              ExecQuickTile({
                exec: "opensnitch-ui",
                icon: FontIcon({ icon: "", className: "opensnitch" }),
                labelText: "Firewall",
              }),
            ],
          }),
          Widget.Box({
            vertical: false,
            homogeneous: true,
            children: [
              BrightnessPreset(0.0, icons.brightness.low),
              BrightnessPreset(0.3, icons.brightness.medium),
              BrightnessPreset(0.8, icons.brightness.high),
            ],
          }),
        ],
      }),
    ],
  });
