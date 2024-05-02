import { Hyprland, Widget } from "../imports.js";

const numWorkspaces = 6;

export default (monitor) => {
  const min = monitor * numWorkspaces + 1;
  const max = monitor * numWorkspaces + numWorkspaces;

  const ExtraWorkspaceButton = (id) =>
    Widget.Button({
      className: "extra-button",
      onClicked: () => Hyprland.messageAsync(`dispatch focusworkspaceoncurrentmonitor ${id}`),
      onSecondaryClick: () => Hyprland.messageAsync(`dispatch movetoworkspacesilent ${id}`),
      child: Widget.Label({
        label: `${id}`,
      }),
      attribute: { id },
      setup: (self) => {
        const update = () => {
          self.toggleClassName("active", Hyprland.getMonitor(monitor)?.activeWorkspace.id === id);
        };

        self
          .hook(Hyprland, update, "notify::monitors")
          .hook(Hyprland, update, "notify::workspaces");
      },
    });

  const extraWorkspaces = Widget.Box({
    setup: (self) => {
      const addExtraWorkspaceButton = (id) => {
        let low = 0;
        let high = self.children.length;

        while (low < high) {
          const mid = (low + high) >>> 1;
          if (self.children[mid].attribute.id < id) low = mid + 1;
          else high = mid;
        }

        const newButton = ExtraWorkspaceButton(id);
        self.add(newButton);
        self.reorder_child(newButton, low);
        newButton.show_all();
      };

      for (const ws of Hyprland.workspaces) {
        if (ws.monitorID !== monitor) continue;

        const id = ws.id;

        if ((id < min && id > 0) || id > max) {
          addExtraWorkspaceButton(id);
        }
      }

      self
        .hook(
          Hyprland,
          (_, e, data) => {
            if (e === "moveworkspace") {
              const values = data.split(",");
              const id = parseInt(values[0]);
              if (
                ((id < min && id > 0) || id > max) &&
                Hyprland.getWorkspace(id)?.monitorID === monitor
              ) {
                if (!self.children.find((c) => c.attribute.id === id)) {
                  addExtraWorkspaceButton(id);
                }
              } else {
                self.children.find((c) => c.attribute.id === id)?.destroy();
              }
            } else if (e === "workspace") {
              const id = parseInt(data);
              if (
                ((id < min && id > 0) || id > max) &&
                Hyprland.getWorkspace(id)?.monitorID === monitor
              ) {
                if (!self.children.find((c) => c.attribute.id === id)) {
                  addExtraWorkspaceButton(id);
                }
              } else {
                self.children.find((c) => c.attribute.id === id)?.destroy();
              }
            }
          },
          "event",
        )
        .hook(
          Hyprland,
          (_, id) => {
            if (
              id &&
              Hyprland.getWorkspace(id)?.monitorID === monitor &&
              ((id < min && id > 0) || id > max)
            ) {
              addExtraWorkspaceButton(id);
            }
          },
          "workspace-added",
        )
        .hook(
          Hyprland,
          (_, id) => {
            self.children.find((c) => c.attribute.id === parseInt(id))?.destroy();
          },
          "workspace-removed",
        );
    },
  });

  return Widget.Box({
    className: "workspaces",
    children: [
      Widget.EventBox({
        className: "eventbox",
        child: Widget.Box({
          children: [
            Widget.Box({
              homogeneous: true,
              className: "ws-box",
              children: Array.from({ length: numWorkspaces }, (_, i) => i + min).map((i) =>
                Widget.Button({
                  className: "ws-button",
                  onClicked: () =>
                    Hyprland.messageAsync(`dispatch focusworkspaceoncurrentmonitor ${i}`),
                  onSecondaryClick: () =>
                    Hyprland.messageAsync(`dispatch movetoworkspacesilent ${i}`),
                  child: Widget.Box({
                    className: "box",
                    hpack: "center",
                  }),
                }),
              ),
              setup: (self) => {
                const update = (activeID) => {
                  for (const [i, btn] of self.children.entries()) {
                    const id = i + min;
                    if (activeID === id) {
                      btn.toggleClassName("active", true);
                      btn.toggleClassName("urgent", false);
                      continue;
                    }
                    btn.toggleClassName("active", false);
                    let occupied = Hyprland.getWorkspace(id)?.windows > 0;
                    if (!occupied) {
                      // check for clients in the "minimized" workspace
                      const idString = id.toString();
                      for (const ws of Hyprland.workspaces) {
                        if (ws.id > 0) continue;
                        if (ws.name.match(/\d+$/)?.[0] === idString && ws.windows > 0) {
                          occupied = true;
                          break;
                        }
                      }
                    }
                    btn.toggleClassName("occupied", occupied);
                  }
                };
                self
                  .hook(
                    Hyprland.active.workspace,
                    () => {
                      const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                      if (ws?.monitorID === monitor) {
                        update(ws.id);
                      }
                    },
                    "notify::id",
                  )
                  .hook(
                    Hyprland,
                    () => {
                      const ws = Hyprland.getWorkspace(Hyprland.active.workspace.id);
                      if (ws?.monitorID === monitor) {
                        update(ws.id);
                      }
                    },
                    "notify::workspaces",
                  )
                  .hook(
                    Hyprland,
                    (_, address) => {
                      if (!address) return;
                      const wsId = Hyprland.getClient(`${address}`)?.workspace.id;
                      if (
                        !wsId ||
                        wsId === Hyprland.active.workspace.id ||
                        wsId < min ||
                        wsId > max
                      )
                        return;

                      self.children[(wsId - 1) % numWorkspaces]?.toggleClassName("urgent", true);
                    },
                    "urgent-window",
                  );

                for (const m of Hyprland.monitors) {
                  update(m.activeWorkspace.id);
                }
              },
            }),
            extraWorkspaces,
          ],
        }),
      }),
    ],
  });
};
