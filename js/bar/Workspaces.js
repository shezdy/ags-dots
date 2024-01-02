import { Hyprland, Widget } from "../imports.js";

export default (monitor) => {
  return Widget.Box({
    className: "workspaces",
    children: [
      Widget.EventBox({
        className: "eventbox",
        child: Widget.Box({
          homogeneous: true,
          className: "ws-box",
          children: Array.from({ length: 6 }, (_, i) => i + 1 + monitor * 6).map((i) =>
            Widget.Button({
              onClicked: () => Hyprland.sendMessage(`dispatch workspace ${i}`),
              onSecondaryClick: () => Hyprland.sendMessage(`dispatch movetoworkspacesilent ${i}`),
              child: Widget.Box({
                className: "box",
                hpack: "center",
              }),
            }),
          ),
          setup: (self) => {
            self.hook(
              Hyprland,
              (box) => {
                for (const [i, btn] of box.children.entries()) {
                  const id = i + 1 + monitor * 6;
                  btn.toggleClassName(
                    "active",
                    Hyprland.getMonitor(monitor)?.activeWorkspace.id === id,
                  );
                  let occupied = Hyprland.getWorkspace(id)?.windows > 0;
                  if (!occupied) {
                    // check for clients in the "minimized" workspace
                    for (const ws of Hyprland.workspaces) {
                      if (ws.id > 0) continue;
                      if (ws.name.match(/\d+$/)[0] === id.toString()) {
                        occupied = true;
                        break;
                      }
                    }
                  }
                  btn.toggleClassName("occupied", occupied);
                }
              },
              "notify::monitors",
            );
          },
        }),
      }),
    ],
  });
};
