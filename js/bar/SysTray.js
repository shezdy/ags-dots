import { SystemTray, Widget } from "../imports.js";

export default () =>
  Widget.Box({
    className: "systray",
    connections: [
      [
        SystemTray,
        (self) => {
          self.children = SystemTray.items
            .filter(
              (item) =>
                item.title !== "spotify" && item.title !== "opensnitch-ui"
            )
            .map((item) => {
              return Widget.Button({
                child: Widget.Icon({
                  binds: [["icon", item, "icon"]],
                }),
                onPrimaryClick: (_, event) => item.activate(event),
                onSecondaryClick: (_, event) => item.openMenu(event),
                binds: [["tooltip-markup", item, "tooltip-markup"]],
              });
            });
        },
      ],
    ],
  });

// const SysTrayItem = (item) =>
//   Widget.Button({
//     className: "systray",
//     child: Widget.Icon({ binds: [["icon", item, "icon"]] }),
//     binds: [["tooltipMarkup", item, "tooltip-markup"]],
//     setup: (self) => {
//       const id = item.menu?.connect("popped-up", (menu) => {
//         self.toggleClassName("active");
//         menu.connect("notify::visible", (menu) => {
//           self.toggleClassName("active", menu.visible);
//         });
//         menu.disconnect(id);
//       });

//       if (id) self.connect("destroy", () => item.menu?.disconnect(id));
//     },

//     on_primary_click: (btn) =>
//       item.menu?.popup_at_widget(
//         btn,
//         Gdk.Gravity.SOUTH,
//         Gdk.Gravity.NORTH,
//         null
//       ),

//     on_secondary_click: (btn) =>
//       item.menu?.popup_at_widget(
//         btn,
//         Gdk.Gravity.SOUTH,
//         Gdk.Gravity.NORTH,
//         null
//       ),
//   });

// const submenuItems = Variable(1);
// SystemTray.connect("changed", () => {
//   submenuItems.setValue(SystemTray.items.length + 1);
// });

// export default () =>
//   SubMenu({
//     items: submenuItems,
//     children: [
//       Widget.Box({
//         binds: [["children", SystemTray, "items", (i) => i.map(SysTrayItem)]],
//       }),
//       // ColorPicker(),
//     ],
//   });
