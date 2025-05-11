const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win; // declare it globally so ipcMain handlers can access it

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 500,
    frame: false,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  win.loadURL('http://localhost:5173'); // your Vite dev server
  win.setMenu(null); // hide the menu
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers for window controls
ipcMain.on('window:minimize', () => {
  if (win) win.minimize();
});

ipcMain.on('window:maximize', () => {
  if (win) {
    win.isMaximized() ? win.restore() : win.maximize();
  }
});

ipcMain.on('window:close', () => {
  if (win) win.close();
});
