export default {
  avatar: "/home/d/Pictures/art/b.png",
  powermenu: {
    shutdown: "systemctl poweroff",
    reboot: "systemctl reboot",
    suspend: `
    playerctl pause & 
    pkill ags
    swaylock -f -c "#141319"
    pid=$(pgrep swaylock)
    systemctl suspend
    waitpid $pid
    hyprctl dispatch exec ags`,
    lock: `
    playerctl pause
    swaylock -f -c "#141319"`,
    logout: "hyprctl dispatch exit",
  },
  transition: {
    duration: 200,
  },
  // This will be called to set brightness if the
  // Brightness service fails to find backlights via brightnessctl
  fallbackBrightnessCmd: (b) => `
  ddcutil -b 5 setvcp 10 ${b + 10} --sleep-multiplier .01 --noverify &
  ddcutil -b 6 setvcp 10 ${b}  --sleep-multiplier .01 --noverify
  ddcutil -b 6 scs --sleep-multiplier .5
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
      "vscodium",
      "bitwarden",
      "tor browser",
      "system monitor",
    ],
  },
};
