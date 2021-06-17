const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let scoringWindow = null;
let frameDecorationShowed = true;
let scoresWindowPosition = [0, 0];
let alwaysOnTop = false;

function createControlsWindow () {
  const controlsWindow = new BrowserWindow({
    width: 820,
    height: 320,
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
    height: getScoringWindowHeight(),
    x: scoresWindowPosition[0],
    y: scoresWindowPosition[1],
    frame: frameDecorationShowed,
    webPreferences: {
      preload: path.join(__dirname, 'scoring-preload.js')
    }
  });
  scoringWindow.setMenuBarVisibility(false);
  scoringWindow.loadFile('scoring.html');
}

function destroyAndCreateScoringWindow () {
  if (!scoringWindow.isDestroyed()) {
    scoresWindowPosition = scoringWindow.getPosition();
    scoringWindow.close();
  }
  createScoringWindow();
}

function getScoringWindowHeight () {
  let frameHeight = 125;
  if (frameDecorationShowed) {
    if (process.platform === 'darwin') {
      frameHeight += 30;
    } else {
      frameHeight += 40;
    }
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
    destroyAndCreateScoringWindow();
  });

  ipcMain.on('toggleAlwaysOnTop', (_event, _args) => {
    alwaysOnTop = !alwaysOnTop;
    scoringWindow.setAlwaysOnTop(alwaysOnTop);
  });
}

app.whenReady().then(() => {
  createWindows();
  initEvents();
  initMessages();
});
