import { focusClientOrMinimize, fullscreenToggle, getHyprlandClientIcon } from "../helpers/Misc.js";
import { Hyprland, Utils, Variable, Widget } from "../imports.js";

const clientMap = Variable(new Map()); // maintain consistent order
Utils.execAsync("hyprctl -j clients")
  .then((out) => {
    for (const client of JSON.parse(out)) {
      clientMap.value.set(client.address, client);
    }
  })
  .catch(console.error);

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

  return Widget.Box({
    className: "tasklist",
    hexpand: true,
    homogeneous: true,
    connections: [
      [Hyprland, tasklist, "notify::monitors"],
      [Hyprland.active.client, tasklist, "notify::title"],
      [Hyprland.active.client, tasklist, "notify::address"],
      [clientMap, tasklist, "changed"],
    ],
  });
};
