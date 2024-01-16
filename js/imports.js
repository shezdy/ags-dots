import GLib from "gi://GLib";
import Gdk from "gi://Gdk?version=3.0";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import App from "resource:///com/github/Aylur/ags/app.js";
import Service from "resource:///com/github/Aylur/ags/service.js";
import Applications from "resource:///com/github/Aylur/ags/service/applications.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
// import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Network from "resource:///com/github/Aylur/ags/service/network.js";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import SystemTray from "resource:///com/github/Aylur/ags/service/systemtray.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

export {
  Hyprland,
  Mpris,
  Audio,
  Network,
  SystemTray,
  App,
  Applications,
  Widget,
  Utils,
  Notifications,
  Variable,
  Service,
  Gtk,
  GLib,
  Gdk,
  Gio,
};
