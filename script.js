console.log("script.js loaded");
document.addEventListener('DOMContentLoaded', () => {
  // Retrieve saved team and game state from localStorage
  const savedTeam = localStorage.getItem('team');
  const savedClass = localStorage.getItem('className');
  const savedCurrentStage = localStorage.getItem('currentStage');
  const savedUnlockedStage = localStorage.getItem('unlockedStage');
  const savedScores = JSON.parse(localStorage.getItem('scoreboard') || '[]');
  const teamInput = document.getElementById('team-name');
  const classInput = document.getElementById('team-class');
  if (savedTeam && savedClass) {
    teamInput.value = savedTeam;
    classInput.value = savedClass;
    team = savedTeam;
    className = savedClass;
    document.getElementById('team-form-overlay').style.display = 'none';
    if (savedCurrentStage) currentStage = parseInt(savedCurrentStage);
    if (savedUnlockedStage) {
      unlockedStage = parseInt(savedUnlockedStage);
      markers.forEach((marker, index) => {
        if (index < unlockedStage - 1) {
          map.removeLayer(marker);
        } else if (index === unlockedStage - 1) {
          marker.addTo(map);
        }
      });
      if (completedCount() >= TOTAL_STAGES_NEEDED) {
        document.getElementById('recall-certificate-btn').disabled = false;
      }
    }
    savedScores.forEach(entry => updateScoreboard(entry, false));
  } else {
    document.getElementById('team-form-overlay').style.display = 'flex';
  }
  document.getElementById('start-game-btn').addEventListener('click', submitTeamDetails);
});

const map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1,
});
const imageWidth = 2302;
const imageHeight = 1314;
const bounds = [[0, 0], [imageHeight, imageWidth]];
L.imageOverlay('ite.png', bounds).addTo(map);
map.fitBounds(bounds);

// ==================== YOUR 23 CUSTOM STAGES ====================
const locations = [
  { x: 1546, y: -737, clue: "Look outside for something bright, number four will be on your right!" },
  { x: 1760, y: -823, clue: "Inside where books beholds,\n\nWhen youre thirsty, your drinks will be cold.\n\nSee you there!" },
  { x: 818 , y: -715, clue: "Where sneakers squeak and basketballs fall,\nHead to the place that holds the ball!" },
  { x: 1354, y: -705, clue: "Five holds the five-star secret;\nClimb to the fourth story\nAnd step to the side of SAC where learning meets tech." },
  { x: 1066, y: -659, clue: "Block 6, Level 2 is where you roam;\nNext to the sports hall, players make it their home.\nHear the games? See a match in play?\nYou’re right nearby, where are you?" },
  { x: 1592, y: -519, clue: "Head to Block 1, Level 2,\nWhere visitors queue but none now stay,\nBeside the moving steps on Level 2’s way.\nSee people rising as they pass through,\nFind this empty spot… where are you?" },
  { x: 1266, y: -479, clue: "Snacks on the left, sweat on the right,\nHead downstairs, it’s darker than light.\nWhere beats thump and echoes rhyme,\nFind your clue in the place of grind!" },
  { x: 1336, y: -447, clue: "Behind the block where the green fields grow,\nA quiet spot not many know.\nIt’s not far, just change your pace,\nYour clue awaits inside Co-Space!" },
  { x: 1790, y: -497, clue: "Need some help? Go through Block 2 Level 2. See the VIBES sign above you?\nYou're on the right track, we're at 2203!" },
  { x: 1718, y: -499, clue: "Enter the lift and you will see, a welcome sign will show you where I'll be.\nOn the fifth level of the second block as you turn to your left,\nThe herb garden at the end of the hall will greet you.\nBut do not be mistaken,\nI am the only door on the right.\nRemember to read the signs!" },
  { x: 1792, y: -903, clue: "Beneath the library, where silence is found,\nOn Level 4, where ideas resound.\nIn Block 3, between Youth Connect and Visume,\nA space where flair and creativity bloom.\nIndoors I remain, with \"flair\" in my name,\nA studio to create, design, and claim fame." },
  { x: 1402, y: -615, clue: "I’m round and inviting, where people find rest,\nA plant in my center, growing at its best.\nOutside SAC and GAC, I proudly stand,\nOn Level 4, where comfort’s at hand" },
  { x: 1444, y: -517, clue: "I’m where the doors open with a ding,\nBeside the place of drinks and things.\nOn Level Two of Block One’s floor,\nI’m right outside — can’t miss the door!" },
  { x: 1360, y: -497, clue: "Where ink meets page,\nStep beyond, where you are sought.\nThe spot you seek is calm, not loud —\nRight outside, beyond the crowd." },
  { x: 1772, y: -515, clue: "Half a dozen steps and you’ll arrive,\nWhere future hosts learn to welcome and drive.\nA lobby’s name with sky in view\nA training ground for hospitality crew." },
  { x: 1830, y: -677, clue: "Around the Piazza above lies a bridge on the fourth level.\nUp the escalator you go and you might find me there." },
  { x: 1342, y: -659, clue: "(Unmanned Station)\n\nOn level four we proudly stand,\nA wall of colors, tech in hand.\nFaces and wires, stories untold\nWhich mural’s magic do we behold\n\nUpload a welfie with the location to clear the station" },
  { x: 1648, y: -595, clue: "(Unmanned Station)\n\nDown at level two they stay,\nHuman forms in a frozen play.\nNo words they speak, yet stories show\nWhat figures stand where breezes blow?\n\nUpload a welfie with the location to clear the station" },
  { x: 1360, y: -497, clue: "(Unmanned Station)\n\nOn level three in Block One’s space,\nA shop for uniforms and pens you’ll trace.\nFrom notes to shirts, they’ve got the best\nWhat place equips all students?\n\nUpload a welfie with the location to clear the station" },
  { x: 1126, y: -681, clue: "(Unmanned Station)\n\nWhere hearts race fast and muscles grow,\nOn level two, Block Six, you’ll know.\nA place for power, strength, and vim\nCan you guess?\n\nUpload a welfie with the location to clear the station" },
  { x: 1742, y: -851, clue: "(Unmanned Station)\n\nNear shelves of knowledge, take a rest,\nOn level five, your thirst is blessed.\nSweet pearls dance in every cup\nCan you guess?\n\nUpload a welfie with the location to clear the station" },
  { x: 1692, y: -521, clue: "(Unmanned Station)\n\nNeed some help or a friendly guide?\nOn level two, Block Two inside.\nQuestions answered with care so true\nWhat centre waits to welcome you?\n\nUpload a welfie with the location to clear the station" }
];

// Shuffle locations every new game
for (let i = locations.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [locations[i], locations[j]] = [locations[j], locations[i]];
}

// Assign stage numbers after shuffling
locations.forEach((loc, index) => {
  loc.stage = index + 1;
});

let currentStage = 0;
let unlockedStage = 1;
const TOTAL_STAGES_NEEDED = 6;          // ← Win after completing any 6 stations
let team = '';
let className = '';
const markers = [];

// Helper to count how many stages are actually completed
function completedCount() {
  return unlockedStage - 1;
}

// Custom red marker
const redMarkerIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.16 0 0 7.16 0 16c0 8.84 16 24 16 24s16-15.16 16-24C32 7.16 24.84 0 16 0z" fill="#FF0000" />
      <circle cx="16" cy="16" r="5" fill="#FFFFFF" />
    </svg>
  `,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

// Create markers
locations.forEach(loc => {
  const latlng = map.unproject([loc.x, loc.y], 0);
  const marker = L.marker(latlng, { icon: redMarkerIcon });
  marker.bindPopup(`Stage ${loc.stage}`);
  marker.on('click', () => startStage(loc.stage, loc.clue));
  markers.push(marker);
});

// Show only the first marker at the start
markers[0].addTo(map);

function submitTeamDetails() {
  team = document.getElementById('team-name').value.trim();
  className = document.getElementById('team-class').value.trim();
  if (!team || !className) {
    alert("Please enter both Team Name and Class.");
    return;
  }
  localStorage.setItem('team', team);
  localStorage.setItem('className', className);
  document.getElementById('team-form-overlay').style.display = 'none';
}

function startStage(stage, clue) {
  if (stage !== unlockedStage) {
    alert("🚫 You must unlock this stage first!");
    return;
  }
  currentStage = stage;
  document.getElementById('clue-title').innerText = `Stage ${stage}`;
  document.getElementById('clue-text').innerText = clue;
  document.getElementById('clue-overlay').style.display = 'flex';

  const completeBtn = document.getElementById('complete-level-btn');
  if (completeBtn) {
    completeBtn.style.display = 'inline-block';
    completeBtn.disabled = true;
  }
  document.getElementById("media-upload").value = "";
  const submitBtn = document.getElementById('media-upload').nextElementSibling;
  if (submitBtn) submitBtn.disabled = false;
}

async function uploadToDrive() {
  const overlay = document.getElementById("loading-overlay");
  const fileInput = document.getElementById("media-upload");
  const file = fileInput.files[0];
  const submitBtn = fileInput.nextElementSibling;

  if (!file) {
    alert("Please select a photo or video to upload.");
    return;
  }
  if (overlay) overlay.style.display = 'flex';

  const reader = new FileReader();
  reader.onload = async function (e) {
    const base64Data = e.target.result.split(',')[1];
    const timestamp = new Date().toISOString();
    const payload = {
      filename: `Stage${currentStage}_${Date.now()}_${team}_${className}_${file.name}`,
      type: file.type,
      data: base64Data,
      team: team,
      class: className,
      timestamp: timestamp
    };
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyF4Vn0FnFUD4Ay9hLh8bNLneJMFHvMsD1RyOtgNVLVLp4LtDkjoegGNGqY1LKxTQzySg/exec",
        { method: "POST", body: JSON.stringify(payload) }
      );
      const responseText = await response.text();
      let result;
      try { result = JSON.parse(responseText); } catch { }

      if (result && result.status === "success") {
        alert("✅ Upload successful!");
        const completeBtn = document.getElementById('complete-level-btn');
        if (completeBtn) completeBtn.disabled = false;
        if (submitBtn) submitBtn.disabled = true;
      } else {
        alert("❌ Upload failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Upload failed.");
    } finally {
      if (overlay) overlay.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
}

function completeStage() {
  alert(`✅ Stage ${currentStage} completed!`);
  document.getElementById('clue-overlay').style.display = 'none';
  updateScoreboard(`${team} (${className}) completed Stage ${currentStage}`);

  // Remove current marker
  const currentMarker = markers[currentStage - 1];
  if (currentMarker) map.removeLayer(currentMarker);

  // Increment unlocked stage
  unlockedStage++;

  // Save progress
  localStorage.setItem('currentStage', currentStage);
  localStorage.setItem('unlockedStage', unlockedStage);

  // === WIN CONDITION: 5 stations completed ===
  if (completedCount() >= TOTAL_STAGES_NEEDED) {
    // Remove ALL remaining markers
    markers.forEach(marker => map.removeLayer(marker));

    document.getElementById('certificate-team').textContent = team;
    document.getElementById('certificate-class').textContent = className;
    document.getElementById('certificate-date').textContent = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
    document.getElementById('certificate-overlay').style.display = 'flex';
    document.getElementById('recall-certificate-btn').disabled = false;

    alert(`🎉 Congratulations! You completed 5 stations and won the game!`);
    return;
  }

  // Otherwise reveal the next random marker (only if more are needed)
  if (unlockedStage <= locations.length) {
    const nextMarker = markers[unlockedStage - 1];
    if (nextMarker) nextMarker.addTo(map);
  }

  // Clear file input
  document.getElementById("media-upload").value = "";
}

function updateScoreboard(entry, save = true) {
  const scoreboard = document.getElementById('scoreboard');
  const scoreList = document.getElementById('score-list');
  const currentScores = JSON.parse(localStorage.getItem('scoreboard') || '[]');

  if (currentScores.includes(entry)) return;

  const li = document.createElement('li');
  li.textContent = entry;
  scoreList.appendChild(li);
  scoreboard.style.display = 'block';

  if (save) {
    currentScores.push(entry);
    localStorage.setItem('scoreboard', JSON.stringify(currentScores));
  }
}

function closeCertificate() {
  document.getElementById('certificate-overlay').style.display = 'none';
}

function closeClue() {
  document.getElementById('clue-overlay').style.display = 'none';
}

function showCertificate() {
  const savedTeam = localStorage.getItem('team');
  const savedClass = localStorage.getItem('className');
  if (savedTeam && savedClass) {
    document.getElementById('certificate-team').textContent = savedTeam;
    document.getElementById('certificate-class').textContent = savedClass;
    document.getElementById('certificate-date').textContent = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
    document.getElementById('certificate-overlay').style.display = 'flex';
  }
}

function resetGame() {
  localStorage.removeItem('team');
  localStorage.removeItem('className');
  localStorage.removeItem('currentStage');
  localStorage.removeItem('unlockedStage');
  localStorage.removeItem('scoreboard');
  location.reload();
}

map.on('click', function (e) {
  const point = map.project(e.latlng, 0);
  console.log(`Clicked Pixel Coordinates: x=${Math.round(point.x)}, y=${Math.round(point.y)}`);
  alert(`Pixel Coordinates: x=${Math.round(point.x)}, y=${Math.round(point.y)}`);
});

document.getElementById('media-upload').addEventListener('change', function () {
  const submitBtn = this.nextElementSibling;
  if (submitBtn) submitBtn.disabled = !this.files.length;
});
