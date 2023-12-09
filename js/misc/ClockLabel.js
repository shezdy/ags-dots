import { Utils, Widget } from "../imports.js";

export default ({
  format = "%a %d %b %H:%M",
  interval = 1000,
  ...props
} = {}) =>
  Widget.Label({
    className: "clock",
    ...props,
    connections: [
      [
        1000,
        (self) =>
          Utils.execAsync(["date", `+${format}`])
            .then((date) => {
              self.label = date;
            })
            .catch(console.error),
      ],
    ],
  });
