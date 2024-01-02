import { SystemTray, Widget } from "../imports.js";

export default () =>
  Widget.Box({
    className: "systray",
    children: SystemTray.bind("items").transform((items) => {
      return items
        .filter((item) => item.title !== "spotify" && item.title !== "opensnitch-ui")
        .map((item) => {
          return Widget.Button({
            child: Widget.Icon({
              icon: item.bind("icon"),
            }),
            onPrimaryClick: (_, event) => item.activate(event),
            onSecondaryClick: (_, event) => item.openMenu(event),
            tooltipMarkup: item.bind("tooltip-markup"),
          });
        });
    }),
  });
