import { GLib, Widget } from "../imports.js";

export default ({
  format = "%a %d %b %H:%M",
  interval = 5000,
  ...props
} = {}) =>
  Widget.Label({
    className: "clock",
    ...props,
    connections: [
      [
        interval,
        (self) => {
          self.label =
            GLib.DateTime.new_now_local().format(format) || "wrong format";
        },
      ],
    ],
  });
