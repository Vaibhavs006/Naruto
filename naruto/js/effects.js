// ─── Visual Effects ───

const flash   = document.getElementById('flash');
const letterT = document.querySelector('.letterbox.top');
const letterB = document.querySelector('.letterbox.bottom');

let shaking = false;

function doFlash() {
  flash.style.opacity = '0.25';
  setTimeout(() => flash.style.opacity = '0', 80);
}

function doShake() {
  if (shaking) return;
  shaking = true;
  document.body.classList.add('shake');
  setTimeout(() => {
    document.body.classList.remove('shake');
    shaking = false;
  }, 150);
}

function setLetterbox(active) {
  letterT.classList.toggle('active', active);
  letterB.classList.toggle('active', active);
}

// ─── Draw hand skeleton with dynamic glow ───
// Uses selectedCharacter from characters.js for skeleton colors
function drawHand(ctx, pts, power, isRight, pose) {
  let baseColor, glowColor;

  if (selectedCharacter) {
    baseColor = selectedCharacter.skeleton.base;
    glowColor = selectedCharacter.skeleton.glow;
  } else {
    baseColor = '#666';
    glowColor = '#999';
  }

  const glowSize = 8 + power * 25;

  ctx.save();
  ctx.shadowBlur  = glowSize;
  ctx.shadowColor = glowColor;
  drawConnectors(ctx, pts, HAND_CONNECTIONS, { color: baseColor, lineWidth: 2 + power * 2 });
  drawLandmarks(ctx, pts, { color: '#ffffff', lineWidth: 1, radius: 1.5 + power * 1.5 });
  ctx.restore();

  // extra glow pass at high power
  if (power > 0.5) {
    ctx.save();
    ctx.globalAlpha = (power - 0.5) * 0.6;
    ctx.shadowBlur  = 40;
    ctx.shadowColor = glowColor;
    drawConnectors(ctx, pts, HAND_CONNECTIONS, { color: glowColor, lineWidth: 1 });
    ctx.restore();
  }
}

// ─── Fireball Effect (canvas-drawn expanding fire ring) ───
function drawFireball(ctx, canvasW, canvasH, pts, power) {
  const palm = pts[9]; // middle_mcp as palm center
  const cx = palm.x * canvasW;
  const cy = palm.y * canvasH;
  const radius = 30 + power * 80;
  const time = Date.now() * 0.005;

  ctx.save();

  // Outer fiery glow
  const grad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
  grad.addColorStop(0, `rgba(255, 200, 50, ${power * 0.9})`);
  grad.addColorStop(0.4, `rgba(255, 100, 0, ${power * 0.6})`);
  grad.addColorStop(0.7, `rgba(200, 30, 0, ${power * 0.3})`);
  grad.addColorStop(1, 'rgba(100, 0, 0, 0)');

  ctx.shadowBlur = 40;
  ctx.shadowColor = '#ff6a00';
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner flickering core
  const flicker = Math.sin(time * 3) * 0.15 + 0.85;
  const innerR = radius * 0.4 * flicker;
  const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR);
  innerGrad.addColorStop(0, `rgba(255, 255, 200, ${power * 0.8})`);
  innerGrad.addColorStop(1, `rgba(255, 150, 0, 0)`);
  ctx.fillStyle = innerGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── Shadow Clone Effect (afterimage duplicates) ───
function drawShadowClone(ctx, canvasW, canvasH, pts, power) {
  const time = Date.now() * 0.003;
  const offsets = [
    { x: -40 - power * 30, y: 0,   alpha: 0.3 },
    { x:  40 + power * 30, y: 0,   alpha: 0.3 },
    { x: 0,                y: -30 - power * 20, alpha: 0.2 }
  ];

  offsets.forEach((off, idx) => {
    const shimmer = Math.sin(time + idx * 2) * 5;
    ctx.save();
    ctx.globalAlpha = off.alpha * power;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#67e8f9';

    // Draw ghost skeleton at offset position
    const offsetPts = pts.map(p => ({
      x: p.x + (off.x + shimmer) / canvasW,
      y: p.y + (off.y) / canvasH
    }));
    drawConnectors(ctx, offsetPts, HAND_CONNECTIONS, { color: '#22d3ee', lineWidth: 2 });
    drawLandmarks(ctx, offsetPts, { color: '#a5f3fc', lineWidth: 1, radius: 2 });
    ctx.restore();
  });

  // "Poof" smoke ring around real hand
  if (power > 0.5) {
    const palm = pts[9];
    const cx = palm.x * canvasW;
    const cy = palm.y * canvasH;
    const smokeR = 20 + power * 40;
    ctx.save();
    ctx.globalAlpha = (power - 0.5) * 0.4;
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#67e8f9';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, smokeR + Math.sin(time * 2) * 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

// ─── Amaterasu Effect (dark flames from fingertip) ───
function drawAmaterasu(ctx, canvasW, canvasH, pts, power) {
  const tip = pts[8]; // index fingertip
  const cx = tip.x * canvasW;
  const cy = tip.y * canvasH;
  const time = Date.now() * 0.004;

  ctx.save();

  // Dark flame aura
  const radius = 25 + power * 60;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, `rgba(80, 0, 0, ${power * 0.9})`);
  grad.addColorStop(0.3, `rgba(20, 0, 0, ${power * 0.7})`);
  grad.addColorStop(0.6, `rgba(0, 0, 0, ${power * 0.5})`);
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();

  // Flickering dark tendrils
  const tendrilCount = 5 + Math.floor(power * 4);
  for (let i = 0; i < tendrilCount; i++) {
    const angle = (i / tendrilCount) * Math.PI * 2 + time;
    const len = radius * (0.5 + Math.sin(time * 2 + i) * 0.3);
    const ex = cx + Math.cos(angle) * len;
    const ey = cy + Math.sin(angle) * len;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    // Curved tendril
    const cpx = cx + Math.cos(angle + 0.3) * len * 0.6;
    const cpy = cy + Math.sin(angle + 0.3) * len * 0.6;
    ctx.quadraticCurveTo(cpx, cpy, ex, ey);
    ctx.strokeStyle = `rgba(139, 0, 0, ${power * 0.7})`;
    ctx.lineWidth = 1.5 + power * 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#8b0000';
    ctx.stroke();
  }

  // Red glowing core
  const coreR = 6 + power * 8;
  const flicker = Math.sin(time * 5) * 0.2 + 0.8;
  ctx.globalAlpha = power * flicker;
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#8b0000';
  ctx.fillStyle = '#4a0000';
  ctx.beginPath();
  ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
