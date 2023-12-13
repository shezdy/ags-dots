import AltTab from "./alttab/AltTab.js";
import Bar from "./bar/Bar.js";
import Dashboard from "./dashboard/Dashboard.js";
import Desktop from "./desktop/Desktop.js";
import { App, GLib, Gdk, Utils } from "./imports.js";
import Launcher from "./launcher/Launcher.js";
import NotificationPopups from "./notifications/NotificationPopups.js";
import options from "./options.js";
import Confirm from "./widgets/Confirm.js";

// Gdk monitors do not neccessarily have the same id as hyprland ones, so we use the monitor model to make sure
// windows use the correct monitor even if the Gdk monitor has a different id from the hyprland one.
// This will work as long as we don't have multiple monitors of the same model.
// Gdk4 has monitor.get_connector(), but this isn't an option with Gdk3.
function getGdkMonitors() {
  const display = Gdk.Display.get_default();
  const numGdkMonitors = display.get_n_monitors();
  const gdkMonitors = new Map();
  for (let i = 0; i < numGdkMonitors; i++) {
    const model = display.get_monitor(i).model;
    gdkMonitors.set(model, i);
  }
  return gdkMonitors;
}

function forMonitors(widget) {
  const monitors = JSON.parse(Utils.exec("hyprctl -j monitors"));
  const gdkMonitors = getGdkMonitors();
  return monitors.map((monitor) => {
    const gdkMonitor = gdkMonitors.get(monitor.model);
    if (gdkMonitor !== undefined) {
      return widget(monitor.id, gdkMonitor);
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

export default {
  style: css,
  notificationPopupTimeout: 5000,
  cacheNotificationActions: true,
  windows: [
    forMonitors(Bar),
    forMonitors(Desktop),
    AltTab(),
    NotificationPopups(),
    Dashboard(),
    Launcher(),
    Confirm(),
  ].flat(),
  closeWindowDelay: {
    dashboard: options.transition.duration,
  },
};
