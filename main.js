const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let scoringWindow = null;

function createControlsWindow () {
  const controlsWindow = new BrowserWindow({
    width: 800,
    height: 280,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'controls-preload.js')
    }
  });
  controlsWindow.setMenuBarVisibility(false);
  controlsWindow.setResizable(false);
  controlsWindow.loadFile('controls.html');
}

function createScoringWindow () {
  scoringWindow = new BrowserWindow({
    width: 400,
    height: 165,
    x: 0,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, 'scoring-preload.js')
    }
  });
  scoringWindow.setMenuBarVisibility(false);
  scoringWindow.loadFile('scoring.html');
}

function createWindows () {
  createControlsWindow();
  createScoringWindow();
}

function initEvents () {
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindows();
    }
  });

  ipcMain.on('updateTeamScore', (_, scoreData) => {
    scoringWindow.webContents.send('updateScore', scoreData);
  });

  ipcMain.on('updateTeamName', (_, nameData) => {
    scoringWindow.webContents.send('updateName', nameData);
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

app.whenReady().then(() => {
  createWindows();
  initEvents();
});
