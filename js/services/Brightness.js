import { execSh } from "../helpers/Misc.js";
import options from "../options.js";
import Service from "resource:///com/github/Aylur/ags/service.js";
import * as Utils from "resource:///com/github/Aylur/ags/utils.js";

class Screen extends Service {
  static {
    Service.register(
      Screen,
      {},
      {
        name: ["string", "rw"],
        brightness: ["float", "rw"],
      }
    );
  }

  #name = "";
  #brightness = 0;

  get name() {
    return this.#name;
  }

  get brightness() {
    return this.#brightness;
  }

  set brightness(p) {
    let percent = p;
    if (p < 0) percent = 0;

    if (p > 1) percent = 1;

    Utils.execAsync(`brightnessctl s ${percent * 100}% -d ${this.#name} -q`)
      .then(() => {
        this.#brightness = percent;
        this.notify("brightness");
        this.emit("changed");
      })
      .catch(console.error);
  }

  constructor(name, brightness) {
    super();
    this.#name = name;
    this.#brightness = brightness;
  }
}

class Brightness extends Service {
  static {
    Service.register(
      Brightness,
      {},
      {
        screens: ["jsobject", "rw"],
      }
    );
  }

  #screens;

  async #syncScreens() {
    try {
      Utils.execAsync("brightnessctl --class=backlight -l -m")
        .then((out) => {
          for (const screen of out.split("\n")) {
            const info = screen.split(",");
            if (!this.#screens.get(info[0]))
              this.#screens.set(
                info[0],
                new Screen(info[0], info[2] / info[4])
              );
          }
        })
        .catch(console.error);
    } catch (error) {
      console.error(`Error syncing screens: ${error}`);
    }
  }

  get screens() {
    if (!this.#screens) return undefined;
    return Array.from(this.#screens.values());
  }

  set screens(percent) {
    if (!this.#screens) {
      execSh(options.fallbackBrightnessCmd(percent * 100));
      return;
    }
    this.#syncScreens();
    for (const [name, screen] of this.#screens) {
      if (name === "ddcci5") screen.brightness = percent + 0.1;
      else screen.brightness = percent;
    }
    this.notify("screens");
    this.emit("changed");
  }

  constructor() {
    super();
    try {
      this.#screens = new Map();
      if (out.trim() === "") {
        console.log(
          "Brightnessctl found no backlights, using fallback command."
        );
        this.#screens = undefined;
        return;
      }
      for (const screen of out.split("\n")) {
        const info = screen.split(",");
        this.#screens.set(info[0], new Screen(info[0], info[2] / info[4]));
      }
    } catch (error) {
      this.#screens = undefined;
    }
  }
}
const brightness = new Brightness();

export default brightness;
