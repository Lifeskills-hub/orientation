console.log("script.js loaded");

const TOTAL_STAGES_NEEDED = 11;
const GAME_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours
const imageWidth = 2302;
const imageHeight = 1314;
const bounds = [[0, 0], [imageHeight, imageWidth]];
const STORAGE = { team:'team', className:'className', currentStage:'currentStage', unlockedStage:'unlockedStage', scoreboard:'scoreboard', order:'locationOrder', startTime:'gameStartTime', timeUpShown:'gameTimeUpShown' };


const originalLocations = [
  {
    x:1546,y:-738,
    clue:"Blk 4 Level 4 - Outside LFS Staff Room\n\nReverse Charades: Communicate Without Words\n\nAttribute: Initiator\nSkill Focus: Communication & Empathy\nUnderstand your teammates' actions and perspectives while communicating clearly without speaking.",
    hint:"Head to Block 4 and go up to Level 4. Look near the Lifeskills staff area."
  },

  {
    x:1774,y:-828,
    clue:"Outside library Blk 3 Lvl 5\n\nLandmark Detectives: Explore and Connect\n\nAttribute: Explorer\nSkill Focus: Curiosity & Independent Learning\nObserve carefully, investigate unfamiliar landmarks and use your own knowledge to make connections.",
    hint:"Think books and study spaces. Head to Block 3, Level 5."
  },

  {
    x:872,y:-708,
    clue:"Sports Hall Blk 7 Lvl 2\n\nPing Pong Problem-Solvers\n\nAttribute: Tech-Savvy Creator\nSkill Focus: Critical Thinking & Problem Solving\nThink quickly, evaluate each question and work together to find the best answer under pressure.",
    hint:"Look for the indoor sports venue in Block 7 on Level 2."
  },

  {
    x:1342,y:-666,
    clue:"Beside SAC room Blk 5 lvl 4\n\nGlobal Connections: Country Match\n\nAttribute: Explorer\nSkill Focus: Curiosity & Independent Learning\nDiscover different countries, cultures and identities through observation and active learning.",
    hint:"Head to Block 5, Level 4. Look around the SAC room."
  },

  {
    x:966,y:-676,
    clue:"Outside gym\n\nChopstick Relay: Adapt and Achieve\n\nAttribute: Explorer\nSkill Focus: Adaptability & Resilience\nAdjust your technique, stay patient and keep trying when the task becomes difficult.",
    hint:"Look for the gym area. The station is outside it."
  },

  {
    x:1618,y:-532,
    clue:"Blk 1 lvl 2, empty space beside the Customer & Visitor Centre (beside the escalator)\n\nStick Shift: One Team, One Goal\n\nAttribute: Initiator\nSkill Focus: Communication & Empathy\nListen to one another, coordinate your movements and help every team member contribute.",
    hint:"Go to Block 1, Level 2. Look near the Customer & Visitor Centre and escalator."
  },

  {
    x:1328,y:-500,
    clue:"Fitness@West (Blk 1 lvl 1)\n\nCircle of Ideas: Speak, Listen, Connect\n\nAttribute: Initiator\nSkill Focus: Communication & Empathy\nExpress your ideas confidently while listening respectfully to different views.",
    hint:"Go to Block 1, Level 1 and look for Fitness@West."
  },

  {
    x:1366,y:-522,
    clue:"Open space in front of Experience ITE Centre (Level 4, above the Level 3 canteen)\n\nBlindfold Drawing: Trust the Communicator\n\nAttribute: Initiator\nSkill Focus: Communication & Empathy\nGive clear instructions, listen carefully and consider what your teammate needs to complete the drawing.",
    hint:"Go above the Level 3 canteen. Look for the open space near Experience ITE Centre."
  },

  {
    x:1766,y:-524,
    clue:"Visume Lab (Blk 3 Level 4)\n\nTraditional Games Discovery\n\nAttribute: Explorer\nSkill Focus: Curiosity & Independent Learning\nExplore how traditional games reflect different communities, histories and cultures.",
    hint:"Head to Block 3, Level 4 and look for the Visume Lab."
  },

  {
    x:1728,y:-502,
    clue:"Blk 1 Level 5 - Black Box\n\nAlphabet Chain: Think Fast, Build Together\n\nAttribute: Tech-Savvy Creator\nSkill Focus: Critical Thinking & Problem Solving\nRecognise patterns, generate ideas quickly and build on your teammates' responses.",
    hint:"Go to Block 1, Level 5 and look for the Black Box."
  },

  {
    x:1800,y:-878,
    clue:"Flair Studio (Blk 3 Level 4)\n\nWinning Words: Create the Solution\n\nAttribute: Tech-Savvy Creator\nSkill Focus: Critical Thinking & Problem Solving\nAnalyse the available information, test possible answers and create a solution as a team.",
    hint:"Head to Block 3, Level 4 and look for the Flair Studio."
  },

  {
    x:1358,y:-604,
    clue:"Circular plant area between Blk 5 and Blk 1\n\nWhisper Challenge: Message Matters\n\nAttribute: Initiator\nSkill Focus: Communication & Empathy\nCommunicate clearly and recognise how messages can change when they are not conveyed accurately.",
    hint:"Look for the circular planted area connecting Block 5 and Block 1."
  },

  {
    x:946,y:-660,
    clue:"Open space in front of Staff Gym (Level 4)\n\nWhisper Challenge: Listen with Care\n\nAttribute: Initiator\nSkill Focus: Personal Values & Professional Ethics\nPass the message honestly and accurately while demonstrating responsibility and respect for others.",
    hint:"Go to Level 4 and look for the open area in front of the Staff Gym."
  },

  {
    x:1792,y:-492,
    clue:"Level 7 open space outside Auditorium (above Sky Lobby)\n\nSpot the Difference: Observe, Analyse, Solve\n\nAttribute: Tech-Savvy Creator\nSkill Focus: Critical Thinking & Problem Solving\nExamine details, compare information and use evidence to identify the differences.",
    hint:"Head high up to Level 7. Look for the open space outside the Auditorium, above Sky Lobby."
  },

  {
    x:1804,y:-664,
    clue:"Level 4 walkway around the curve at Piazza\n\nLost in Translation: Bridge the Communication Gap\n\nAttribute: Explorer\nSkill Focus: Adaptability & Resilience\nAdapt the way you communicate, learn from misunderstandings and try alternative approaches.",
    hint:"Go to Level 4 around Piazza and follow the curved walkway."
  },

  // UNMANNED STATIONS - unchanged
  {
    x:1360,y:-646,
    clue:"(Unmanned Station)\n\nSchool of Info-Comm and Technology Mural\n\nTake a group photo with the wall Mural.",
    hint:"This is unmanned. Look for the School of Info-Comm and Technology mural."
  },

  {
    x:1654,y:-586,
    clue:"(Unmanned Station)\n\nPiazza\n\nTake a group photo and pose with the figures.",
    hint:"This is unmanned. Head to Piazza and look for the figures."
  },

  {
    x:1422,y:-502,
    clue:"(Unmanned Station)\n\nFoogle Cafeteria\n\nTake a group photo with the Foodgle Signboard as the background.",
    hint:"This is unmanned. Find Foodgle and go in."
  },

  {
    x:924,y:-672,
    clue:"(Unmanned Station)\n\nGym\n\nTake a group photo with everyone flexing.",
    hint:"This is unmanned. Find the Gym and prepare your best flex pose."
  },

  {
    x:1764,y:-802,
    clue:"(Unmanned Station)\n\nEach 'a' Cup\n\nTake a group photo with everyone posing to drink.",
    hint:"This is unmanned. Find Each 'a' Cup and get the team ready for a drinking pose."
  },

  {
    x:1692,y:-514,
    clue:"(Unmanned Station)\n\nOutside Customer Visitor Centre\n\nTake a group photo with everyone.",
    hint:"This is unmanned. Find the Customer Visitor Centre and stay outside it."
  }
];



function getOrderedLocations(){
  let order;
  try { order=JSON.parse(localStorage.getItem(STORAGE.order)); } catch(e) { order=null; }
  const valid=Array.isArray(order)&&order.length===originalLocations.length&&new Set(order).size===originalLocations.length;
  if(!valid){ order=originalLocations.map((_,i)=>i); for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];} localStorage.setItem(STORAGE.order,JSON.stringify(order)); }
  return order.map((sourceIndex,index)=>({...originalLocations[sourceIndex],stage:index+1,sourceIndex}));
}
const locations=getOrderedLocations();
let currentStage=Number(localStorage.getItem(STORAGE.currentStage))||0;
let unlockedStage=Number(localStorage.getItem(STORAGE.unlockedStage))||1;
let team=localStorage.getItem(STORAGE.team)||'';
let className=localStorage.getItem(STORAGE.className)||'';
const markers=[];

const map=L.map('map',{crs:L.CRS.Simple,minZoom:-1,maxZoom:2,zoomControl:false,attributionControl:false});
L.control.zoom({position:'bottomright'}).addTo(map);
L.imageOverlay('ite.png',bounds).addTo(map);
map.fitBounds(bounds);

const markerIcon=L.divIcon({className:'custom-marker',html:'<div class="marker-pin"><span>!</span></div>',iconSize:[42,48],iconAnchor:[21,45]});
locations.forEach(loc=>{const marker=L.marker(map.unproject([loc.x,loc.y],0),{icon:markerIcon,title:`Mission ${loc.stage}`});marker.on('click',()=>startStage(loc.stage,loc.clue,loc.hint));markers.push(marker);});

function completedCount(){return Math.min(unlockedStage-1,TOTAL_STAGES_NEEDED);}
function activeMarker(){return markers[unlockedStage-1];}
function showOnlyActiveMarker(){markers.forEach(m=>map.removeLayer(m));if(completedCount()<TOTAL_STAGES_NEEDED&&activeMarker())activeMarker().addTo(map);}
function escapeText(value){return String(value||'').replace(/[<>]/g,'');}
function updateDashboard(){
  document.getElementById('team-display').textContent=team||'Your Team';
  document.getElementById('class-display').textContent=className||'Class';
  const done=completedCount(); const pct=Math.min(100,(done/TOTAL_STAGES_NEEDED)*100);
  document.getElementById('progress-text').textContent=`${done} / ${TOTAL_STAGES_NEEDED}`;
  document.getElementById('progress-bar').style.width=`${pct}%`;
  document.querySelector('.progress-track').setAttribute('aria-valuenow',String(done));
  const won=done>=TOTAL_STAGES_NEEDED;
  document.getElementById('status-text').textContent=won?'Adventure completed':`Find Mission ${unlockedStage}`;
  document.getElementById('current-mission-number').textContent=won?'✓':String(unlockedStage).padStart(2,'0');
  document.getElementById('focus-marker-btn').disabled=won;
  document.getElementById('recall-certificate-btn').disabled=!won;
}
function restoreScores(){
  let scores=[];try{scores=JSON.parse(localStorage.getItem(STORAGE.scoreboard)||'[]');}catch(e){}
  scores.forEach(entry=>appendScore(entry));
  updateScoreUI();
}
function appendScore(entry){const li=document.createElement('li');li.textContent=entry;document.getElementById('score-list').appendChild(li);}
function updateScoreUI(){const count=document.getElementById('score-list').children.length;document.getElementById('score-count').textContent=count;document.getElementById('empty-score').style.display=count?'none':'block';document.getElementById('scoreboard').style.display='block';}

function submitTeamDetails(){
  team=escapeText(document.getElementById('team-name').value.trim()); className=escapeText(document.getElementById('team-class').value.trim());
  const error=document.getElementById('form-error');
  if(!team||!className){error.textContent='Please enter both your team name and class.';return;}
  error.textContent='';localStorage.setItem(STORAGE.team,team);localStorage.setItem(STORAGE.className,className);if(!localStorage.getItem(STORAGE.startTime)){localStorage.setItem(STORAGE.startTime,String(Date.now()));localStorage.removeItem(STORAGE.timeUpShown);}document.getElementById('team-form-overlay').style.display='none';updateDashboard();startTimer();setTimeout(focusActiveMarker,250);
}
function startStage(stage,clue,hint){
  if(stage!==unlockedStage){alert('This mission is not active yet.');return;}
  currentStage=stage;localStorage.setItem(STORAGE.currentStage,String(currentStage));
  document.getElementById('clue-title').textContent=`Mission ${stage}`;
  const sections=String(clue||'').split(/\n\n+/).map(part=>part.trim()).filter(Boolean);
  const locationEl=document.getElementById('clue-location');
  const gameTitleEl=document.getElementById('clue-game-title');
  const attributeBlock=document.getElementById('clue-attribute-block');
  const attributeEl=document.getElementById('clue-attribute');
  const skillEl=document.getElementById('clue-skill');
  const descriptionEl=document.getElementById('clue-description');
  const taskEl=document.getElementById('clue-task');
  locationEl.textContent=sections[0]||'';
  gameTitleEl.textContent=sections[1]||'';
  attributeEl.textContent='';skillEl.textContent='';descriptionEl.textContent='';taskEl.textContent='';
  attributeBlock.style.display='none';descriptionEl.style.display='none';taskEl.style.display='none';
  const details=(sections[2]||'').split(/\n+/).map(line=>line.trim()).filter(Boolean);
  const attributeLine=details.find(line=>line.startsWith('Attribute:'));
  const skillLine=details.find(line=>line.startsWith('Skill Focus:'));
  const descriptionLines=details.filter(line=>!line.startsWith('Attribute:')&&!line.startsWith('Skill Focus:'));
  if(attributeLine||skillLine){
    attributeEl.textContent=attributeLine?attributeLine.replace(/^Attribute:\s*/,''):'';
    skillEl.textContent=skillLine?skillLine.replace(/^Skill Focus:\s*/,''):'';
    attributeBlock.style.display='block';
    if(descriptionLines.length){descriptionEl.textContent=descriptionLines.join(' ');descriptionEl.style.display='block';}
  }else{
    const remaining=sections.slice(2).join(' ');
    if(remaining){taskEl.textContent=remaining;taskEl.style.display='block';}
  }
  const hintBtn=document.getElementById('hint-btn');
  const hintBox=document.getElementById('hint-box');
  hintBox.textContent=hint||'No additional hint is available for this mission.';
  hintBox.classList.remove('show');
  hintBtn.textContent='💡 Need a hint?';
  hintBtn.setAttribute('aria-expanded','false');
  document.getElementById('clue-overlay').style.display='flex';
  document.getElementById('complete-level-btn').disabled=true;document.getElementById('upload-btn').disabled=true;document.getElementById('upload-success').style.display='none';document.getElementById('media-upload').value='';clearEvidencePreview();document.getElementById('file-name').textContent='Tap to choose evidence from this device';
}
async function uploadToDrive(){
  const fileInput=document.getElementById('media-upload'),file=fileInput.files[0],submitBtn=document.getElementById('upload-btn');if(!file){alert('Please select a photo or video.');return;}
  document.getElementById('loading-overlay').style.display='flex';submitBtn.disabled=true;
  const reader=new FileReader();reader.onload=async e=>{
    const payload={filename:`Stage${currentStage}_${Date.now()}_${team}_${className}_${file.name}`,type:file.type,data:e.target.result.split(',')[1],team,class:className,timestamp:new Date().toISOString()};
    try{const response=await fetch('https://script.google.com/macros/s/AKfycbyF4Vn0FnFUD4Ay9hLh8bNLneJMFHvMsD1RyOtgNVLVLp4LtDkjoegGNGqY1LKxTQzySg/exec',{method:'POST',body:JSON.stringify(payload)});const text=await response.text();let result;try{result=JSON.parse(text)}catch(e){}if(result&&result.status==='success'){document.getElementById('complete-level-btn').disabled=false;document.getElementById('upload-success').style.display='block';}else{throw new Error('Upload was not accepted');}}catch(error){console.error(error);alert('Upload failed. Please check your connection and try again.');submitBtn.disabled=false;}finally{document.getElementById('loading-overlay').style.display='none';}
  };reader.onerror=()=>{document.getElementById('loading-overlay').style.display='none';submitBtn.disabled=false;alert('Unable to read this file.');};reader.readAsDataURL(file);
}
function completeStage(){
  if(!currentStage||currentStage!==unlockedStage)return;
  updateScoreboard(`${team} (${className}) completed Mission ${currentStage}`);map.removeLayer(markers[currentStage-1]);unlockedStage++;localStorage.setItem(STORAGE.currentStage,String(currentStage));localStorage.setItem(STORAGE.unlockedStage,String(unlockedStage));document.getElementById('clue-overlay').style.display='none';updateDashboard();
  if(completedCount()>=TOTAL_STAGES_NEEDED){markers.forEach(m=>map.removeLayer(m));showCertificate();showToast('All 11 missions are complete!');return;}
  showOnlyActiveMarker();showToast(`Mission ${unlockedStage} is now unlocked.`);setTimeout(focusActiveMarker,450);
}
function updateScoreboard(entry,save=true){let scores=[];try{scores=JSON.parse(localStorage.getItem(STORAGE.scoreboard)||'[]');}catch(e){}if(scores.includes(entry))return;appendScore(entry);updateScoreUI();if(save){scores.push(entry);localStorage.setItem(STORAGE.scoreboard,JSON.stringify(scores));}}
function focusActiveMarker(){const marker=activeMarker();if(!marker||completedCount()>=TOTAL_STAGES_NEEDED)return;map.setView(marker.getLatLng(),Math.max(map.getZoom(),0),{animate:true});marker.openTooltip?.();}
function showToast(message){document.getElementById('toast-message').textContent=message;const toast=document.getElementById('success-toast');toast.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>toast.classList.remove('show'),3000);}
function setCertificate(){document.getElementById('certificate-team').textContent=team||localStorage.getItem(STORAGE.team)||'';document.getElementById('certificate-class').textContent=className||localStorage.getItem(STORAGE.className)||'';document.getElementById('certificate-date').textContent=new Date().toLocaleString('en-SG',{timeZone:'Asia/Singapore',dateStyle:'medium',timeStyle:'short'});}
function closeCertificate(){document.getElementById('certificate-overlay').style.display='none';}
function closeClue(){document.getElementById('clue-overlay').style.display='none';}
function showCertificate(){if(completedCount()<TOTAL_STAGES_NEEDED)return;setCertificate();document.getElementById('certificate-overlay').style.display='flex';}
function resetGame(){if(!confirm('Restart the game? Team details and all mission progress on this device will be cleared.'))return;Object.values(STORAGE).forEach(key=>localStorage.removeItem(key));location.reload();}


let evidenceObjectUrl=null;
function clearEvidencePreview(){
  if(evidenceObjectUrl){URL.revokeObjectURL(evidenceObjectUrl);evidenceObjectUrl=null;}
  const box=document.getElementById('evidence-preview'),img=document.getElementById('image-preview'),video=document.getElementById('video-preview');
  if(box)box.classList.remove('show');if(img){img.removeAttribute('src');img.style.display='none';}if(video){video.pause();video.removeAttribute('src');video.style.display='none';}
}
function previewEvidence(file){
  clearEvidencePreview();if(!file)return;
  evidenceObjectUrl=URL.createObjectURL(file);
  const box=document.getElementById('evidence-preview'),img=document.getElementById('image-preview'),video=document.getElementById('video-preview'),type=document.getElementById('preview-type');
  if(file.type.startsWith('image/')){img.src=evidenceObjectUrl;img.style.display='block';type.textContent='Photo preview';}
  else if(file.type.startsWith('video/')){video.src=evidenceObjectUrl;video.style.display='block';type.textContent='Video preview';}
  else{type.textContent='Selected file';}
  box.classList.add('show');
}
let timerInterval=null;
function formatRemaining(ms){const total=Math.max(0,Math.ceil(ms/1000)),h=Math.floor(total/3600),m=Math.floor((total%3600)/60),s=total%60;return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}
function updateTimer(){
  const timer=document.getElementById('game-timer'),wrap=document.querySelector('.timer-summary'),note=document.getElementById('timer-note');if(!timer||!wrap)return;
  const start=Number(localStorage.getItem(STORAGE.startTime));
  if(!start){timer.textContent='02:00:00';note.textContent='Timer starts when your adventure begins.';return;}
  const remaining=GAME_DURATION_MS-(Date.now()-start);timer.textContent=formatRemaining(remaining);wrap.classList.remove('warning','danger','finished');
  if(remaining<=0){wrap.classList.add('finished');note.textContent="Time's up — return to the meeting point.";if(!localStorage.getItem(STORAGE.timeUpShown)){localStorage.setItem(STORAGE.timeUpShown,'true');document.getElementById('timeup-overlay').style.display='flex';}}
  else if(remaining<=10*60*1000){wrap.classList.add('danger');note.textContent='Less than 10 minutes remaining.';}
  else if(remaining<=30*60*1000){wrap.classList.add('warning');note.textContent='Less than 30 minutes remaining.';}
  else note.textContent='Complete 11 missions before time runs out.';
}
function startTimer(){clearInterval(timerInterval);updateTimer();if(localStorage.getItem(STORAGE.startTime))timerInterval=setInterval(updateTimer,1000);}

window.uploadToDrive=uploadToDrive;window.completeStage=completeStage;window.closeCertificate=closeCertificate;window.closeClue=closeClue;window.showCertificate=showCertificate;window.resetGame=resetGame;

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('team-name').value=team;document.getElementById('team-class').value=className;
  document.getElementById('team-form-overlay').style.display=team&&className?'none':'flex';
  document.getElementById('start-game-btn').addEventListener('click',submitTeamDetails);
  const hintBtn=document.getElementById('hint-btn');
  const hintBox=document.getElementById('hint-box');
  hintBtn.addEventListener('click',()=>{
    const isShowing=hintBox.classList.toggle('show');
    hintBtn.textContent=isShowing?'💡 Hide hint':'💡 Need a hint?';
    hintBtn.setAttribute('aria-expanded',isShowing?'true':'false');
  });
  ['team-name','team-class'].forEach(id=>document.getElementById(id).addEventListener('keydown',e=>{if(e.key==='Enter')submitTeamDetails();}));
  document.getElementById('media-upload').addEventListener('change',function(){const file=this.files[0];document.getElementById('upload-btn').disabled=!file;document.getElementById('file-name').textContent=file?file.name:'Tap to choose evidence from this device';document.getElementById('upload-success').style.display='none';document.getElementById('complete-level-btn').disabled=true;previewEvidence(file);});document.getElementById('change-evidence-btn').addEventListener('click',()=>document.getElementById('media-upload').click());
  document.getElementById('close-timeup-btn').addEventListener('click',()=>document.getElementById('timeup-overlay').style.display='none');
  document.getElementById('focus-marker-btn').addEventListener('click',focusActiveMarker);document.getElementById('reset-view-btn').addEventListener('click',()=>map.fitBounds(bounds));
  const guide=document.getElementById('guide-overlay');document.getElementById('help-btn').addEventListener('click',()=>guide.style.display='flex');document.getElementById('close-guide-btn').addEventListener('click',()=>guide.style.display='none');
  [document.getElementById('clue-overlay'),document.getElementById('certificate-overlay'),guide].forEach(el=>el.addEventListener('click',e=>{if(e.target===el)el.style.display='none';}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeClue();closeCertificate();guide.style.display='none';}});
  showOnlyActiveMarker();restoreScores();updateDashboard();startTimer();setTimeout(()=>map.invalidateSize(),150);
});
