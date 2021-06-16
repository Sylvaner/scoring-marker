const teams = [
  {
    name: 'Team 1',
    score: 0
  },
  {
    name: 'Team 2',
    score: 0
  }
];

// eslint-disable-next-line no-unused-vars
function confirmReset () {
  if (confirm('Do you want to reset scores ?')) {
    resetScores();
  }
}

function resetScores () {
  setTeamScore(0, 0);
  setTeamScore(1, 0);
}

function setTeamScore (teamIndex, newScore) {
  teams[teamIndex].score = newScore;
  sendScoreUpdate(teamIndex);
}

// eslint-disable-next-line no-unused-vars
function addPointsToTeamScore (teamIndex, points) {
  teams[teamIndex].score += points;
  sendScoreUpdate(teamIndex);
}

function sendScoreUpdate (teamIndex) {
  window.api.updateTeamScore(teamIndex, teams[teamIndex].score);
}

// eslint-disable-next-line no-unused-vars
function setTeamName (teamIndex) {
  const newName = document.getElementById('team-name' + teamIndex).value;
  teams[teamIndex].name = newName;
  sendNameUpdate(teamIndex);
}

function sendNameUpdate (teamIndex) {
  window.api.updateTeamName(teamIndex, teams[teamIndex].name);
}

// eslint-disable-next-line no-unused-vars
function toggleFrameDecoration () {
  window.api.toggleFrameDecoration();
  sendAllData();
}

// eslint-disable-next-line no-unused-vars
function toggleAlwaysOnTop () {
  window.api.toggleAlwaysOnTop();
}

function sendAllData () {
  for (let teamIndex = 0; teamIndex < 2; ++teamIndex) {
    sendScoreUpdate(teamIndex);
    sendNameUpdate(teamIndex);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  for (let teamIndex = 0; teamIndex < 2; ++teamIndex) {
    document.getElementById('team-name' + teamIndex).value = teams[teamIndex].name;
  }
  sendAllData();
});
