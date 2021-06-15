// main.js

// Modules pour controler la vie de l'application et créer une fenêtre de navigation native
const { app, BrowserWindow } = require('electron')
//const path = require('path')

function createControlsWindow () {
    // Créer la fenêtre de navigation.
    const controlWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
  //      preload: path.join(__dirname, 'preload.js')
      }
    })
  
    // et charger l'index.html de l'application.
    controlWindow.loadFile('controls.html')
  
    // Ouvrir les outils de développement.
    // mainWindow.webContents.openDevTools()
  }
  
function createScoringWindow () {
    // Créer la fenêtre de navigation.
    const scoringWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
  //      preload: path.join(__dirname, 'preload.js')
      }
    })
  
    // et charger l'index.html de l'application.
    scoringWindow.loadFile('scoring.html')
  
    // Ouvrir les outils de développement.
    // mainWindow.webContents.openDevTools()
  }
  
  // Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
    createControlsWindow()
    createScoringWindow()

  app.on('activate', function () {
    // Sur macOS il est d'usage de recréer une fenêtre dans l'application quand
    // l'icône du dock est cliquée et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Sur macOS, il est courant
// pour les applications et leur barre de menu de rester actives jusqu’à ce que l’utilisateur quitte
// explicitement avec Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})