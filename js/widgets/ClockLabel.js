import { GLib, Variable, Widget } from "../imports.js";

const time = Variable(GLib.DateTime.new_now_local(), {
  poll: [5000, () => GLib.DateTime.new_now_local()],
});

export default ({ format = "%a %d %b %H:%M", ...props } = {}) =>
  Widget.Label({
    className: "clock",
    label: time.bind().transform((t) => t.format(format) || "wrong format"),
    ...props,
  });
