import { App, Hyprland, Mpris, Widget } from "../imports.js";
import options from "../options.js";

Mpris.cacheCoverArt = true;

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
          Hyprland.messageAsync(`dispatch focuswindow ${regex}`);
        },
        className: "cover",
        child: Widget.Box({
          className: "image",
          children: [
            Widget.Icon({
              icon: "sparkle-symbolic",
            }),
          ],
          setup: (self) => {
            self
              .hook(
                player,
                (self) => {
                  self.children[0].visible = false;
                  self.css = `background-image: url("${player.coverPath}")`;
                },
                "notify::cover-path",
              )
              .hook(
                player,
                (self) => {
                  if (player.trackCoverUrl === "" || !Mpris.cacheCoverArt) {
                    self.children[0].visible = true;
                    self.css = "background-image: none";
                  }
                },
                "notify::track-cover-url",
              );
          },
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
              label: player.bind("track-artists").transform((list) => {
                const artists = list.join(", ");
                if (!artists || artists === "Unknown artist") {
                  return `${player.name} `;
                }
                if (artists.length > 40) return `${artists.slice(0, 37)}... `;
                return `${artists} `;
              }),
            }),
            Widget.Label({
              className: "title",
              label: player.bind("track-title").transform((title) => {
                if (title.length > 40) return `${title.slice(0, 37)}...`;
                return title;
              }),
            }),
          ],
        }),
      }),
    ],
  });
};

export default () => {
  return Widget.Box({
    setup: (self) => {
      self.hook(
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
      );
    },
  });
};
