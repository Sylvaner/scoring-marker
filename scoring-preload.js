const { ipcRenderer } = require('electron');

ipcRenderer.on('updateScore', (_, scoreData) => {
  document.getElementById('team-score' + scoreData.team).textContent = getTwoDigitsNumber(scoreData.score);
});

function getTwoDigitsNumber (numberToParse) {
  // Negative numbers between -10 and 0
  if (numberToParse < 0) {
    if (numberToParse > -10) {
      return '-0' + (-numberToParse);
    }
  } else if (numberToParse < 10) {
    return '0' + numberToParse;
  }
  return numberToParse;
}

ipcRenderer.on('updateName', (_, nameData) => {
  document.getElementById('team-name' + nameData.team).textContent = nameData.name;
});
