import { execSh } from "../helpers/Misc.js";
import icons from "../icons.js";
import { App, Widget } from "../imports.js";
import options from "../options.js";
import { ConfirmAction } from "../widgets/Confirm.js";
import PopupWindow from "../widgets/PopupWindow.js";

const PowerMenuButton = (action, confirm = true) =>
  Widget.Button({
    onClicked: () => {
      if (confirm) ConfirmAction(() => execSh(options.powermenu[action]));
      else execSh(options.powermenu[action]);
      App.closeWindow("powermenu");
    },
    child: Widget.Box({
      vertical: true,
      children: [Widget.Icon(icons.powermenu[action])],
    }),
    setup: (self) => {
      self.on("enter-notify-event", (self) => {
        self.grab_focus();
      });
    },
  });

export default () =>
  PopupWindow({
    name: "powermenu",
    layer: "overlay",
    child: Widget.Box({
      children: [
        PowerMenuButton("shutdown"),
        PowerMenuButton("reboot"),
        PowerMenuButton("lock", false),
        PowerMenuButton("suspend", false),
        PowerMenuButton("logout"),
      ],
      setup: (self) => {
        self.on("map", (self) => {
          self.children[2].grab_focus();
        });
      },
    }),
  });
