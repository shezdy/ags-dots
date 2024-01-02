import icons from "../icons.js";
import { Utils, Variable, Widget } from "../imports.js";
import options from "../options.js";

const Arrow = (revealer, direction, items) => {
  let deg = 0;

  const icon = Widget.Icon({
    icon: icons.ui.arrow[direction],
  });

  const animate = () => {
    const t = options.transition.duration / 20;
    const step = revealer.revealChild ? 10 : -10;
    for (let i = 0; i < 18; ++i) {
      Utils.timeout(t * i, () => {
        deg += step;
        icon.setCss(`-gtk-icon-transform: rotate(${deg}deg);`);
      });
    }
  };

  return Widget.Button({
    className: "submenu",
    vpack: "center",
    hpack: "center",
    tooltipText: items.bind().transform((v) => `${v} Items`),
    onClicked: () => {
      animate();
      revealer.revealChild = !revealer.revealChild;
    },
    child: icon,
  });
};

export default ({ children, direction = "left", items = Variable(0) }) => {
  const posStart = direction === "up" || direction === "left";
  const posEnd = direction === "down" || direction === "right";
  const revealer = Widget.Revealer({
    transition: `slide_${direction}`,
    child: Widget.Box({
      children,
    }),
  });

  return Widget.Box({
    vertical: direction === "up" || direction === "down",
    children: [posStart && revealer, Arrow(revealer, direction, items), posEnd && revealer],
  });
};
