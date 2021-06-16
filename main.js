const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const FRAME_TITLE_SIZE = 40;
let scoringWindow = null;
let frameDecorationShowed = true;

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
  controlsWindow.openDevTools();
}

function createScoringWindow () {
  scoringWindow = new BrowserWindow({
    width: 400,
    height: getScoringFrameHeight(),
    x: 0,
    y: 0,
    frame: frameDecorationShowed,
    webPreferences: {
      preload: path.join(__dirname, 'scoring-preload.js')
    }
  });
  scoringWindow.setMenuBarVisibility(false);
  scoringWindow.loadFile('scoring.html');
}

function getScoringFrameHeight () {
  let frameHeight = 125;
  if (frameDecorationShowed) {
    frameHeight += FRAME_TITLE_SIZE;
  }
  return frameHeight;
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

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}

function initMessages () {
  ipcMain.on('updateTeamScore', (_event, scoreData) => {
    scoringWindow.webContents.send('updateScore', scoreData);
  });

  ipcMain.on('updateTeamName', (_event, nameData) => {
    scoringWindow.webContents.send('updateName', nameData);
  });

  ipcMain.on('toggleFrameDecoration', (_event, _args) => {
    frameDecorationShowed = !frameDecorationShowed;
    if (!scoringWindow.isDestroyed()) {
      scoringWindow.close();
    }
    createScoringWindow();
  });
}

app.whenReady().then(() => {
  createWindows();
  initEvents();
  initMessages();
});
