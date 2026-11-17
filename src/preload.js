// Minimal isolated bridge. The console uses HTTP/localStorage directly, so no
// Node APIs are exposed to renderer scripts.
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("atlasDesktop", {
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
});
