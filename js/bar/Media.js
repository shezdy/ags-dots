import { ASSET_DIR } from "../helpers/Misc.js";
import { Hyprland, Mpris, Widget } from "../imports.js";

const MediaBox = ({ player }) => {
  return Widget.Box({
    className: "media",
    connections: [
      [
        Mpris,
        (self) => {
          self.children = [
            Widget.Button({
              onClicked: () =>
                Hyprland.sendMessage("dispatch focuswindow Spotify"),
              className: "cover",
              child: Widget.Box({
                className: "image",
                children: [
                  Widget.Box({
                    className: "hoverbox",
                  }),
                ],
                connections: [
                  [
                    player,
                    (self) => {
                      const coverPath = player.trackCoverUrl
                        ? player.coverPath
                        : `${ASSET_DIR}/media.png`;
                      self.css = `background-image: url("${coverPath}")`;
                    },
                    "notify::cover-path",
                  ],
                ],
              }),
            }),
            Widget.Button({
              className: "text",
              onPrimaryClick: () => player?.playPause(),
              onSecondaryClick: () => player?.next(),
              onScrollUp: () => {
                player.volume += 0.05;
              },
              onScrollDown: () => {
                player.volume -= 0.05;
              },
              child: Widget.Box({
                children: [
                  Widget.Label({
                    className: "artist",
                    connections: [
                      [
                        player,
                        (self) => {
                          self.label = `${player.trackArtists.join(", ")}`;
                        },
                        "notify::track-artists",
                      ],
                    ],
                  }),
                  Widget.Label({
                    className: "title",
                    connections: [
                      [
                        player,
                        (self) => {
                          self.label = ` ${player.trackTitle}`;
                        },
                        "notify::track-title",
                      ],
                    ],
                  }),
                ],
              }),
            }),
          ];
        },
        "notify::players",
      ],
    ],
  });
};

export default () => {
  return Widget.Box({
    connections: [
      [
        Mpris,
        (self) => {
          const player = Mpris.getPlayer("spotify");
          self.visible = player;
          // mpris player can be undefined
          if (!player) return;
          self.children = [MediaBox({ player })];
        },
        "notify::players",
      ],
    ],
  });
};
