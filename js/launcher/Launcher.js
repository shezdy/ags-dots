import icons from "../icons.js";
import { App, Applications, Gdk, Gtk, Variable, Widget } from "../imports.js";
import options from "../options.js";
import PopupWindow from "../widgets/PopupWindow.js";
import AppItem from "./AppItem.js";

const WINDOW_NAME = "launcher";
const searchTerm = Variable("");

const searchBar = Widget.Entry({
  hexpand: false,
  primary_icon_name: icons.apps.search,
  setup: (self) => {
    self.grab_focus_without_selecting();
  },
  text: searchTerm.bind(),
  on_change: ({ text }) => {
    searchTerm.value = text;
  },
});

const Applauncher = () => {
  const flowbox = () =>
    Widget.FlowBox({
      className: "app-list",
      vpack: "start",
      hpack: "start",
      minChildrenPerLine: 5,
      maxChildrenPerLine: 5,
      setup: (self) => {
        self.hook(searchTerm, (self) => {
          if (searchTerm.value.length < 1) {
            self.get_child_at_index(0).get_child().grab_focus();
            self.show_all();
            return;
          }
          for (const item of self.get_children()) {
            if (item.get_child().app.match(searchTerm.value)) {
              item.visible = true;
            } else {
              item.visible = false;
            }
          }
          for (const item of self.get_children()) {
            if (item.visible) {
              item.get_child().grab_focus();
              break;
            }
          }
        });

        for (const name of options.launcher.pins) {
          const app = Applications.list.find(
            (app) => app.name.toLowerCase() === name.toLowerCase(),
          );
          if (!app) {
            console.warn(`Launcher pinned app "${name}" not found`);
            continue;
          }
          self.add(AppItem(app));
        }

        for (const app of Applications.list.sort((a, b) => {
          return a.frequency < b.frequency;
        })) {
          if (options.launcher.pins.find((name) => name.toLowerCase() === app.name.toLowerCase()))
            continue;
          self.add(AppItem(app));
        }

        // The child is a Gtk.FlowBoxChild, not the button, but we only want to focus the app button
        // which is the child of the child
        self.get_child_at_index(0).get_child().grab_focus();
        // The button is what should grab focus, so disable focus on FlowBoxChild
        self.get_children().map((child) => {
          child.can_focus = false;
        });
        self.show_all();
      },
    });

  return Widget.Box({
    vertical: true,
    className: "launcher",
    children: [
      searchBar,
      Widget.Scrollable({
        hscroll: "never",
        vscroll: "always",
        child: Applications.bind().transform(() => flowbox()),
      }),
    ],
    setup: (self) => {
      self.on("map", () => {
        searchTerm.value = "";
      });
    },
  });
};

export default () =>
  PopupWindow({
    name: WINDOW_NAME,
    transition: "none",
    layer: "overlay",
    child: Applauncher(),
    setup: (self) => {
      self.on("key-press-event", (_, event) => {
        const key = event.get_keyval()[1];
        switch (key) {
          case Gdk.KEY_downarrow:
          case Gdk.KEY_Up:
          case Gdk.KEY_Down:
          case Gdk.KEY_Left:
          case Gdk.KEY_Right:
          case Gdk.KEY_Tab:
          case Gdk.KEY_Return:
          case Gdk.KEY_Page_Up:
          case Gdk.KEY_Page_Down:
          case Gdk.KEY_Home:
          case Gdk.KEY_End:
            return false;
          default:
            if (!searchBar.is_focus) {
              searchBar.grab_focus_without_selecting();
            }
            return false;
        }
      });
      self.keybind("Escape", () => App.closeWindow(WINDOW_NAME));
    },
  });
