// ─── Main Entry Point ───
// Depends on: characters.js, particles.js, effects.js, handTracking.js, hud.js
// Depends on: MediaPipe (hands, camera_utils, drawing_utils)

const vElement = document.getElementById('v_src');
const cElement = document.getElementById('out');
const ctx      = cElement.getContext('2d');
const nVid     = document.getElementById('n');
const sVid     = document.getElementById('s');

// ─── State ───
let pwr      = [0, 0];
let wasPose  = ['none', 'none'];
let curPose  = ['none', 'none'];
let gameStarted = false;

const VIDEO_POSES = ['open'];

// ═══════════════════════════════════════════
// CHARACTER SELECT
// ═══════════════════════════════════════════

function buildCharacterCards() {
  const grid = document.getElementById('charGrid');
  Object.entries(CHARACTERS).forEach(([id, char]) => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.dataset.char = id;

    const jutsuTags = Object.values(char.jutsu)
      .map(j => `<span class="jutsu-tag">${j}</span>`).join('');

    card.innerHTML = `
      <div class="char-emoji">${char.emoji}</div>
      <div class="char-name">${char.name}</div>
      <div class="char-role">${char.title}</div>
      <div class="char-jutsu-list">${jutsuTags}</div>
    `;

    card.addEventListener('click', () => onCharacterSelected(id));
    grid.appendChild(card);
  });
}

function onCharacterSelected(id) {
  selectCharacter(id);

  // Update loading screen with character name
  const loadingTitle = document.querySelector('#loading h1');
  loadingTitle.textContent = selectedCharacter.name;

  // Update loading title gradient to character accent
  loadingTitle.style.background = `linear-gradient(135deg, ${selectedCharacter.accent}, ${selectedCharacter.accentGlow}, ${selectedCharacter.accent})`;
  loadingTitle.style.backgroundSize = '200% 200%';
  loadingTitle.style.webkitBackgroundClip = 'text';
  loadingTitle.style.webkitTextFillColor = 'transparent';
  loadingTitle.style.backgroundClip = 'text';
  loadingTitle.style.animation = 'shimmer 2.5s ease infinite';

  // Update loader ring color
  const ring = document.querySelector('.loader-ring');
  ring.style.borderTopColor = selectedCharacter.accent;

  // Update HUD title
  document.querySelector('.hud-title').textContent = `${selectedCharacter.name} — Hand Jutsu`;

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
