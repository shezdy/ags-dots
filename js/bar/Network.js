import icons from "../icons.js";
import { App, Network, Widget } from "../imports.js";

const WifiIndicator = () =>
  Widget.Box({
    children: [
      Widget.Icon({
        binds: [["icon", Network.wifi, "icon-name"]],
      }),
      Widget.Label({
        binds: [["label", Network.wifi, "ssid"]],
      }),
    ],
  });

const WiredIndicator = () =>
  Widget.Button({
    onClicked: () => App.toggleWindow("dashboard"),
    child: Widget.Icon({
      className: "icon",
      connections: [
        [
          Network,
          (self) => {
            const status = Network.connectivity;
            if (status === "full") self.icon = icons.network.wired.connected;
            else if (status === "portal") self.icon = icons.network.wired.portal;
            else if (status === "limited") self.icon = icons.network.wired.limited;
            else self.icon = icons.network.wired.disconnected;
          },
          "notify::connectivity",
        ],
      ],
    }),
    // Widget.Label({
    //   connections: [
    //     [
    //       Network,
    //       (self) => {
    //         const status = Network.connectivity;
    //         if (status === "full") self.label = "󰇽";
    //         else if (status === "portal") self.label = "󱗜";
    //         else if (status === "limited") self.label = "󰍵";
    //         else self.label = "󰀧";
    //       },
    //       "notify::connectivity",
    //     ],
    //   ],
    // }),
  });

export default () =>
  Widget.Stack({
    className: "network",
    items: [
      ["wifi", WifiIndicator()],
      ["wired", WiredIndicator()],
    ],
    binds: [["shown", Network, "primary", (p) => p || "wired"]],
  });
