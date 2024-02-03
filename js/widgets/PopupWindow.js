import { App, Widget } from "../imports.js";
import options from "../options.js";
import GObject from "gi://GObject";
import AgsWindow from "resource:///com/github/Aylur/ags/widgets/window.js";

class PopupWindow extends AgsWindow {
  static {
    GObject.registerClass(PopupWindow);
  }

  /** @param {import('types/widgets/window').WindowProps & {
   *      name: string
   *      child: import('types/widgets/box').default
   *      transition?: import('types/widgets/revealer').RevealerProps['transition']
   *  }} o
   */
  constructor({ name, child, transition = "none", visible = false, ...rest }) {
    super({
      ...rest,
      name,
      popup: true,
      keymode: "exclusive",
      classNames: ["popup-window", name],
    });

    child.toggleClassName("window-content");
    this.revealer = Widget.Revealer({
      transition,
      child,
      transitionDuration: options.transition.duration,
      className: "revealer",
      setup: (self) => {
        self.hook(
          App,
          (_, wname, visible) => {
            if (wname === name) this.revealer.revealChild = visible;
          },
          "window-toggled",
        );
      },
    });

    this.child = Widget.Box({
      css: "padding: 1px;",
      child: this.revealer,
    });

    this.show_all();
    this.visible = visible;
  }

  set transition(dir) {
    this.revealer.transition = dir;
  }
  get transition() {
    return this.revealer.transition;
  }
}

/** @param {import('types/widgets/window').WindowProps & {
 *      name: string
 *      child: import('types/widgets/box').default
 *      transition?: import('types/widgets/revealer').RevealerProps['transition']
 *  }} config
 */
export default (config) => new PopupWindow(config);
