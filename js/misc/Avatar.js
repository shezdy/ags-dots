import options from "../options.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

/** @param {import('types/widgets/box').BoxProps=} props */
export default (props) =>
  Widget.Box({
    ...props,
    className: "avatar",
    css: `
    background-image: url("${options.avatar}");
    background-size: cover;
`,
    connections: [
      [
        "draw",
        (box) => {
          const h = box.get_allocated_height();
          box.set_size_request(h, -1);
        },
      ],
    ],
  });
