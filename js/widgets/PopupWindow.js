import { App, Widget } from "../imports.js";
import options from "../options.js";

export const Padding = (name, { css = "", hexpand = true, vexpand = true } = {}) =>
  Widget.EventBox({
    hexpand,
    vexpand,
    can_focus: false,
    child: Widget.Box({ css }),
    setup: (w) => w.on("button-press-event", () => App.closeWindow(name)),
  });

const PopupRevealer = (name, child, transition = "slide_down") =>
  Widget.Box(
    { css: "padding: 1px;" },
    Widget.Revealer({
      transition,
      child: Widget.Box({
        class_name: "window-content",
        child,
      }),
      transitionDuration: options.transition.duration,
      setup: (self) =>
        self.hook(App, (_, wname, visible) => {
          if (wname === name) self.reveal_child = visible;
        }),
    }),
  );

const Location = (name, child, transition) => ({
  center: () =>
    Widget.CenterBox(
      {},
      Padding(name),
      Widget.CenterBox(
        { vertical: true },
        Padding(name),
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  top: () =>
    Widget.CenterBox(
      {},
      Padding(name),
      Widget.Box({ vertical: true }, PopupRevealer(name, child, transition), Padding(name)),
      Padding(name),
    ),
  right: () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        PopupRevealer(name, child, transition),
      ),
    ),
  "top-right": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
    ),
  "top-center": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  "top-left": () =>
    Widget.Box(
      {},
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        PopupRevealer(name, child, transition),
        Padding(name),
      ),
      Padding(name),
    ),
  "bottom-left": () =>
    Widget.Box(
      {},
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
      Padding(name),
    ),
  "bottom-center": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
      Padding(name),
    ),
  "bottom-right": () =>
    Widget.Box(
      {},
      Padding(name),
      Widget.Box(
        {
          hexpand: false,
          vertical: true,
        },
        Padding(name),
        PopupRevealer(name, child, transition),
      ),
    ),
});

export default ({ name, child, location = "center", transition, ...props }) =>
  Widget.Window({
    name,
    class_names: [name, "popup-window"],
    visible: false,
    keymode: "on-demand",
    layer: "top",
    anchor: ["top", "bottom", "right", "left"],
    child: Location(name, child, transition)[location](),
    ...props,
  });
