import AltTab from "./alttab/AltTab.js";
import Bar from "./bar/Bar.js";
import Dashboard from "./dashboard/Dashboard.js";
import Desktop from "./desktop/Desktop.js";
import { App, GLib, Gdk, Hyprland, Utils } from "./imports.js";
import Launcher from "./launcher/Launcher.js";
import NotificationPopups from "./notifications/NotificationPopups.js";
import options from "./options.js";
import PowerMenu from "./powermenu/PowerMenu.js";
import Confirm from "./widgets/Confirm.js";

// Gdk monitors do not neccessarily have the same id as hyprland ones, so we use
// monitor position as a key to match gdk monitors with corresponding hyprland monitors
function getGdkMonitors() {
  const display = Gdk.Display.get_default();
  const numGdkMonitors = display.get_n_monitors();
  const gdkMonitors = new Map();
  for (let i = 0; i < numGdkMonitors; i++) {
    const geometry = display.get_monitor(i).geometry;
    gdkMonitors.set(`${geometry.x}${geometry.y}`, i);
  }
  return gdkMonitors;
}

function forMonitors(widget) {
  const monitors = JSON.parse(Utils.exec("hyprctl -j monitors"));
  const gdkMonitors = getGdkMonitors();
  return monitors.map((monitor) => {
    const gdkMonitorID = gdkMonitors.get(`${monitor.x}${monitor.y}`);
    if (gdkMonitorID !== undefined) {
      return widget(monitor.id, gdkMonitorID);
    }
    console.warn(`Couldn't find Gdk monitor for Hyprland monitor ID ${monitor.id}.`);
    return widget(monitor.id, monitor.id);
  });
}

globalThis.app = App;

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
  Utils.exec("hyprctl dispatch exec 'sleep 1; ags -q ; ags'");
});
Hyprland.connect("monitor-removed", () => {
  Utils.exec("hyprctl dispatch exec 'sleep 1; ags -q ; ags'");
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
