import { launchApp } from "../helpers/Misc.js";
import icons from "../icons.js";
import { App, Utils, Widget } from "../imports.js";

/** @param {import('resource:///com/github/Aylur/ags/service/applications.js').Application} app */
export default (app) => {
  const title = Widget.Label({
    className: "title",
    label: app.name,
    maxWidthChars: 18,
    truncate: "end",
  });

  const icon = Widget.Icon({
    icon: Utils.lookUpIcon(app.icon_name || "") ? app.icon_name || "" : icons.apps.fallback,
    size: 48,
  });

  const textBox = Widget.Box({
    vertical: true,
    hpack: "center",
    children: [title],
  });

  return Widget.Button({
    className: "app-item",
    tooltipText: app.name,
    setup: (self) => {
      self.app = app;
    },
    onClicked: () => {
      App.closeWindow("launcher");
      launchApp(app);
    },
    child: Widget.Box({
      className: "box",
      vertical: true,
      vpack: "center",
      children: [icon, textBox],
    }),
  });
};
