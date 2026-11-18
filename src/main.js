/**
 * Atlas desktop shell (Electron main process).
 *
 * This is the post-v3 desktop adaptation: the app hosts the Atlas web console
 * and talks to the Atlas REST API. It deliberately does not ship the legacy
 * local QMRE engine or any provider credentials in the binary.
 *
 * Environment:
 *   ATLAS_CONSOLE_URL  default https://www.3i-atlas.dev/console/
 *   ATLAS_API_BASE     default https://atlas-api-8d8k.onrender.com
 */
const { app, BrowserWindow, Menu, shell, session } = require("electron");
const path = require("node:path");

const CONSOLE_URL = process.env.ATLAS_CONSOLE_URL || "https://www.3i-atlas.dev/console/";
const API_BASE = process.env.ATLAS_API_BASE || "https://atlas-api-8d8k.onrender.com";

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    title: "3I Atlas",
    backgroundColor: "#0b0f16",
    icon: path.join(__dirname, "..", "assets", "icon.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    if (!url.startsWith(CONSOLE_URL) && !url.startsWith(API_BASE)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.on("did-fail-load", (_event, code, description) => {
    mainWindow.loadFile(path.join(__dirname, "offline.html"), {
      query: { url: CONSOLE_URL, reason: description, code: String(code) },
    });
  });

  mainWindow.loadURL(CONSOLE_URL);
  mainWindow.on("closed", () => { mainWindow = null; });
}

function buildMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "Atlas",
        submenu: [
          { role: "about" },
          { type: "separator" },
          {
            label: "Open API status",
            click: () => shell.openExternal(`${API_BASE}/v1/health`),
          },
          {
            label: "Clear session",
            click: async () => {
              await session.defaultSession.clearStorageData({ storages: ["localstorage", "cookies"] });
              if (mainWindow) mainWindow.reload();
            },
          },
          { type: "separator" },
          { role: "quit" },
        ],
      },
      { role: "editMenu" },
      { role: "viewMenu" },
      {
        label: "Navigate",
        submenu: [
          { label: "Overview", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#overview") },
          { label: "Forecasts", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#forecasts") },
          { label: "Ask Atlas", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#chat") },
          { label: "Data library", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#data") },
          { label: "Research lab", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#lab") },
          { label: "Account", click: () => mainWindow && mainWindow.loadURL(CONSOLE_URL + "#account") },
        ],
      },
      { role: "windowMenu" },
    ]),
  );
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
