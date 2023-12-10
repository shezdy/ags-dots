import icons from "../icons.js";
import { Widget } from "../imports.js";
import Brightness from "../services/Brightness.js";
import FontIcon from "../widgets/FontIcon.js";
import { Arrow, Menu } from "../widgets/ToggleButton.js";

const setBrightness = (brightness) => {
  Brightness.screens = brightness;
};

export const setButton = (brightness, text) =>
  Widget.Button({
    className: "brightness-preset",
    hexpand: true,
    onClicked: () => {
      setBrightness(brightness);
    },
    child: FontIcon(text),
  });

const BrightnessScreen = (screen) =>
  Widget.Box({
    hexpand: true,
    className: "mixer-item horizontal",
    children: [
      Widget.Icon(icons.brightness.screen),
      Widget.Box({
        vertical: true,
        children: [
          Widget.Box({
            children: [
              Widget.Label({
                xalign: 0,
                maxWidthChars: 10,
                truncate: "end",
                binds: [["label", screen, "name"]],
              }),
              Widget.Label({
                xalign: 1,
                connections: [
                  [
                    screen,
                    (l) => {
                      l.label = `${Math.floor(screen.brightness * 100)}%`;
                    },
                  ],
                ],
              }),
            ],
          }),
          Widget.Slider({
            hexpand: true,
            drawValue: false,
            roundDigits: true,
            step: 0.1,
            binds: [["value", screen, "brightness"]],
            onChange: ({ value }) => {
              screen.brightness = value;
            },
          }),
        ],
      }),
    ],
  });

export const BrightnessMixer = (screen) =>
  Menu({
    name: "brightness-mixer",
    icon: Widget.Icon(icons.brightness.indicator),
    title: Widget.Label("Screens"),
    content: [
      Widget.Box({
        vertical: true,
        className: "mixer",
        binds: [
          ["children", Brightness, "screens", (s) => s.map(BrightnessScreen)],
        ],
      }),
    ],
  });

const BrightnessIcon = () =>
  Widget.Icon({
    className: "brightness-icon",
    icon: icons.brightness.indicator,
  });

const BrightnessSlider = () =>
  Widget.Slider({
    hexpand: true,
    drawValue: false,
    roundDigits: true,
    step: 0.1,
    onChange: ({ value }) => {
      Brightness.screens = value;
    },
    binds: [["value", Brightness.screens[0], "brightness"]],
  });

export default () =>
  Widget.Box({
    vertical: false,
    children: [
      BrightnessIcon(),
      BrightnessSlider(),
      Widget.Box({
        vpack: "center",
        child: Arrow("brightness-mixer"),
        connections: [
          [
            Brightness,
            (box) => {
              box.visible = Brightness.screens.length > 1;
            },
          ],
        ],
      }),
    ],
  });
