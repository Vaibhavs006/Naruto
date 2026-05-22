// Jutsu effects drawing functions
function drawHandSkeleton(ctx, landmarks, color = '#00d4ff') {
  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.fillStyle = '#ffffff';

  // Draw connections
  const HAND_CONNECTIONS = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [0, 9], [9, 10], [10, 11], [11, 12],
    [0, 13], [13, 14], [14, 15], [15, 16],
    [0, 17], [17, 18], [18, 19], [19, 20]
  ];

  HAND_CONNECTIONS.forEach(([start, end]) => {
    const p1 = landmarks[start];
    const p2 = landmarks[end];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  });

  // Draw landmarks
  landmarks.forEach((landmark) => {
    ctx.beginPath();
    ctx.arc(landmark.x, landmark.y, 2, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawFireball(ctx, centerX, centerY, power, color = '#ff6b00') {
  ctx.save();
  ctx.globalAlpha = power * 0.8;

  // Outer ring
  const outerRadius = 50 + power * 100;
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.5, color + '80');
  gradient.addColorStop(1, color + '00');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.fill();

  // Inner glow
  ctx.fillStyle = color;
  ctx.globalAlpha = power;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 30 + power * 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawShadowClone(ctx, sourceX, sourceY, offsetX, offsetY, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity * 0.3;
  ctx.fillStyle = '#000';
  ctx.globalCompositeOperation = 'multiply';

  // Simple clone effect - circle placeholder
  ctx.beginPath();
  ctx.arc(sourceX + offsetX, sourceY + offsetY, 20, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawAmaterasu(ctx, centerX, centerY, power) {
  ctx.save();
  ctx.globalAlpha = power * 0.6;
  ctx.fillStyle = '#000';
  ctx.globalCompositeOperation = 'multiply';

  // Dark flames
  const flameSize = 80 + power * 100;
  ctx.beginPath();
  ctx.arc(centerX, centerY, flameSize, 0, Math.PI * 2);
  ctx.fill();

  // Crimson glow at edges
  ctx.globalAlpha = power * 0.4;
  const glowGradient = ctx.createRadialGradient(centerX, centerY, flameSize * 0.7, centerX, centerY, flameSize);
  glowGradient.addColorStop(0, '#ff000000');
  glowGradient.addColorStop(1, '#ff0000');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, flameSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawLightningBlade(ctx, startX, startY, endX, endY, power) {
  ctx.save();
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3 + power * 5;
  ctx.globalAlpha = power;

  // Multiple lines for lightning effect
  for (let i = 0; i < 3; i++) {
    const offset = (Math.random() - 0.5) * 20;
    ctx.beginPath();
    ctx.moveTo(startX + offset, startY);
    ctx.lineTo(endX + offset, endY);
    ctx.stroke();
  }

  // Glow
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 20 * power;
  ctx.strokeStyle = '#66ffff';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  ctx.restore();
}

function drawCherryBlossom(ctx, centerX, centerY, power) {
  ctx.save();
  ctx.globalAlpha = power * 0.7;
  ctx.fillStyle = '#ff69b4';

  // Petal circles
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const distance = 30 + power * 30;
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    ctx.beginPath();
    ctx.arc(x, y, 10 + power * 10, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawChakraPunch(ctx, handX, handY, power, color = '#ff69b4') {
  ctx.save();
  ctx.globalAlpha = power;
  const radius = 40 + power * 60;

  const gradient = ctx.createRadialGradient(handX, handY, 0, handX, handY, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, color + '00');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(handX, handY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawHealing(ctx, centerX, centerY, power) {
  ctx.save();
  ctx.globalAlpha = power * 0.5;

  // Green glow
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 + power * 80);
  gradient.addColorStop(0, '#00ff00');
  gradient.addColorStop(1, '#00ff0000');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 100 + power * 80, 0, Math.PI * 2);
  ctx.fill();

  // Healing symbol (cross)
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  ctx.globalAlpha = power * 0.7;
  const size = 20 + power * 20;
  ctx.beginPath();
  ctx.moveTo(centerX - size, centerY);
  ctx.lineTo(centerX + size, centerY);
  ctx.moveTo(centerX, centerY - size);
  ctx.lineTo(centerX, centerY + size);
  ctx.stroke();

  ctx.restore();
}

function drawTsukuyomi(ctx, centerX, centerY, power) {
  ctx.save();
  ctx.globalAlpha = power * 0.6;

  // Dark red spiral effect
  ctx.strokeStyle = '#8b0000';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const radius = 30 + i * 15 + power * 20;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Center glow
  const glowGradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 80 + power * 60);
  glowGradient.addColorStop(0, '#ff0000');
  glowGradient.addColorStop(1, '#ff000000');
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 80 + power * 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function applyScreenShake(canvas) {
  const shakeX = (Math.random() - 0.5) * 8;
  const shakeY = (Math.random() - 0.5) * 8;
  canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
}

function applyFlash(canvas) {
  canvas.classList.add('flash');
  setTimeout(() => canvas.classList.remove('flash'), 200);
}

export {
  drawHandSkeleton,
  drawFireball,
  drawShadowClone,
  drawAmaterasu,
  drawLightningBlade,
  drawCherryBlossom,
  drawChakraPunch,
  drawHealing,
  drawTsukuyomi,
  applyScreenShake,
  applyFlash
};
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
