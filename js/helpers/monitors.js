import Gdk from "gi://Gdk?version=4.0";

const display = Gdk.Display.open("wayland-1");
const gdkMonitors = display.get_monitors();
for (let i = 0; i < gdkMonitors.get_n_items(); i++) {
  print(gdkMonitors.get_item(i).get_connector());
}
