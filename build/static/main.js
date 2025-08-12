const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");
const localServerApp = express();
const PORT = 8088;

const startLocalServer = (done) => {
  localServerApp.use(express.json({ limit: "100mb" }));
  localServerApp.use(cors());

  // Serve static files from the build folder
  // localServerApp.use(express.static(path.join(__dirname, "build")));
  localServerApp.use(express.static(path.join(__dirname, "build")));

  localServerApp.listen(PORT, async () => {
    console.log("Server Started on PORT ", PORT);
    done();
  });
};

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // webPreferences: {
    //   preload: path.join(__dirname, "preload.js"),
    //   devTools: true, // Disable developer tools entirely later
    // },
  });

  mainWindow.loadURL(`http://localhost:${PORT}`);

  // Disable developer tools shortcuts
  // mainWindow.webContents.on("before-input-event", (event, input) => {
  //   if (
  //     input.key === "F12" || // F12 shortcut
  //     (input.control && input.shift && input.key.toLowerCase() === "i") || // Ctrl+Shift+I
  //     (input.meta && input.alt && input.key.toLowerCase() === "i") // Cmd+Option+I on macOS
  //   ) {
  //     event.preventDefault();
  //   }
  // });

  // Custom menu with Zoom options
  const menuTemplate = [
    {
      label: "View",
      submenu: [
        {
          label: "Zoom In",
          accelerator: "CmdOrCtrl+Plus",
          click: () => {
            const zoomFactor = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(zoomFactor + 0.1);
          },
        },
        {
          label: "Zoom Out",
          accelerator: "CmdOrCtrl+-",
          click: () => {
            const zoomFactor = mainWindow.webContents.getZoomFactor();
            mainWindow.webContents.setZoomFactor(zoomFactor - 0.1);
          },
        },
        {
          label: "Reset Zoom",
          accelerator: "CmdOrCtrl+0",
          click: () => {
            mainWindow.webContents.setZoomFactor(1); // Reset zoom to default
          },
        },
      ],
    },
  ];

  // Set the custom menu
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  startLocalServer(createWindow);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
