import { GLib, Widget } from "../imports.js";

export default ({ format = "%a %d %b %H:%M", interval = 5000, ...props } = {}) =>
  Widget.Label({
    className: "clock",
    label: GLib.DateTime.new_now_local().format(format) || "wrong format",
    setup: (self) => {
      self.poll(interval, (self) => {
        self.label = GLib.DateTime.new_now_local().format(format) || "wrong format";
      });
    },
    ...props,
  });
