import { focusClientOrMinimize, fullscreenToggle, getHyprlandClientIcon } from "../helpers/Misc.js";
import { Hyprland, Widget } from "../imports.js";

const TaskButton = (address) => {
  return Widget.Button({
    onClicked: () => {
      focusClientOrMinimize(Hyprland.getClient(address));
    },
    onMiddleClick: () => Hyprland.messageAsync(`dispatch closewindow address:${address}`),
    onSecondaryClick: () => fullscreenToggle(Hyprland.getClient(address), 1, false),
    hexpand: true,
    child: Widget.Box({
      children: [
        Widget.Icon({
          className: "icon",
          icon: getHyprlandClientIcon(Hyprland.getClient(address)),
          size: 14,
        }),
        Widget.Label({
          className: "title",
          label: (() => {
            const client = Hyprland.getClient(address);
            return client?.fullscreen ? `󱇬 ${client.title}` : client.title;
          })(),
          truncate: "end",
          setup: (self) => {
            self.hook(
              Hyprland,
              (_, e, a) => {
                const client = Hyprland.getClient(address);
                if (
                  client &&
                  (e === "fullscreen" || (e === "windowtitle" && `0x${a}` === address))
                ) {
                  self.label = client.fullscreen ? `󱇬 ${client.title}` : client.title;
                }
              },
              "event",
            );
          },
        }),
      ],
    }),
    attribute: {
      address: address,
    },
    setup: (self) => {
      const checkVisible = () => {
        const ws = Hyprland.getMonitor(self.parent.attribute.monitor)?.activeWorkspace.id;
        const c = Hyprland.getClient(address);

        if (!ws || !c) return;

        self.visible =
          (ws === c.workspace.id || c.workspace.name === `special:m${ws}`) &&
          !(c.xwayland && c.title === ""); // if it is xwayland and has no title it is probably a tooltip or smth

        self.toggleClassName("minimized", c.workspace.id <= 0);
      };

      self
        .hook(
          Hyprland.active.client,
          () => {
            self.toggleClassName("active", Hyprland.active.client.address === address);
          },
          "notify::address",
        )
        .hook(
          Hyprland,
          (_, e) => {
            if (e === "movewindow") {
              checkVisible();
            }
          },
          "event",
        )
        .hook(Hyprland.active.workspace, checkVisible);
    },
  });
};

export default (monitor) => {
  return Widget.Box({
    className: "tasklist",
    hexpand: true,
    homogeneous: true,
    attribute: {
      monitor,
    },
    setup: (self) => {
      self
        .hook(
          Hyprland,
          (self, address) => {
            if (address) {
              self.children.find((c) => c.attribute.address === address)?.destroy();
            }
          },
          "client-removed",
        )
        .hook(
          Hyprland,
          (self, address) => {
            if (address) {
              const client = Hyprland.getClient(address);
              if (client.mapped) {
                const button = TaskButton(client.address);
                self.add(button);
                self.reorder_child(button, 0);
              }
            }
          },
          "client-added",
        );

      const tasks = [];
      for (const client of Hyprland.clients) {
        if (client.mapped && client.monitor !== -1) tasks.push(TaskButton(client.address));
      }
      self.children = tasks.reverse();
    },
  });
};
