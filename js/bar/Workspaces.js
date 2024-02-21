import { Hyprland, Widget } from "../imports.js";

const numWorkspaces = 6;

export default (monitor) => {
  // when disconnecting monitors hyprland will dump workspaces onto another monitor
  // so sometimes there will be extras that need to be displayed
  const extraWorkspaces = Widget.Box({});

  const min = monitor * numWorkspaces + 1;
  const max = monitor * numWorkspaces + numWorkspaces;

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
                const update = (box) => {
                  for (const [i, btn] of box.children.entries()) {
                    const id = i + min;
                    btn.toggleClassName(
                      "active",
                      Hyprland.getMonitor(monitor)?.activeWorkspace.id === id,
                    );
                    let occupied = Hyprland.getWorkspace(id)?.windows > 0;
                    if (!occupied) {
                      // check for clients in the "minimized" workspace
                      for (const ws of Hyprland.workspaces) {
                        if (ws.id > 0) continue;
                        if (ws.name.match(/\d+$/)[0] === id.toString() && ws.windows > 0) {
                          occupied = true;
                          break;
                        }
                      }
                    }
                    // if (id === 10) {
                    //   print(`${id} ${occupied}`);
                    //   print(Hyprland.getWorkspace(id)?.windows > 0);
                    // }
                    btn.toggleClassName("occupied", occupied);
                  }

                  const extras = [];
                  for (const ws of Hyprland.workspaces) {
                    if (ws.monitorID !== monitor) continue;

                    const id = ws.id;

                    if ((id < min && id > 0) || id > max) {
                      extras.push(
                        Widget.Button({
                          className: "extra-button",
                          onClicked: () =>
                            Hyprland.messageAsync(`dispatch focusworkspaceoncurrentmonitor ${id}`),
                          onSecondaryClick: () =>
                            Hyprland.messageAsync(`dispatch movetoworkspacesilent ${id}`),
                          child: Widget.Label({
                            label: ws.name,
                          }),
                          setup: (self) => {
                            self
                              .hook(
                                Hyprland,
                                () => {
                                  self.toggleClassName(
                                    "active",
                                    Hyprland.getMonitor(monitor)?.activeWorkspace.id === id,
                                  );
                                },
                                "notify::monitors",
                              )
                              .hook(
                                Hyprland,
                                () => {
                                  self.toggleClassName(
                                    "active",
                                    Hyprland.getMonitor(monitor)?.activeWorkspace.id === id,
                                  );
                                },
                                "notify::workspaces",
                              );
                          },
                        }),
                      );
                    }
                  }
                  extraWorkspaces.children = extras;
                };
                self
                  .hook(Hyprland, update, "notify::monitors")
                  .hook(Hyprland, update, "notify::workspaces");
              },
            }),
            extraWorkspaces,
          ],
        }),
      }),
    ],
  });
};
