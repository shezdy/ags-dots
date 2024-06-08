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
  if (Hyprland.active.workspace.id)
    Hyprland.messageAsync(
      `dispatch movetoworkspacesilent special:m${Hyprland.active.workspace.id}`,
    );
}

export function restoreClient() {
  const client = Hyprland.clients.find(
    (c) => c.workspace.name === `special:m${Hyprland.active.workspace.id}`,
  );
  if (client)
    Hyprland.messageAsync(
      `dispatch movetoworkspacesilent ${Hyprland.active.workspace.id},address:${client.address}`,
    );
}

/**
 * @param {object} client  hyprland client
 * @param {boolean} cursorWarp
 */
export function focusClient(client, cursorWarp = false) {
  let cmd = "[[BATCH]]";
  if (!cursorWarp) cmd += "keyword cursor:no_warps 1;";

  if (client.workspace.id < 1) {
    const normalWS = parseInt(client.workspace.name.match(/\d+$/)[0]);
    cmd += `dispatch movetoworkspace ${normalWS},address:${client.address};`;
  } else {
    cmd += `dispatch focuswindow address:${client.address};`;
  }

  if (!cursorWarp) cmd += `"keyword cursor:no_warps 0"`;
  Hyprland.messageAsync(cmd);
}

/**
 * @param {object} client
 * @param {boolean} cursorWarp
 */
export function focusClientOrMinimize(client, cursorWarp = false) {
  let cmd = "[[BATCH]]";
  if (!cursorWarp) cmd += "keyword cursor:no_warps 1;";

  if (client.workspace.id > 0) {
    if (client.address === Hyprland.active.client.address)
      cmd += `dispatch movetoworkspacesilent special:m${client.workspace.id},address:${client.address};`;
    else cmd += `dispatch focuswindow address:${client.address};`;
  } else {
    cmd += `dispatch movetoworkspacesilent ${
      client.workspace.name.match(/\d+$/)[0] // get workspace number at the end of the special workspace name
    },address:${client.address};`;
  }

  if (!cursorWarp) cmd += "keyword cursor:no_warps 0";
  Hyprland.messageAsync(cmd);
}

/**
 * @param {object} client Hyprland client
 * @param {number} mode 1 for maximise, 0 for fullscreen
 * @param {boolean} cursorWarp
 */
export function fullscreenToggle(client, mode, cursorWarp = false) {
  let cmd = "[[BATCH]]";
  if (!cursorWarp) cmd += "keyword cursor:no_warps 1;";

  cmd += `dispatch focuswindow address:${client.address}; dispatch fullscreen ${mode};`;

  if (!cursorWarp) cmd += "keyword cursor:no_warps 0";
  Hyprland.messageAsync(cmd);
}
