// Main entry point - character select, game loop, MediaPipe setup
import CHARACTERS from './characters.js';
import { ParticleSystem } from './particles.js';
import * as Effects from './effects.js';
import { classifyPose, getHandCenter, getFingerTips } from './handTracking.js';
import HUD from './hud.js';

let currentCharacter = null;
let selectedCharacterKey = null;
let hands = null;
let camera = null;
let particles = new ParticleSystem();
let hud = null;
let gameActive = false;

const videoElement = document.getElementById('v_src');
const canvasElement = document.getElementById('out');
const ctx = canvasElement.getContext('2d');

const narutoFx = document.getElementById('naruto-fx');
const sasukeFx = document.getElementById('sasuke-fx');

let handStates = {
  left: { pose: 'unknown', power: 0, wasActive: false, chargeTime: 0 },
  right: { pose: 'unknown', power: 0, wasActive: false, chargeTime: 0 }
};

// ===== CHARACTER SELECT UI =====
function showCharacterSelect() {
  const selectScreen = document.getElementById('character-select');
  const charGrid = selectScreen.querySelector('.char-grid');
  charGrid.innerHTML = '';

  Object.entries(CHARACTERS).forEach(([key, char]) => {
    const card = document.createElement('div');
    card.className = `char-card ${key}`;
    card.innerHTML = `
      <div class="char-emoji">${char.emoji}</div>
      <div class="char-name">${char.name}</div>
      <div class="char-poses">${char.poses.join(' • ')}</div>
      <div class="char-jutsu">
        ${char.jutsu.map(j => `<div>${j.name}</div>`).join('')}
      </div>
    `;
    card.addEventListener('click', () => selectCharacter(key));
    charGrid.appendChild(card);
  });

  selectScreen.classList.remove('hidden');
}

function selectCharacter(key) {
  selectedCharacterKey = key;
  currentCharacter = CHARACTERS[key];
  document.body.className = `theme-${currentCharacter.theme}`;

  const selectScreen = document.getElementById('character-select');
  selectScreen.classList.add('hidden');

  // Initialize game
  initializeGame();
  startGame();
}

// ===== GAME INITIALIZATION =====
async function initializeGame() {
  if (hud === null) {
    hud = new HUD();
  }

  canvasElement.width = videoElement.videoWidth || window.innerWidth;
  canvasElement.height = videoElement.videoHeight || window.innerHeight;

  if (hands === null) {
    hands = new Hands({
      locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65
    });

    hands.onResults(onHandResults);
  }

  if (camera === null) {
    camera = new Camera(videoElement, {
      onFrame: async () => {
        if (hands) await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720
    });
    camera.start();
  }

  gameActive = true;
  hud.show();
}

// ===== HAND RESULTS CALLBACK =====
function onHandResults(results) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  ctx.save();
  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  narutoFx.style.display = 'none';
  sasukeFx.style.display = 'none';

  let handDetected = { left: false, right: false };

  if (results.multiHandLandmarks && results.multiHandedness) {
    results.multiHandLandmarks.forEach((landmarks, i) => {
      const handedness = results.multiHandedness[i].label;
      const isRight = handedness === 'Right';
      const handKey = isRight ? 'right' : 'left';

      handDetected[handKey] = true;

      // Draw skeleton
      Effects.drawHandSkeleton(ctx, landmarks, currentCharacter.primaryColor);

      // Classify pose
      const pose = classifyPose(landmarks);
      handStates[handKey].pose = pose;

      // Find matching jutsu
      const matchingJutsu = currentCharacter.jutsu.find(j => j.pose === pose);
      const isValidPose = currentCharacter.poses.includes(pose);

      if (isValidPose && matchingJutsu) {
        handStates[handKey].power = Math.min(1, handStates[handKey].power + 0.08);
        handStates[handKey].chargeTime++;

        // Update HUD
        hud.updatePowerBar(isRight, handStates[handKey].power);
        hud.updateJutsuLabel(isRight, matchingJutsu.name);

        // Spawn particles from fingertips
        if (handStates[handKey].chargeTime % 3 === 0) {
          const fingertips = getFingerTips(landmarks);
          fingertips.forEach(tip => {
            particles.spawn(tip.x, tip.y, currentCharacter.particleColor, 3, 2);
          });
        }

        // Trigger jutsu effects at power threshold
        if (handStates[handKey].power > 0.3 && !handStates[handKey].wasActive) {
          triggerJutsuEffect(isRight, matchingJutsu, landmarks);
          handStates[handKey].wasActive = true;
          Effects.applyScreenShake(canvasElement);
        }

        // Draw jutsu effect on canvas
        const handCenter = getHandCenter(landmarks);
        drawJutsuEffect(ctx, matchingJutsu.fx, handCenter.x, handCenter.y, handStates[handKey].power);

      } else {
        handStates[handKey].power = Math.max(0, handStates[handKey].power - 0.1);
        handStates[handKey].chargeTime = 0;
        handStates[handKey].wasActive = false;
        hud.updateJutsuLabel(isRight, '');
      }
    });
  }

  // Decay power when hand not detected
  if (!handDetected.left) {
    handStates.left.power = Math.max(0, handStates.left.power - 0.1);
    handStates.left.chargeTime = 0;
    handStates.left.wasActive = false;
    hud.updateJutsuLabel(false, '');
  }
  if (!handDetected.right) {
    handStates.right.power = Math.max(0, handStates.right.power - 0.1);
    handStates.right.chargeTime = 0;
    handStates.right.wasActive = false;
    hud.updateJutsuLabel(true, '');
  }

  // Update particle system
  particles.update();
  particles.draw(ctx);

  ctx.restore();
}

// ===== DRAW JUTSU EFFECTS ON CANVAS =====
function drawJutsuEffect(ctx, effectType, x, y, power) {
  const color = currentCharacter.primaryColor;

  switch (effectType) {
    case 'rasengan':
    case 'chidori':
      Effects.drawFireball(ctx, x, y, power, color);
      break;
    case 'fireball':
      Effects.drawFireball(ctx, x, y, power, '#ff6b00');
      break;
    case 'shadowClone':
      for (let i = 0; i < 3; i++) {
        Effects.drawShadowClone(ctx, x, y, (i - 1) * 60, 0, power);
      }
      break;
    case 'amaterasu':
      Effects.drawAmaterasu(ctx, x, y, power);
      break;
    case 'lightningBlade':
      Effects.drawLightningBlade(ctx, x, y - 50, x, y + 100, power);
      break;
    case 'cherryBlossom':
      Effects.drawCherryBlossom(ctx, x, y, power);
      break;
    case 'chakraPunch':
      Effects.drawChakraPunch(ctx, x, y, power, color);
      break;
    case 'healing':
      Effects.drawHealing(ctx, x, y, power);
      break;
    case 'tsukuyomi':
      Effects.drawTsukuyomi(ctx, x, y, power);
      break;
  }
}

// ===== TRIGGER JUTSU EFFECT (VIDEO + PARTICLES) =====
function triggerJutsuEffect(isRight, jutsu, landmarks) {
  const handCenter = getHandCenter(landmarks);
  const fingertips = getFingerTips(landmarks);

  // Burst particles
  particles.spawnBurst(handCenter.x, handCenter.y, currentCharacter.particleColor, 25, 4);

  // Handle video effects
  if (jutsu.effect === 'video') {
    const videoElem = selectedCharacterKey === 'naruto' ? narutoFx : sasukeFx;
    videoElem.currentTime = 0;
    videoElem.play();

    if (isRight) {
      sasukeFx.style.left = (1 - handCenter.x) * window.innerWidth + 'px';
      sasukeFx.style.top = handCenter.y * window.innerHeight + 'px';
      sasukeFx.style.display = 'block';
      sasukeFx.style.opacity = '0.8';
    } else {
      narutoFx.style.left = (1 - handCenter.x) * window.innerWidth + 'px';
      narutoFx.style.top = handCenter.y * window.innerHeight + 'px';
      narutoFx.style.display = 'block';
      narutoFx.style.opacity = '0.8';
    }
  }

  Effects.applyFlash(canvasElement);
}

// ===== GAME LOOP & STARTUP =====
function startGame() {
  hud.updateInstruction(`Playing as ${currentCharacter.name}. Make a ${currentCharacter.poses.join(', ')} sign!`);
  gameActive = true;
}

function backToCharacterSelect() {
  gameActive = false;
  if (hud) hud.hide();
  particles.clear();
  showCharacterSelect();
}

// ===== EVENT LISTENERS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameActive) {
    backToCharacterSelect();
  }
});

// ===== INITIALIZATION =====
window.addEventListener('load', () => {
  showCharacterSelect();
});

// Make functions available globally if needed
window.selectCharacter = selectCharacter;
window.backToCharacterSelect = backToCharacterSelect;

  // Update instructions for this character's available poses
  updateInstructionsForCharacter();

  // Transition: hide select → show loading → start camera
  document.getElementById('charSelect').classList.add('hide');
  const loading = document.getElementById('loading');
  loading.style.display = '';
  loading.classList.remove('hide');

  startGame();
}

function updateInstructionsForCharacter() {
  const container = document.getElementById('instructions');
  container.innerHTML = '';

  const poseInfo = {
    open:  { dot: selectedCharacter.name === 'Sasuke' || selectedCharacter.name === 'Kakashi' ? 'purple' : selectedCharacter.name === 'Sakura' ? 'pink' : selectedCharacter.name === 'Itachi' ? 'darkred' : 'blue', gesture: '🖐 Open' },
    fist:  { dot: 'orange', gesture: '✊ Fist' },
    peace: { dot: 'cyan',   gesture: '✌️ Peace' },
    point: { dot: 'darkred', gesture: '☝️ Point' }
  };

  selectedCharacter.poses.forEach(pose => {
    const info = poseInfo[pose];
    const name = selectedCharacter.jutsu[pose];
    const item = document.createElement('div');
    item.className = 'inst-item';
    item.innerHTML = `<div class="dot ${info.dot}"></div> ${info.gesture} — ${name}`;
    container.appendChild(item);
  });
}

// ═══════════════════════════════════════════
// GAME LOOP
// ═══════════════════════════════════════════

function onResults(res) {
  if (!gameStarted) return;

  cElement.width  = vElement.videoWidth;
  cElement.height = vElement.videoHeight;
  ctx.save();
  ctx.clearRect(0, 0, cElement.width, cElement.height);

  nVid.style.display = 'none';
  sVid.style.display = 'none';

  let handSeen = [false, false];

  if (res.multiHandLandmarks && res.multiHandedness) {
    res.multiHandLandmarks.forEach((pts, i) => {
      const label = res.multiHandedness[i].label;
      const isR   = label === 'Right';
      const idx   = isR ? 1 : 0;
      handSeen[idx] = true;

      // Classify pose — only allow poses this character supports
      let pose = classifyPose(pts);
      if (!selectedCharacter.poses.includes(pose)) pose = 'none';
      curPose[idx] = pose;

      // Draw hand skeleton with character's color
      drawHand(ctx, pts, pwr[idx], isR, pose);

      // Power charging
      const active = pose !== 'none';
      pwr[idx] += active ? 0.05 : -0.12;
      pwr[idx]  = Math.max(0, Math.min(1, pwr[idx]));

      // Trigger on pose activation
      if (active && wasPose[idx] !== pose) {
        doFlash();
        doShake();

        if (VIDEO_POSES.includes(pose)) {
          const vid = isR ? sVid : nVid;
          vid.currentTime = 0;
          vid.play();
        }
      }
      wasPose[idx] = pose;

      // Pose-specific particles using character colors
      if (pwr[idx] > 0.1) {
        const particleColor = selectedCharacter.particleColors[pose] || '#ffffff';
        let particleTips;
        let spawnRate = pwr[idx] * 0.6;

        if (pose === 'open') {
          particleTips = [8, 12, 16, 20];
        } else if (pose === 'fist') {
          particleTips = [9];
          spawnRate = pwr[idx] * 0.9;
        } else if (pose === 'peace') {
          particleTips = [8, 12];
        } else if (pose === 'point') {
          particleTips = [8];
          spawnRate = pwr[idx] * 0.8;
        }

        if (particleTips) {
          particleTips.forEach(tip => {
            if (Math.random() < spawnRate) {
              spawnParticles(1 - pts[tip].x, pts[tip].y, particleColor,
                1 + Math.floor(pwr[idx] * 2));
            }
          });
        }
      }

      // Pose-specific canvas effects
      if (pwr[idx] > 0.05) {
        if (pose === 'fist') {
          drawFireball(ctx, cElement.width, cElement.height, pts, pwr[idx]);
        } else if (pose === 'peace') {
          drawShadowClone(ctx, cElement.width, cElement.height, pts, pwr[idx]);
        } else if (pose === 'point') {
          drawAmaterasu(ctx, cElement.width, cElement.height, pts, pwr[idx]);
        }
      }

      // Open-hand video FX positioning
      const wrist = pts[0];
      const knk   = pts[9];

      if (pose === 'open' && pwr[idx] > 0.01) {
        if (isR) {
          const tx = (wrist.x + knk.x) / 2;
          const ty = (wrist.y + knk.y) / 2;
          sVid.style.left    = `${(1 - tx) * window.innerWidth}px`;
          sVid.style.top     = `${ty * window.innerHeight}px`;
          sVid.style.display = 'block';
          sVid.style.opacity = pwr[idx];
        } else {
          const dx = knk.x - wrist.x;
          const dy = knk.y - wrist.y;
          const tx = knk.x + (dx * 0.8);
          const ty = knk.y + (dy * 0.8);
          nVid.style.left    = `${(1 - tx) * window.innerWidth}px`;
          nVid.style.top     = `${(ty * window.innerHeight) - 120}px`;
          nVid.style.display = 'block';
          nVid.style.opacity = pwr[idx];
        }
      }
    });
  }

  // Decay when hands leave
  if (!handSeen[0]) {
    pwr[0] = Math.max(0, pwr[0] - 0.12);
    if (curPose[0] === 'open' && pwr[0] > 0.01) {
      nVid.style.display = 'block'; nVid.style.opacity = pwr[0];
    }
    wasPose[0] = 'none';
    curPose[0] = 'none';
  }
  if (!handSeen[1]) {
    pwr[1] = Math.max(0, pwr[1] - 0.12);
    if (curPose[1] === 'open' && pwr[1] > 0.01) {
      sVid.style.display = 'block'; sVid.style.opacity = pwr[1];
    }
    wasPose[1] = 'none';
    curPose[1] = 'none';
  }

  // Cinematic letterbox when any power is high
  setLetterbox(pwr[0] > 0.7 || pwr[1] > 0.7);

  // Update HUD with character-aware bar classes
  updatePowerBars(pwr[0], pwr[1], curPose[0], curPose[1]);

  ctx.restore();
  tickParticles();
}

// ═══════════════════════════════════════════
// MEDIAPIPE SETUP & START
// ═══════════════════════════════════════════

const hands = new Hands({
  locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
});

hands.setOptions({
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.65,
  minTrackingConfidence: 0.65
});

hands.onResults((res) => {
  // Dismiss loading on first result
  document.getElementById('loading').classList.add('hide');
  gameStarted = true;
  // Fade instructions once hands are detected
  if (res.multiHandLandmarks && res.multiHandLandmarks.length > 0) fadeInstructions();
  onResults(res);
});

function startGame() {
  const cam = new Camera(vElement, {
    onFrame: async () => { await hands.send({ image: vElement }); },
    width: 1280,
    height: 720
  });
  cam.start();
}

// ─── Build character cards on page load ───
buildCharacterCards();
