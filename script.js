// ==================== ALL 23 STAGES WITH YOUR CLUES ====================
const stages = [
  { name: "Blk 4 Level 4 – Outside LFS Staff Room", clue: "Look outside for something bright, number four will be on your right!" },
  { name: "Outside Library (Blk 3 Lvl 5)", clue: "Inside where books beholds,\nWhen youre thirsty, your drinks will be cold.\nSee you there! :)" },
  { name: "Sports Hall (Blk 7 Lvl 2)", clue: "Where sneakers squeak and basketballs fall,\nHead to the place that holds the ball!" },
  { name: "Beside SAC Room (Blk 5 Lvl 4)", clue: "Five holds the five-star secret;\nClimb to the fourth story\nAnd step to the side of SAC where learning meets tech." },
  { name: "Outside Gym (Blk 6)", clue: "Block 6, Level 2 is where you roam;\nNext to the sports hall, players make it their home.\nHear the games? See a match in play?\nYou’re right nearby, where are you?" },
  { name: "Blk 1 Lvl 2 – Empty space beside Customer & Visitor Centre (beside escalator)", clue: "Head to Block 1, Level 2,\nWhere visitors queue but none now stay,\nBeside the moving steps on Level 2’s way.\nSee people rising as they pass through,\nFind this empty spot… where are you?" },
  { name: "Fitness@West (Blk 1 Lvl 1)", clue: "Snacks on the left, sweat on the right,\nHead downstairs, it’s darker than light.\nWhere beats thump and echoes rhyme,\nFind your clue in the place of grind!" },
  { name: "Co-space (1118x)", clue: "Behind the block where the green fields grow,\nA quiet spot not many know.\nIt’s not far, just change your pace,\nYour clue awaits inside Co-Space!" },
  { name: "PULSE (Blk 2 Lvl 2)", clue: "Need some help? Go through Block 2 Level 2. See the VIBES sign above you?\nYou're on the right track, we're at 2203!" },
  { name: "Black Box", clue: "Enter the lift and you will see, a welcome sign will show you where I'll be.\nOn the fifth level of the second block as you turn to your left,\nThe herb garden at the end of the hall will greet you.\nBut do not be mistaken,\nI am the only door on the right.\nRemember to read the signs!" },
  { name: "Flair Studio", clue: "Beneath the library, where silence is found,\nOn Level 4, where ideas resound.\nIn Block 3, between Youth Connect and Visume,\nA space where flair and creativity bloom.\nIndoors I remain, with \"flair\" in my name,\nA studio to create, design, and claim fame." },
  { name: "Circular Plant Area (between Blk 5 & Blk 1)", clue: "I’m round and inviting, where people find rest,\nA plant in my center, growing at its best.\nOutside SAC and GAC, I proudly stand,\nOn Level 4, where comfort’s at hand" },
  { name: "Blk 1 Level 2 – Outside Elevator beside 711", clue: "I’m where the doors open with a ding,\nBeside the place of drinks and things.\nOn Level Two of Block One’s floor,\nI’m right outside — can’t miss the door!" },
  { name: "Space outside JCS@West", clue: "Where ink meets page,\nStep beyond, where you are sought.\nThe spot you seek is calm, not loud —\nRight outside, beyond the crowd." },
  { name: "Sky Lobby", clue: "Half a dozen steps and you’ll arrive,\nWhere future hosts learn to welcome and drive.\nA lobby’s name with sky in view\nA training ground for hospitality crew." },
  { name: "Level 4 Walkway – The Curve around Piazza", clue: "Around the Piazza above lies a bridge on the fourth level.\nUp the escalator you go and you might find me there." },
  { name: "Library", clue: "1. I am located at where imagination are created. Hint: Trains are Too Technological (fictional)\n2. I am located at the section where it is popular in japan. Hint: What is the letter to describe yourself. (Manga)\n3. I am located at the national language of Singapore. Hint: I come at the end of note, page & theme. What letter am I? (Malay)" },
  { name: "School of Info-Comn and Technology Mural", clue: "On level four we proudly stand,\nA wall of colors, tech in hand.\nFaces and wires, stories untold\nWhich mural’s magic do we behold" },
  { name: "Piazza", clue: "Down at level two they stay,\nHuman forms in a frozen play.\nNo words they speak, yet stories show\nWhat figures stand where breezes blow?" },
  { name: "JCS @ West", clue: "On level three in Block One’s space,\nA shop for uniforms and pens you’ll trace.\nFrom notes to shirts, they’ve got the best\nWhat place equips all students?" },
  { name: "Gym", clue: "Where hearts race fast and muscles grow,\nOn level two, Block Six, you’ll know.\nA place for power, strength, and vim\nCan you guess?" },
  { name: "Each 'a' Cup", clue: "Near shelves of knowledge, take a rest,\nOn level five, your thirst is blessed.\nSweet pearls dance in every cup\nCan you guess?" },
  { name: "Outside Customer Visitor Centre", clue: "Need some help or a friendly guide?\nOn level two, Block Two inside.\nQuestions answered with care so true\nWhat centre waits to welcome you?" }
];

// ========== ADD YOUR REAL COORDINATES BELOW (replace all these) ==========
const campusCenter = [1.31000, 103.77500]; // change to your campus centre

stages.forEach((s, i) => {
  s.completed = false;
  // REPLACE THESE WITH REAL COORDINATES (click on map + console.log to get them)
  s.lat = campusCenter[0] + (Math.random() - 0.5)*0.002;
  s.lng = campusCenter[1] + (Math.random() - 0.5)*0.002;
});
// Example of real format (uncomment and fill):
// stages[0].lat = 1.30987; stages[0].lng = 103.77412;
// stages[1].lat = 1.31023; stages[1].lng = 103.77501;
// ... continue for all 23

let map, currentStageIndex = 0, markers = [], teamName = "", teamClass = "";

function initMap() {
  map = L.map('map').setView(campusCenter, 17);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  stages.forEach((stage, i) => {
    const marker = L.marker([stage.lat, stage.lng]).addTo(map)
      .bindPopup(`Stage ${i+1}: ${stage.name.split(' – ')[0] || stage.name}`)
      .on('click', () => showClue(i));
    markers.push(marker);
  });
  updateCurrentStageMarker();
  map.setView([stages[0].lat, stages[0].lng], 19);
}

function updateCurrentStageMarker() {
  markers.forEach((m, i) => {
    const s = stages[i];
    const isCurrent = i === currentStageIndex;
    const color = s.completed ? '#00ff00' : (isCurrent ? '#ff0000' : '#0066ff');
    const size = isCurrent ? 28 : (s.completed ? 20 : 16);
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color}; width:${size}px; height:${size}px; border-radius:50%; border:4px solid white; box-shadow:0 0 10px #000;"></div>`,
      iconSize: [size, size]
    });
    m.setIcon(icon);
  });
}

function showClue(i) {
  if (i !== currentStageIndex) return alert("Please complete the current stage first!");
  document.getElementById('clue-title').textContent = `Stage ${i+1}: ${stages[i].name}`;
  document.getElementById('clue-text').innerHTML = stages[i].clue.replace(/\n/g, '<br>');
  document.getElementById('clue-overlay').style.display = 'flex';
}

function closeClue() { document.getElementById('clue-overlay').style.display = 'none'; }

document.getElementById('complete-level-btn').onclick = function() {
  stages[currentStageIndex].completed = true;
  alert(`Stage ${currentStageIndex+1} Completed! ✓`);
  closeClue();
  updateScoreboard();
  updateCurrentStageMarker();

  currentStageIndex++;
  if (currentStageIndex >= stages.length) {
    // FINISHED!
    document.getElementById('certificate-team').textContent = teamName;
    document.getElementById('certificate-class').textContent = teamClass;
    document.getElementById('certificate-date').textContent = new Date().toLocaleDateString('en-SG');
    document.getElementById('certificate-overlay').style.display = 'flex';
    document.getElementById('recall-certificate-btn').disabled = false;
  } else {
    map.setView([stages[currentStageIndex].lat, stages[currentStageIndex].lng], 19);
  }
};

function updateScoreboard() {
  const list = document.getElementById('score-list');
  list.innerHTML = '';
  stages.forEach((s, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Stage ${i+1}:</strong> ${s.name}`;
    li.style.color = s.completed ? 'limegreen' : (i === currentStageIndex ? 'orange' : '#ff6666');
    li.innerHTML += s.completed ? ' ✓' : ' ⏳';
    list.appendChild(li);
  });
}

// Start Game
document.getElementById('start-game-btn').onclick = function() {
  teamName = document.getElementById('team-name').value.trim();
  teamClass = document.getElementById('team-class').value.trim();
  if (!teamName || !teamClass) return alert("Please fill in Team Name and Class!");
  document.getElementById('team-form-overlay').style.display = 'none';
  initMap();
  updateScoreboard();
};

// Certificate & Restart
function closeCertificate() { document.getElementById('certificate-overlay').style.display = 'none'; }
document.getElementById('recall-certificate-btn').onclick = () => document.getElementById('certificate-overlay').style.display = 'flex';
document.getElementById('restart-btn').onclick = () => confirm("Restart game? All progress lost.") && location.reload();

// Optional upload placeholder
function uploadToDrive() {
  const file = document.getElementById('media-upload').files[0];
  if (!file) return alert("Please select a file first!");
  document.getElementById('loading-overlay').style.display = 'flex';
  setTimeout(() => {
    alert("Proof uploaded successfully! (demo)");
    document.getElementById('loading-overlay').style.display = 'none';
  }, 1500);
}
