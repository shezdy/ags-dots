import { cycleNext } from "../alttab/AltTab.js";
import { minimizeFocused, restoreClient } from "../helpers/Misc.js";
import { App, GLib, Gio } from "../imports.js";

let dir = GLib.getenv("XDG_RUNTIME_DIR") || "";
if (dir === "" || !Gio.File.new_for_path(dir).query_exists(null)) {
  dir = "/tmp";
}
const socketPath = `${dir}/${App.application_id}.sock`;

const sock = Gio.File.new_for_path(socketPath);
if (sock.query_exists(null)) sock.delete(null);

const service = new Gio.SocketService();
service.add_address(
  new Gio.UnixSocketAddress({ path: socketPath }),
  Gio.SocketType.STREAM,
  Gio.SocketProtocol.DEFAULT,
  null,
);

service.connect("incoming", (_socket_service, connection, _channel) => {
  const input = connection.get_input_stream();
  const output = connection.get_output_stream();

  const request = String.fromCharCode.apply(null, input.read_bytes(32, null).get_data()).trim();
  let response = "0\n";

  switch (request) {
    case "alttab":
      cycleNext(true);
      break;
    case "cyclenext":
      cycleNext();
      break;
    case "minimize":
      minimizeFocused();
      break;
    case "restore":
      restoreClient();
      break;
    default:
      response = "1\n";
      break;
  }

  output.write_bytes(new GLib.Bytes(response), null);
  connection.close(null);
});

export default service;
