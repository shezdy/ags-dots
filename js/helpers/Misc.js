import icons from "../icons.js";
import { Applications, Hyprland, Utils } from "../imports.js";

export function execSh(cmd) {
  Utils.execAsync(["sh", "-c", `${cmd}`]).catch((error) => console.error(`execSh error: ${error}`));
}

export function execBash(cmd) {
  Utils.execAsync(["bash", "-c", `${cmd}`]).catch((error) =>
    console.error(`execBash error: ${error}`),
  );
}

export function launchApp(app) {
  Hyprland.messageAsync(`dispatch exec gio launch ${app.app.filename}`);
  app.frequency++;
}

/**
 * @param {object} client hyprland client
 * @returns client icon or fallback icon
 */
export function getHyprlandClientIcon(client) {
  let icon = Applications.query(client.initialClass)[0]?.iconName;
  if (!icon) {
    icon = Applications.query(client.initialTitle)[0]?.iconName;
  }
  return Utils.lookUpIcon(icon) ? icon : icons.apps.fallback;
}

export function minimizeFocused() {
  try {
    const out = Hyprland.message("j/activewindow");
    const client = JSON.parse(out);
    if (client.workspace.id > 0)
      Hyprland.messageAsync(`dispatch movetoworkspacesilent special:m${client.workspace.id}`);
  } catch (e) {
    console.error(e);
  }
}
// global so it can be called from hyprland keybinds
globalThis.minimizeFocused = minimizeFocused;

export function restoreClient() {
  try {
    const out = Hyprland.message("j/activeworkspace");
    const id = JSON.parse(out).id;
    const client = Hyprland.clients.find((c) => c.workspace.name === `special:m${id}`);
    if (client)
      Hyprland.messageAsync(`dispatch movetoworkspacesilent ${id},address:${client.address}`);
  } catch (e) {
    console.error(e);
  }
}
// global so it can be called from hyprland keybinds
globalThis.restoreClient = restoreClient;

/**
 * @param {object} client  hyprland client
 * @param {boolean} cursorWarp
 */
export function focusClient(client, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps true");
  }

  if (client.workspace.id < 1) {
    const normalWS = parseInt(client.workspace.name.match(/\d+$/)[0]);
    Hyprland.messageAsync(`dispatch movetoworkspace ${normalWS},address:${client.address}`);
  } else {
    Hyprland.messageAsync(`dispatch focuswindow address:${client.address}`);
  }

  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps false");
  }
}

/**
 * @param {object} client
 * @param {boolean} cursorWarp
 */
export function focusClientOrMinimize(client, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps true");
  }

  if (client.workspace.id > 0) {
    if (client.address === Hyprland.active.client.address)
      Hyprland.messageAsync(
        `dispatch movetoworkspacesilent special:m${client.workspace.id},address:${client.address}`,
      );
    else {
      Hyprland.messageAsync(`dispatch focuswindow address:${client.address}`);
    }
  } else {
    Hyprland.messageAsync(
      `dispatch movetoworkspacesilent ${
        client.workspace.name.match(/\d+$/)[0] // get workspace number at the end of the special workspace name
      },address:${client.address}`,
    );
  }

  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps false");
  }
}

/**
 * @param {object} client Hyprland client
 * @param {number} mode 1 for maximise, 0 for fullscreen
 * @param {boolean} cursorWarp
 */
export function fullscreenToggle(client, mode, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps true");
  }
  Hyprland.messageAsync(`dispatch focuswindow address:${client.address}`);
  Hyprland.messageAsync(`dispatch fullscreen ${mode}`);
  if (!cursorWarp) {
    Hyprland.messageAsync("keyword cursor:no_warps false");
  }
}
