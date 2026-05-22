// Particle system for chakra effects
class Particle {
  constructor(x, y, color, vx, vy, life = 1) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.size = Math.random() * 4 + 2;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15; // gravity
    this.life -= 0.02;
  }

  draw(ctx) {
    const alpha = (this.life / this.maxLife) * 0.6;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  spawn(x, y, color, count = 10, speed = 3) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const vel = Math.random() * speed;
      const vx = Math.cos(angle) * vel;
      const vy = Math.sin(angle) * vel - 1;
      this.particles.push(new Particle(x, y, color, vx, vy));
    }
  }

  spawnBurst(x, y, color, count = 20, speed = 5) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push(new Particle(x, y, color, vx, vy, 0.8));
    }
  }

  update() {
    this.particles = this.particles.filter(p => !p.isDead());
    this.particles.forEach(p => p.update());
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }

  clear() {
    this.particles = [];
  }
}

export { Particle, ParticleSystem };
