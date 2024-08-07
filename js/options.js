import { Utils } from "./imports.js";

export default {
  avatar: `/var/lib/AccountsService/icons/${Utils.USER}`,
  mpris: {
    // the special name "%any" can be used to match any player not on the list
    // players listed earlier will have more priority, so for example:
    // ["spotify, "%any", "firefox"]
    // will prioritize spotify and deprioritize firefox
    whitelist: ["spotify"],
    // players listed here will be ignored
    blacklist: [],
  },
  powermenu: {
    shutdown: "systemctl poweroff",
    reboot: "systemctl reboot",
    suspend: `
    playerctl -a pause & 
    ags -q &
    hyprlock &
    pid=$!
    sleep 0.1
    systemctl suspend
    waitpid $pid
    hyprctl dispatch exec ags`,
    lock: `
    playerctl -a pause
    hyprlock`,
    logout: "hyprctl dispatch exit",
  },
  transition: {
    duration: 200,
  },
  // This will be called to set brightness if the
  // Brightness service fails to find backlights via brightnessctl
  fallbackBrightnessCmd: (b) => `
  ddcutil -b 5 setvcp 10 ${b + 10} --sleep-multiplier 0 --noverify &
  ddcutil -b 6 setvcp 10 ${b}  --sleep-multiplier 0 --noverify
  `,
  launcher: {
    pins: [
      "dolphin",
      "spotify",
      "webcord",
      "firefox web browser",
      "librewolf",
      "brave",
      "krita",
      "steam (runtime)",
      "joplin",
      "freetube",
      "localsend",
      "vscodium - wayland",
      "bitwarden",
      "tor browser",
      "qalculate! (qt)",
    ],
  },
  nightlight: {
    // requires wl-gammarelay-rs
    on: "19:30",
    off: "6:00",
    temp: "3500",
  },
};
