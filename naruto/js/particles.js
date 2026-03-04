// ─── Particle System ───

const pCanvas = document.getElementById('particles');
const pCtx    = pCanvas.getContext('2d');

let particles = [];

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4 - 1;
    this.life = 1;
    this.decay = 0.015 + Math.random() * 0.025;
    this.size = 1.5 + Math.random() * 3;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy -= 0.02; // float upward
    this.life -= this.decay;
  }

  draw(c) {
    if (this.life <= 0) return;
    c.save();
    c.globalAlpha = this.life * 0.8;
    c.shadowBlur = 10;
    c.shadowColor = this.color;
    c.fillStyle = this.color;
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    c.fill();
    c.restore();
  }
}

function spawnParticles(nx, ny, color, count = 3) {
  const sx = nx * pCanvas.width;
  const sy = ny * pCanvas.height;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(sx, sy, color));
  }
}

function tickParticles() {
  pCanvas.width  = window.innerWidth;
  pCanvas.height = window.innerHeight;
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  particles = particles.filter(p => p.life > 0);
  particles.forEach(p => { p.update(); p.draw(pCtx); });
}
