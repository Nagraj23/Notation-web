// electron/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, '../dist/index.html')); // after Vite build
  win.webContents.openDevTools(); 
}


app.whenReady().then(createWindow);
