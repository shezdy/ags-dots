export default {
  settings: "emblem-system-symbolic",
  tick: "object-select-symbolic",
  lock: "system-lock-screen-symbolic",
  audio: {
    mic: {
      muted: "microphone-disabled-symbolic",
      low: "microphone-sensitivity-low-symbolic",
      medium: "microphone-sensitivity-medium-symbolic",
      high: "microphone-sensitivity-high-symbolic",
    },
    volume: {
      muted: "audio-volume-muted-symbolic",
      low: "audio-volume-low-symbolic",
      medium: "audio-volume-medium-symbolic",
      high: "audio-volume-high-symbolic",
      overamplified: "audio-volume-overamplified-symbolic",
    },
    type: {
      headset: "audio-headset-symbolic",
      headphones: "audio-headphones-symbolic",
      speaker: "audio-speakers-symbolic",
      card: "audio-card-symbolic",
    },
    mixer: "",
    generic: "audio-x-generic-symbolic",
  },
  powermode: {
    profile: {
      Balanced: "power-profile-balanced-symbolic",
      Quiet: "power-profile-power-saver-symbolic",
      Performance: "power-profile-performance-symbolic",
    },
    mode: {
      Integrated: "",
      Hybrid: "󰢮",
    },
  },
  apps: {
    grid: "view-app-grid-symbolic",
    fallback: "application-x-executable",
    search: "folder-saved-search-symbolic",
  },
  battery: {
    charging: "󱐋",
    warning: "battery-empty-symbolic",
  },
  bluetooth: {
    enabled: "bluetooth-active-symbolic",
    disabled: "bluetooth-disabled-symbolic",
  },
  brightness: {
    indicator: "display-brightness-symbolic",
    keyboard: "keyboard-brightness-symbolic",
    screen: "video-display-symbolic",
    high: "󰃠",
    medium: "󰃟",
    low: "󰃞",
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    // reboot: "system-reboot-symbolic",
    reboot: "emblem-synchronizing-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic",
  },
  recorder: {
    recording: "media-record-symbolic",
  },
  notifications: {
    noisy: "preferences-system-notifications-symbolic",
    silent: "notifications-disabled-symbolic",
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic",
  },
  mpris: {
    fallback: "audio-x-generic-symbolic",
    shuffle: {
      enabled: "󰒟",
      disabled: "󰒟",
    },
    loop: {
      none: "󰓦",
      track: "󰓦",
      playlist: "󰑐",
    },
    playing: "󰏦",
    paused: "󰐍",
    stopped: "󰐍",
    prev: "󰒮",
    next: "󰒭",
  },
  ui: {
    arrow: {
      right: "pan-end-symbolic",
      left: "pan-start-symbolic",
      down: "pan-down-symbolic",
      up: "pan-up-symbolic",
    },
    go: {
      next: "go-next-symbolic",
      back: "go-previous-symbolic",
      down: "go-down-symbolic",
      up: "go-up-symbolic",
    },
  },
  system: {
    cpu: "org.gnome.SystemMonitor-symbolic",
    ram: "drive-harddisk-solidstate-symbolic",
    temp: "temperature-symbolic",
  },
  network: {
    wired: {
      connected: "network-wired-symbolic",
      portal: "network-wired-acquiring-symbolic",
      limited: "network-wired-no-route-symbolic",
      disconnected: "network-wired-acquiring-symbolic",
    },
  },
};
