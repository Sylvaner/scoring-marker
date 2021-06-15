const { ipcRenderer } = require('electron');

ipcRenderer.on('updateScore', (_, scoreData) => {
  document.getElementById('team-score' + scoreData.team).textContent = scoreData.score;
});

ipcRenderer.on('updateName', (_, nameData) => {
  document.getElementById('team-name' + nameData.team).textContent = nameData.name;
});
