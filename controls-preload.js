const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api',
  {
    updateTeamScore: (teamIndex, newScore) => {
      ipcRenderer.send('updateTeamScore', { team: teamIndex, score: newScore });
    },
    updateTeamName: (teamIndex, newName) => {
      ipcRenderer.send('updateTeamName', { team: teamIndex, name: newName });
    },
    toggleFrameDecoration: () => {
      ipcRenderer.send('toggleFrameDecoration');
    },
    toggleAlwaysOnTop: () => {
      ipcRenderer.send('toggleAlwaysOnTop');
    }
  }
);
