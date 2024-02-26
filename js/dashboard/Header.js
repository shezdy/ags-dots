import { execSh } from "../helpers/Misc.js";
import icons from "../icons.js";
import { App, Variable, Widget } from "../imports.js";
import options from "../options.js";
import Avatar from "../widgets/Avatar.js";
import { ConfirmAction } from "../widgets/Confirm.js";

const uptime = Variable("", {
  poll: [
    60_000,
    "cat /proc/uptime",
    (line) => {
      const s = Number.parseInt(line.split(".")[0]);
      const m = Math.floor((s / 60) % 60);
      const h = Math.floor((s / 60 / 60) % 24);
      const d = Math.floor(s / 60 / 60 / 24);

      if (d > 0) return `${d}d ${h}h ${m}m`;
      if (h > 0) return `${h}h ${m}m`;
      return `${m}m`;
    },
  ],
});

const SystemRow = () => {
  const PowerMenu = (event) =>
    Widget.Menu({
      children: [
        Widget.MenuItem({
          onActivate: () => {
            App.closeWindow("dashboard");
            ConfirmAction(() => execSh(options.powermenu.suspend));
          },
          child: Widget.Box({
            children: [Widget.Icon(icons.powermenu.suspend), Widget.Label("  Suspend")],
          }),
        }),
        Widget.MenuItem({
          onActivate: () => {
            App.closeWindow("dashboard");
            ConfirmAction(() => execSh(options.powermenu.reboot));
          },
          child: Widget.Box({
            children: [Widget.Icon(icons.powermenu.reboot), Widget.Label("  Reboot")],
          }),
        }),
        Widget.MenuItem({
          onActivate: () => {
            App.closeWindow("dashboard");
            ConfirmAction(() => execSh(options.powermenu.shutdown));
          },
          child: Widget.Box({
            children: [Widget.Icon(icons.powermenu.shutdown), Widget.Label("  Shutdown")],
          }),
        }),
      ],
    })
      .on("notify::visible", (self) => {
        if (!self.visible) self.destroy();
      })
      .popup_at_pointer(event);

  return Widget.Box({
    children: [
      Widget.Label({
        className: "uptime",
        hexpand: true,
        label: uptime.bind().transform((v) => `󰅐  ${v}`),
      }),
      Widget.Button({
        vpack: "center",
        onClicked: () => {
          App.closeWindow("dashboard");
          execSh(options.powermenu.lock);
        },
        child: Widget.Icon(icons.powermenu.lock),
      }),
      Widget.Button({
        child: Widget.Icon(icons.powermenu.shutdown),
        onPrimaryClick: (_, event) => PowerMenu(event),
      }),
    ],
  });
};

export default () =>
  Widget.Box({
    className: "header horizontal",
    children: [
      Avatar(),
      Widget.Separator(),
      Widget.Box({
        className: "system-box header horizontal",
        vertical: false,
        hexpand: true,
        hpack: "fill",
        children: [
          Widget.Box({
            vertical: true,
            homogeneous: false,
            children: [SystemRow()],
          }),
        ],
      }),
    ],
  });
