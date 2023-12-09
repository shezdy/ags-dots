import { focusClient, getHyprlandClientIcon } from "../helpers.js";
import { Gtk, Hyprland, Variable, Widget } from "../imports.js";

const selectedIndex = Variable(1);
let clients = [];
let submap = false;
let ignoreCycle = true;

const syncClientsAndShow = () => {
  // Not using Hyprland.clients because focusHistoryID will be out of date
  Hyprland.sendMessage("j/clients")
    .then((out) => {
      clients = JSON.parse(out)
        .filter((client) => client.title !== "")
        .sort((a, b) => {
          return a.focusHistoryID > b.focusHistoryID;
        });
      altTabBox.children = [AltTabFlowbox(clients, 6)];
      selectedIndex.value = 1;
      altTabBox.parent.visible = true;
      submap = true;
    })
    .catch(console.error);
};

Hyprland.connect("submap", (_, name) => {
  if (name === "alttab") syncClientsAndShow();
});

const cycleNext = () => {
  if (selectedIndex.value >= clients.length - 1) selectedIndex.value = 0;
  else selectedIndex.value += 1;
};
globalThis.cycleNext = cycleNext; // for inside the submap

// ignore the first press, but continuously cycle if held down.
// need to do it this way because if selectedIndex starts at 0 and
// the the first cycle is allowed, there is a flicker right as the layer is shown.
// there is probably a better way to fix it but this works for now.
const initialAltTab = () => {
  if (!submap) return;
  if (ignoreCycle) {
    ignoreCycle = false;
    return;
  }
  cycleNext();
};
globalThis.initialAltTab = initialAltTab; // for initial press

Hyprland.connect("submap", (_, name) => {
  if (submap && name === "") {
    submap = false;
    ignoreCycle = true;
    altTabBox.parent.visible = false;
    focusClient(clients[selectedIndex.value], true);
  }
});

const TaskBox = (client, index) => {
  return Widget.Button({
    child: Widget.Box({
      vertical: true,
      vpack: "center",
      children: [
        Widget.Icon({
          className: "icon",
          icon: getHyprlandClientIcon(client),
          size: 64,
        }),
        Widget.Label({
          className: "title",
          label: client.title,
          truncate: "end",
          lines: 2,
        }),
      ],
    }),
    connections: [
      [
        selectedIndex,
        (self) => {
          self.className =
            selectedIndex.value === index ? "selected client" : "client";
        },
      ],
    ],
    properties: [
      ["address", client.address],
      ["initialTitle", client.initialTitle],
      ["workspace", client.workspace],
    ],
  });
};

const AltTabFlowbox = (tasks, colNum) =>
  Widget.FlowBox({
    className: "app-list",
    vpack: "start",
    hpack: "start",
    min_children_per_line: colNum,
    max_children_per_line: colNum,
    selection_mode: Gtk.SelectionMode.NONE,
    setup: (self) => {
      tasks.map((task, index) => {
        self.add(TaskBox(task, index));
      });
      self.show_all();
    },
  });

const AltTabBox = () =>
  Widget.Box({
    className: "alt-tab",
  });
const altTabBox = AltTabBox();

export default () =>
  Widget.Window({
    name: "alttab",
    className: "alt-tab-window",
    layer: "overlay",
    popup: false,
    focusable: true,
    visible: false,
    child: altTabBox,
  });
