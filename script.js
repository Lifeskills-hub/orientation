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
  { x: 1546, y: -738, clue: "Blk 4 Level 4 - Outside LFS Staff Room\n\nWelcome to Reverse Charades!" },
  { x: 1774, y: -828, clue: "Outside library Blk 3 Lvl 5\n\nThe Landmark Matching Game!" },
  { x: 872 , y: -708, clue: "Sports Hall Blk 7 Lvl 2\n\nWelcome to the Ping Pong Trivia Challenge!" },
  { x: 1342, y: -666, clue: "Beside SAC room Blk 5 lvl 4\n\n Country Match Challenge" },
  { x: 966, y: -676, clue: "Outside gym\n\nChopstick Cuisine Relay Challenge" },
  { x: 1618, y: -532, clue: "Blk 1 lvl 2 the empty space beside the customer & visitor center (beside the escalator)\n\nStick Shift Circle Challenge" },
  { x: 1328, y: -500, clue: "Fitness@West (Blk 1 lvl 1)\n\nWelcome to the Circle Topic Challenge!" },
  { x: 1366, y: -522, clue: "Open space infront of Experienced ITE Centre (Level 4 - Above the level 3 canteen)\n\nWelcome to the Blindfold Drawing Challenge!" },
  { x: 1766, y: -524, clue: "PULSE (Blk 2 Lvl 2)\n\nWelcome to the Traditional Games Challenge!" },
  { x: 1728, y: -502, clue: "Black Box\n\nWelcome to the Alphabet Chain Challenge! " },
  { x: 1800, y: -878, clue: "Flair studio\n\nWelcome to the Winning Word Challenge! " },
  { x: 1358, y: -604, clue: "Circular plant area between Blk 5 and Blk 1\n\nThe Whisper Challenge!" },
  { x: 946, y: -660, clue: "Open space in front of Staff Gym (Level 4)\n\nWelcome to the Whisper Challenge! " },
  { x: 1336, y: -468, clue: "Space outside JCS@West\n\nWelcome to the Word Scramble Relay!" },
  { x: 1792, y: -492, clue: "Level 7 Open Space outside Auditorium (Above Sky Lobby)\n\nWelcome to Spot the Difference!" },
  { x: 1804, y: -664, clue: "Level 4 walkaway the curve around piazza\n\nWelcome to Lost in Translation" },
  { x: 1360, y: -646, clue: "(Unmanned Station)\n\nSchool of Info-Comn and Technology Mural\n\nTake a Group Photo at the specific place" },
  { x: 1654, y: -586, clue: "(Unmanned Station)\n\nPiazza\n\nTake a group Photo and post with the figures" },
  { x: 1422, y: -502, clue: "(Unmanned Station)\n\nJCS @ West\n\nTake a group photo outside with JCS as background" },
  { x: 924, y: -672, clue: "(Unmanned Station)\n\nGym\n\nTake a group photo with everyone flexing" },
  { x: 1764, y: -802, clue: "(Unmanned Station)\n\nEach 'a' Cup\n\nTake a group photo with everyone posing to drink" },
  { x: 1692, y: -514, clue: "(Unmanned Station)\n\nOutside customer visitor centre\n\nTake a group photo with everyone" }
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
const TOTAL_STAGES_NEEDED = 10;          // ← Win after completing any 6 stations
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
