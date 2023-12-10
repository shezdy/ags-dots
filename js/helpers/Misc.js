import icons from "../icons.js";
import { App, Applications, Hyprland, Utils } from "../imports.js";

export const ASSET_DIR = `${App.configDir}/assets`;

export function execSh(cmd) {
  Utils.execAsync(["sh", "-c", `${cmd}`]).catch((error) =>
    console.error(`execSh error: ${error}`)
  );
}

export function execBash(cmd) {
  Utils.execAsync(["bash", "-c", `${cmd}`]).catch((error) =>
    console.error(`execBash error: ${error}`)
  );
}

export function launchApp(app) {
  Hyprland.sendMessage(`dispatch exec gtk-launch ${app.desktop}`);
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
  Hyprland.sendMessage("j/activewindow").then((out) => {
    const client = JSON.parse(out);
    if (client.workspace.id > 0)
      Hyprland.sendMessage(
        `dispatch movetoworkspacesilent special:m${client.workspace.id}`
      );
  });
}
// global so it can be called from hyprland keybinds
globalThis.minimizeFocused = minimizeFocused;

export function restoreClient() {
  Hyprland.sendMessage("j/activeworkspace")
    .then((out) => {
      const id = JSON.parse(out).id;
      const client = Hyprland.clients.find(
        (c) => c.workspace.name === `special:m${id}`
      );
      if (client) {
        Hyprland.sendMessage(
          `dispatch movetoworkspacesilent ${id},address:${client.address}`
        );
      }
    })
    .catch(console.error);
}
// global so it can be called from hyprland keybinds
globalThis.restoreClient = restoreClient;

/**
 * @param {object} client  hyprland client
 * @param {boolean} cursorWarp
 */
export function focusClient(client, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps true");
  }
  // TODO: add case for when the window is minimized AND the workspace is in fullscreen mode
  if (client.workspace.id < 1) {
    Hyprland.sendMessage(
      `dispatch movetoworkspace ${
        client.workspace.name.match(/\d+$/)[0] // match a number at the end of the workspace name
      },address:${client.address}`
    );
  } else if (Hyprland.getWorkspace(client.workspace.id).hasfullscreen) {
    // if there is a fs window on the workspace it needs to become the new fs window
    const fsClient = Hyprland.clients.find(
      (c) => c.workspace.id === client.workspace.id && c.fullscreen === true
    );
    if (fsClient && fsClient.address !== client.address) {
      const mode = fsClient.fullscreenMode;
      Hyprland.sendMessage(`dispatch focuswindow address:${fsClient.address}`);
      Hyprland.sendMessage("dispatch fullscreen 0");
      Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
      Hyprland.sendMessage(`dispatch fullscreen ${mode}`);
    } else {
      Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
    }
  } else {
    Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
    if (client.floating === true) {
      Hyprland.sendMessage(
        `dispatch alterzorder top,address:${client.address}`
      );
    }
  }
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps false");
  }
}

/**
 * @param {object} client
 * @param {boolean} cursorWarp
 */
export function focusClientOrMinimize(client, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps true");
  }
  if (client.workspace.id > 0) {
    if (client.address === Hyprland.active.client.address)
      Hyprland.sendMessage(
        `dispatch movetoworkspacesilent special:m${client.workspace.id},address:${client.address}`
      );
    else if (Hyprland.getWorkspace(client.workspace.id).hasfullscreen) {
      const fsClient = Hyprland.clients.find(
        (c) => c.workspace.id === client.workspace.id && c.fullscreen === true
      );
      if (fsClient) {
        const mode = fsClient.fullscreenMode;
        Hyprland.sendMessage(
          `dispatch focuswindow address:${fsClient.address}`
        );
        Hyprland.sendMessage("dispatch fullscreen");
        Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
        Hyprland.sendMessage(`dispatch fullscreen ${mode}`);
      }
    } else {
      Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
      if (client.floating === true) {
        Hyprland.sendMessage(
          `dispatch alterzorder top,address:${client.address}`
        );
      }
    }
  } else {
    Hyprland.sendMessage(
      `dispatch movetoworkspacesilent ${
        client.workspace.name.match(/\d+$/)[0] // get workspace number at the end of the special workspace name
      },address:${client.address}`
    );
  }
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps false");
  }
}

/**
 * @param {object} client Hyprland client
 * @param {number} mode 1 for maximise, 0 for fullscreen
 * @param {boolean} cursorWarp
 */
export function fullscreenToggle(client, mode, cursorWarp = false) {
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps true");
  }
  Hyprland.sendMessage(`dispatch focuswindow address:${client.address}`);
  Hyprland.sendMessage(`dispatch fullscreen ${mode}`);
  if (!cursorWarp) {
    Hyprland.sendMessage("keyword general:no_cursor_warps false");
  }
}
