// HUD management - power bars, jutsu labels, instructions
class HUD {
  constructor() {
    this.hudElement = document.getElementById('hud');
    this.hudLeft = null;
    this.hudRight = null;
    this.instructionElement = null;
    this.init();
  }

  init() {
    // Create left hand HUD
    this.hudLeft = document.createElement('div');
    this.hudLeft.className = 'hand-hud left';
    this.hudLeft.innerHTML = `
      <div class="hand-label">Left Hand</div>
      <div class="power-bar-bg">
        <div class="power-bar" style="width: 0%"></div>
      </div>
      <div class="jutsu-name"></div>
    `;
    this.hudElement.appendChild(this.hudLeft);

    // Create right hand HUD
    this.hudRight = document.createElement('div');
    this.hudRight.className = 'hand-hud right';
    this.hudRight.innerHTML = `
      <div class="hand-label">Right Hand</div>
      <div class="power-bar-bg">
        <div class="power-bar" style="width: 0%"></div>
      </div>
      <div class="jutsu-name"></div>
    `;
    this.hudElement.appendChild(this.hudRight);

    // Create instruction panel
    this.instructionElement = document.createElement('div');
    this.instructionElement.className = 'instruction';
    this.instructionElement.innerHTML = `
      <div class="instruction-text">Show your hands to activate jutsu. Hold poses to charge power!</div>
    `;
    this.hudElement.appendChild(this.instructionElement);
  }

  updatePowerBar(isRight, power) {
    const hud = isRight ? this.hudRight : this.hudLeft;
    const bar = hud.querySelector('.power-bar');
    bar.style.width = (power * 100) + '%';
  }

  updateJutsuLabel(isRight, jutsuName) {
    const hud = isRight ? this.hudRight : this.hudLeft;
    const label = hud.querySelector('.jutsu-name');
    label.textContent = jutsuName || '';
  }

  updateInstruction(text) {
    if (this.instructionElement) {
      this.instructionElement.querySelector('.instruction-text').textContent = text;
    }
  }

  show() {
    this.hudElement.style.display = 'block';
  }

  hide() {
    this.hudElement.style.display = 'none';
  }
}

export default HUD;
