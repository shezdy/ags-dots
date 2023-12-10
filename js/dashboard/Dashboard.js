import { Widget } from "../imports.js";
import Brightness from "../services/Brightness.js";
import PopupWindow from "../widgets/PopupWindow.js";
import BrightnessSliderRow, { BrightnessMixer } from "./BrightnessSettings.js";
import Header from "./Header.js";
import NotificationCenter from "./NotificationCenter.js";
import QuickTiles from "./QuickTiles.js";
import {
  AppMixer,
  MicrophoneSliderRow,
  SinkSelector,
  SourceSelector,
  VolumeSliderRow,
} from "./VolumeSettings.js";

export const Row = (children = [], menus = [], ...props) =>
  Widget.Box({
    vertical: true,
    children: [
      Widget.Box({
        className: "row horizontal",
        children,
      }),
      ...menus,
    ],
    ...props,
  });

const sliderRows = [
  Row([VolumeSliderRow()], [SinkSelector(), AppMixer()]),
  Row([MicrophoneSliderRow()], [SourceSelector()]),
];

const Dashboard = () =>
  Widget.Box({
    vertical: true,
    homogeneous: false,
    vpack: "fill",
    className: "dashboard",
    children: [
      Header(),
      Widget.Separator(),
      Widget.Box({
        className: "quick-settings",
        vertical: true,
        children: [
          QuickTiles(),
          Widget.Box({
            className: "sliders-box vertical",
            vertical: true,
            setup: (self) => {
              if (Brightness.screens) {
                sliderRows.push(
                  Row([BrightnessSliderRow()], [BrightnessMixer()])
                );
              }
              self.children = sliderRows;
            },
          }),
        ],
      }),
      Widget.Box({
        vertical: true,
        hpack: "end",
        children: [Widget.Separator(), NotificationCenter()],
      }),
      Widget.Separator(),
      Widget.Box({
        className: "calendar",
        children: [
          Widget.Calendar({
            hexpand: true,
            hpack: "center",
          }),
        ],
      }),
    ],
  });

export default () =>
  PopupWindow({
    name: "dashboard",
    transition: "slide_left",
    anchor: ["top", "right", "bottom"],
    child: Dashboard(),
  });
