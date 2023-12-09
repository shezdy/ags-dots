import { Audio, Hyprland, Widget } from "../imports.js";

export default () =>
  Widget.Button({
    className: "volume",
    onPrimaryClick: () => {
      Audio.speaker.stream.isMuted = !Audio.speaker.stream.isMuted;
    },
    onSecondaryClick: () => Hyprland.sendMessage("dispatch exec pavucontrol"),
    onScrollUp: () => {
      Audio.speaker.volume += 0.05;
    },
    onScrollDown: () => {
      Audio.speaker.volume -= 0.05;
    },
    child: Widget.Box({
      vpack: "center",
      children: [
        Widget.Icon({
          // size: 13,
          className: "icon",
          connections: [
            [
              Audio,
              (self) => {
                if (!Audio.speaker) return;
                const vol = Audio.speaker.volume * 100;
                const icon = [
                  [101, "overamplified"],
                  [35, "high"],
                  [1, "medium"],
                  [0, "muted"],
                ].find(([threshold]) => threshold <= vol)[1];

                self.icon = `audio-volume-${icon}-symbolic`;
                self.tooltipText = `Volume ${Math.floor(vol)}%`;
              },
              "speaker-changed",
            ],
          ],
        }),
        Widget.Label({
          className: "label",
          connections: [
            [
              Audio,
              (self) => {
                if (!Audio.speaker) return;
                const vol = Math.ceil(Audio.speaker.volume * 100);
                // if (vol <= 0) self.label = "󰖁 ";
                // else if (vol < 10) self.label = `󰕾 0${vol}%`;
                // else if (vol < 100) self.label = `󰕾 ${vol}%`;
                // else self.label = `󰕾 ${vol}`;
                if (vol <= 0 || Audio.speaker.stream.isMuted)
                  self.label = "---";
                else if (vol < 10) self.label = `0${vol}%`;
                else if (vol < 100) self.label = `${vol}%`;
                else self.label = `${vol}`;
              },
              "speaker-changed",
            ],
          ],
        }),
      ],
    }),
  });
