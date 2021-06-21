const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let scoringWindow = null;
let frameDecorationShowed = true;
let scoresWindowPosition = [0, 0];
let alwaysOnTop = false;

function createControlsWindow () {
  createWindow({
    width: 820,
    height: 340,
    center: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'controls-preload.js')
    }
  }, 'controls.html');
}

function createScoringWindow () {
  scoringWindow = createWindow({
    width: 400,
    height: getScoringWindowHeight(),
    x: scoresWindowPosition[0],
    y: scoresWindowPosition[1],
    frame: frameDecorationShowed,
    webPreferences: {
      preload: path.join(__dirname, 'scoring-preload.js')
    }
  }, 'scoring.html');
}

function createWindow (options, htmlFile) {
  const targetWindow = new BrowserWindow(options);
  targetWindow.setMenuBarVisibility(false);
  targetWindow.loadFile(htmlFile);
  targetWindow.setResizable(false);
  targetWindow.on('close', quitApp);
  return targetWindow;
}

function destroyAndCreateScoringWindow () {
  if (!scoringWindow.isDestroyed()) {
    scoresWindowPosition = scoringWindow.getPosition();
    scoringWindow.removeListener('close', quitApp);
    scoringWindow.close();
  }
  createScoringWindow();
}

/**
 * Window height must be calculated, the titlebar is included in the height.
 * @returns Height of the window
 */
function getScoringWindowHeight () {
  let windowHeight = 125;
  if (frameDecorationShowed) {
    if (process.platform === 'darwin') {
      windowHeight += 30;
    } else {
      windowHeight += 40;
    }
  }
  return windowHeight;
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

  app.on('window-all-closed', quitApp);
}

function quitApp () {
  app.quit();
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
