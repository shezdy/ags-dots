import "./init.js";

import AltTab from "./alttab/AltTab.js";
import Bar from "./bar/Bar.js";
import Dashboard from "./dashboard/Dashboard.js";
import Desktop from "./desktop/Desktop.js";
import { App, GLib, Hyprland, Utils } from "./imports.js";
import Launcher from "./launcher/Launcher.js";
import NotificationPopups from "./notifications/NotificationPopups.js";
import options from "./options.js";
import PowerMenu from "./powermenu/PowerMenu.js";
import Ipc from "./services/Ipc.js";
import Confirm from "./widgets/Confirm.js";

function forMonitors(widget) {
  // gtk bug workaround
  const gdkMonitors = Utils.exec(`gjs -m ${App.configDir}/js/helpers/monitors.js`).split("\n");
  return Hyprland.monitors.map((monitor) => {
    let i = 0;
    for (i; i < gdkMonitors.length; i++) {
      if (gdkMonitors[i] === monitor.name) break;
    }

    if (i === gdkMonitors.length) return widget(monitor.id, monitor.id);

    return widget(monitor.id, i);
  });
}

const scss = `${App.configDir}/scss/main.scss`;
const css = `${Utils.CACHE_DIR}/css/main.css`;
try {
  const [_, out, err] = GLib.spawn_command_line_sync(`sass ${scss} ${css}`);
  const decoder = new TextDecoder();

  const outDecode = decoder.decode(out).trim();
  if (outDecode.length > 0) console.log(`\n${outDecode}`);

  const errDecode = decoder.decode(err).trim();
  if (errDecode.length > 0) console.error(`\n${errDecode}`);
} catch (error) {
  console.error(error);
}

Hyprland.connect("monitor-added", () => {
  Utils.exec("hyprctl dispatch exec 'sleep 0.5; ags -q ; ags'");
});
Hyprland.connect("monitor-removed", () => {
  Utils.exec("hyprctl dispatch exec 'sleep 0.5; ags -q ; ags'");
});

App.config({
  style: css,
  icons: `${App.configDir}/assets`,
  windows: [
    forMonitors(Bar),
    forMonitors(Desktop),
    AltTab(),
    NotificationPopups(),
    Dashboard(),
    Launcher(),
    PowerMenu(),
    Confirm(),
  ].flat(),
  closeWindowDelay: {
    dashboard: options.transition.duration,
  },
});

Ipc.start();
