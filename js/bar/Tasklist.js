import { focusClientOrMinimize, fullscreenToggle, getHyprlandClientIcon } from "../helpers/Misc.js";
import { Hyprland, Variable, Widget } from "../imports.js";

const clientMap = Variable(new Map()); // maintain consistent order

Hyprland.connect("notify::clients", (self) => {
  for (const client of self.clients) {
    clientMap.value.set(client.address, client);
  }
  clientMap.emit("changed");
});

Hyprland.connect("client-removed", (_, address) => {
  clientMap.value.delete(address);
});

const TaskButton = (client) => {
  return Widget.Button({
    onClicked: () => {
      focusClientOrMinimize(client);
    },
    onMiddleClick: () => Hyprland.sendMessage(`dispatch closewindow address:${client.address}`),
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
  });
};

export default (monitor) => {
  const tasklist = (self) => {
    const ws = Hyprland.getMonitor(monitor)?.activeWorkspace.id;
    if (!ws) return;
    const tasks = [];
    for (const client of clientMap.value.values()) {
      if (
        (client.workspace.id === ws || client.workspace.name === `special:m${ws}`) &&
        client.title !== ""
      ) {
        tasks.push(TaskButton(client));
      }
    }
    self.children = tasks.reverse();
  };

  const tasklistActive = (self) => {
    // only recreate the tasklist if neccessary
    if (Hyprland.active.monitor.id === monitor) tasklist(self);
  };

  return Widget.Box({
    className: "tasklist",
    hexpand: true,
    homogeneous: true,
    setup: (self) => {
      self
        .hook(Hyprland.active.workspace, tasklistActive)
        .hook(Hyprland.active.client, tasklistActive, "notify::address")
        .hook(clientMap, tasklist, "changed");
    },
  });
};
