import icons from "../icons.js";
import { App, Network, Widget } from "../imports.js";

const WifiIndicator = () =>
  Widget.Box({
    children: [
      Widget.Icon({
        icon: Network.wifi.bind("icon-name"),
      }),
      Widget.Label({
        label: Network.wifi.bind("ssid"),
      }),
    ],
  });

const WiredIndicator = () =>
  Widget.Button({
    onClicked: () => App.toggleWindow("dashboard"),
    child: Widget.Icon({
      className: "icon",
      icon: Network.bind("connectivity").transform((status) => {
        switch (status) {
          case "full":
            return icons.network.wired.connected;
          case "portal":
            return icons.network.wired.portal;
          case "limited":
            return icons.network.wired.limited;
          default:
            return icons.network.wired.disconnected;
        }
      }),
    }),
  });

export default () =>
  Widget.Stack({
    className: "network",
    children: {
      wifi: WifiIndicator(),
      wired: WiredIndicator(),
    },
    shown: Network.bind("primary").transform((p) => p || "wired"),
  });
