import {
  focusClientOrMinimize,
  fullscreenToggle,
  getHyprlandClientIcon,
} from "../helpers/Misc.js";
import { Hyprland, Widget } from "../imports.js";

const TaskButton = (client) => {
  return Widget.Button({
    onClicked: () => {
      focusClientOrMinimize(client);
    },
    onMiddleClick: () =>
      Hyprland.sendMessage(`dispatch closewindow address:${client.address}`),
    onSecondaryClick: () => fullscreenToggle(client, 1, false),
    hexpand: true,
    child: Widget.Box({
      children: [
        Widget.Icon({
          className: "icon",
          icon: getHyprlandClientIcon(client),
          size: 14,
        }),
        Widget.Label({
          className: "title",
          label: client.fullscreen ? `󱇬 ${client.title}` : client.title,
          truncate: "end",
        }),
      ],
    }),
    className:
      client.workspace.id <= 0
        ? "minimized"
        : Hyprland.active.client.address === client.address
        ? "active"
        : "",
    properties: [
      ["address", client.address],
      ["initialTitle", client.initialTitle],
      ["workspace", client.workspace],
    ],
  });
};

export default (monitor) => {
  const tasklist = (self) => {
    const ws = Hyprland.getMonitor(monitor)?.activeWorkspace.id;
    const tasks = [];
    for (const client of Hyprland.clients) {
      if (
        (client.workspace.id === ws ||
          client.workspace.name === `special:m${ws}`) &&
        client.monitor === monitor &&
        client.title !== ""
      ) {
        tasks.push(TaskButton(client));
      }
    }
    self.children = tasks.reverse();
  };

  return Widget.Box({
    className: "tasklist",
    hexpand: true,
    homogeneous: true,
    connections: [
      [Hyprland, tasklist, "notify::monitors"],
      [Hyprland.active.client, tasklist, "notify::title"],
      [Hyprland.active.client, tasklist, "notify::address"],
      [Hyprland, tasklist, "notify::clients"],
    ],
  });
};
