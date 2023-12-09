import icons from "../icons.js";
import { App, Hyprland } from "../imports.js";
import FontIcon from "../misc/FontIcon.js";
import { Arrow } from "./ToggleButton.js";
import { Menu } from "./ToggleButton.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

/** @param {string} icon */
function getAudioTypeIcon(icon) {
  const substitues = [
    ["audio-headset-bluetooth", icons.audio.type.headphones],
    ["audio-card-analog-usb", icons.audio.type.speaker],
    ["audio-card-analog-pci", icons.audio.type.headphones],
    ["audio-input-microphone", icons.audio.mic.high],
    ["audio-input-microphone-analog-usb", icons.audio.mic.high],
  ];

  for (const [from, to] of substitues) {
    if (from === icon) return to;
  }

  return icons.audio.type.speaker;
}

/** @param {'speaker' | 'microphone'=} type */
const VolumeIndicator = (type = "speaker") =>
  Widget.Button({
    onClicked: () => {
      if (Audio[type]) Audio[type].is_muted = !Audio[type].is_muted;
    },
    child: Widget.Icon({
      connections: [
        [
          Audio,
          (icon) => {
            if (!Audio[type]) {
              if (type === "speaker") icon.icon = icons.audio.type.headphones;
              else icon.icon = icons.audio.mic.high;
              return;
            }

            icon.icon =
              type === "speaker"
                ? getAudioTypeIcon(Audio[type]?.icon_name || "")
                : icons.audio.mic.high;

            icon.tooltipText = `Volume ${Math.floor(
              Audio[type].volume * 100
            )}%`;
          },
          `${type}-changed`,
        ],
      ],
    }),
  });

/** @param {'speaker' | 'microphone'=} type */
const VolumeSlider = (type = "speaker") =>
  Widget.Slider({
    hexpand: true,
    drawValue: false,
    onChange: ({ value }) => {
      if (Audio[type]) Audio[type].volume = value;
    },
    connections: [
      [
        Audio,
        (slider) => {
          if (Audio[type]) slider.value = Audio[type].volume;
          else slider.value = 0;
        },
        `${type}-changed`,
      ],
    ],
  });

export const VolumeSliderRow = () =>
  Widget.Box({
    children: [
      VolumeIndicator("speaker"),
      VolumeSlider("speaker"),
      Widget.Box({
        vpack: "center",
        child: Arrow("app-mixer"),
        connections: [
          [
            Audio,
            (box) => {
              box.visible = Audio.apps.length > 0;
            },
          ],
        ],
      }),
      Widget.Box({
        vpack: "center",
        child: Arrow("sink-selector"),
      }),
    ],
  });

export const MicrophoneSliderRow = () =>
  Widget.Box({
    binds: [["visible", Audio, "microphones", (r) => r.length > 0]],
    children: [
      VolumeIndicator("microphone"),
      VolumeSlider("microphone"),
      Widget.Box({
        vpack: "center",
        child: Arrow("source-selector"),
      }),
    ],
  });

/** @param {import('types/service/audio').Stream} stream */
const MixerItem = (stream) =>
  Widget.Box({
    hexpand: true,
    className: "mixer-item horizontal",
    children: [
      Widget.Icon({
        binds: [["tooltipText", stream, "name"]],
        connections: [
          [
            stream,
            (icon) => {
              icon.icon = Utils.lookUpIcon(stream.name || "")
                ? stream.name || ""
                : icons.mpris.fallback;
            },
          ],
        ],
      }),
      Widget.Box({
        vertical: true,
        children: [
          Widget.Label({
            xalign: 0,
            maxWidthChars: 10,
            truncate: "end",
            binds: [["label", stream, "description"]],
          }),
          Widget.Slider({
            hexpand: true,
            drawValue: false,
            binds: [["value", stream, "volume"]],
            onChange: ({ value }) => {
              stream.volume = value;
            },
          }),
        ],
      }),
      Widget.Label({
        xalign: 1,
        connections: [
          [
            stream,
            (l) => {
              l.label = `${Math.floor(stream.volume * 100)}%`;
            },
          ],
        ],
      }),
    ],
  });

/** @param {import('types/service/audio').Stream} stream */
const DeviceItem = (stream, isSink = true) =>
  Widget.Button({
    hexpand: true,
    onClicked: () => {
      if (isSink) Audio.speaker = stream;
      else Audio.microphone = stream;
    },
    binds: [
      [
        "className",
        Audio,
        isSink ? "speaker" : "microphone",
        (s) => (s === stream ? "selected" : ""),
      ],
    ],
    child: Widget.Box({
      children: [
        Widget.Icon({
          icon: getAudioTypeIcon(stream.icon_name || ""),
          tooltipText: stream.icon_name,
        }),
        Widget.Label({
          label: (stream.description || "").split(" ").slice(0, 4).join(" "),
          truncate: "end",
        }),
      ],
    }),
  });

const SettingsButton = () =>
  Widget.Button({
    onClicked: () => {
      App.closeWindow("dashboard");
      Hyprland.sendMessage("dispatch exec pavucontrol");
    },
    hexpand: true,
    child: Widget.Box({
      children: [Widget.Icon(icons.settings), Widget.Label("Settings")],
    }),
  });

export const AppMixer = () =>
  Menu({
    name: "app-mixer",
    icon: FontIcon(icons.audio.mixer),
    title: Widget.Label("Application Mixer"),
    content: [
      Widget.Box({
        vertical: true,
        className: "mixer",
        binds: [["children", Audio, "apps", (a) => a.map(MixerItem)]],
      }),
      Widget.Separator(),
      SettingsButton(),
    ],
  });

export const SinkSelector = () =>
  Menu({
    name: "sink-selector",
    icon: Widget.Icon(icons.audio.generic),
    title: Widget.Label("Sinks"),
    content: [
      Widget.Box({
        vertical: true,
        binds: [
          [
            "children",
            Audio,
            "speakers",
            (s) => s.map((s) => DeviceItem(s, true)),
          ],
        ],
      }),
      Widget.Separator(),
      SettingsButton(),
    ],
  });

export const SourceSelector = () =>
  Menu({
    name: "source-selector",
    icon: Widget.Icon(icons.audio.mic.high),
    title: Widget.Label("Sources"),
    content: [
      Widget.Box({
        vertical: true,
        binds: [
          [
            "children",
            Audio,
            "microphones",
            (s) => s.map((s) => DeviceItem(s, false)),
          ],
        ],
      }),
      Widget.Separator(),
      Widget.Button({
        onClicked: () => {
          App.closeWindow("dashboard");
          Hyprland.sendMessage("dispatch exec noisetorch");
        },
        hexpand: true,
        child: Widget.Box({
          children: [
            Widget.Icon(icons.audio.generic),
            Widget.Label("NoiseTorch"),
          ],
        }),
      }),
      SettingsButton(),
    ],
  });
