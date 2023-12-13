import { focusClient, getHyprlandClientIcon } from "../helpers/Misc.js";
import Mutex from "../helpers/Mutex.js";
import { Gtk, Hyprland, Variable, Widget } from "../imports.js";

const mutex = new Mutex();
const selectedIndex = Variable(1);
let clients = [];
let submap = false;
let ignoreCycle = true;

const syncClientsAndShow = async () => {
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
      ignoreCycle = true;
    })
    .catch(console.error);
};

const focusClientAndHide = async (submapName) => {
  if (submap && submapName === "") {
    submap = false;
    altTabBox.parent.visible = false;
    focusClient(clients[selectedIndex.value], true);
  }
};

Hyprland.connect("submap", (_self, submapName) => {
  if (submapName === "alttab") mutex.runExclusive(syncClientsAndShow);
  else mutex.runExclusive(focusClientAndHide, submapName);
});

const cycleNext = (isInitialPress = false) => {
  mutex.runExclusive(() => {
    if (!submap) return;
    if (ignoreCycle && isInitialPress) {
      // ignore the first press, but continuously cycle if held down.
      ignoreCycle = false;
      return;
    }
    if (selectedIndex.value >= clients.length - 1) selectedIndex.value = 0;
    else selectedIndex.value += 1;
  });
};
globalThis.cycleNext = cycleNext;

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
    onClicked: () => {
      selectedIndex.value = index;
    },
    connections: [
      [
        selectedIndex,
        (self) => {
          self.className = selectedIndex.value === index ? "selected client" : "client";
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
    minChildrenPerLine: colNum,
    maxChildrenPerLine: colNum,
    selectionMode: Gtk.SelectionMode.NONE,
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
