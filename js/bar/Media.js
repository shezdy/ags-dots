import { ASSET_DIR } from "../helpers/Misc.js";
import { App, Hyprland, Mpris, Widget } from "../imports.js";
import options from "../options.js";

const getPlayer = () => {
  const playerList = Mpris.players;
  if (playerList.length === 0) return null;

  const playerSet = new Set();
  for (const whitelistName of options.mpris.whitelist) {
    if (whitelistName === "%any") {
      // add all players, ignoring ones in the blacklist
      for (const player of playerList) {
        if (!options.mpris.blacklist.includes(player.name)) playerSet.add(player);
      }
      continue;
    }

    for (const player of playerList) {
      if (player.name === whitelistName) {
        playerSet.delete(player);
        playerSet.add(player);
      }
    }
  }
  return playerSet.values().next().value;
};

const MediaBox = (player) => {
  return Widget.Box({
    className: "media",
    children: [
      Widget.Button({
        onClicked: () => {
          const name = player.name;
          if (!name || name.length === 0) return;
          const regex = `[${name[0].toUpperCase()}${name[0].toLowerCase()}]${name.slice(1)}`;
          Hyprland.sendMessage(`dispatch focuswindow ${regex}`);
        },
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
                self.css = `background-image: url("${player.coverPath}")`;
              },
              "notify::cover-path",
            ],
            [
              player,
              (self) => {
                if (player.trackCoverUrl === "" || !App.config.cacheCoverArt)
                  self.css = `background-image: url("${ASSET_DIR}/media.png")`;
              },
              "notify::track-cover-url",
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
                    const artists = player.trackArtists.join(", ");
                    if (!artists || artists === "Unknown artist") {
                      self.label = `${player.name} `;
                    } else {
                      if (artists.length > 40) self.label = `${artists.slice(0, 37)}... `;
                      else self.label = `${artists} `;
                    }
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
                    const title = player.trackTitle;
                    if (title.length > 40) self.label = `${title.slice(0, 37)}...`;
                    else self.label = `${title}`;
                  },
                  "notify::track-title",
                ],
              ],
            }),
          ],
        }),
      }),
    ],
  });
};

export default () => {
  return Widget.Box({
    connections: [
      [
        Mpris,
        (self) => {
          const player = getPlayer();
          if (!player) {
            self.visible = false;
            return;
          }
          self.children = [MediaBox(player)];
        },
        "notify::players",
      ],
    ],
  });
};
