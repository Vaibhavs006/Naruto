// ─── HUD Updates ───
// Depends on: characters.js (selectedCharacter)

const barL = document.getElementById('bar-l');
const barR = document.getElementById('bar-r');
const poseLabelL = document.getElementById('pose-label-l');
const poseLabelR = document.getElementById('pose-label-r');

let instructionsFaded = false;

function fadeInstructions() {
  if (instructionsFaded) return;
  instructionsFaded = true;
  document.getElementById('instructions').classList.add('fade');
}

function getJutsuName(pose) {
  if (!selectedCharacter || pose === 'none') return '—';
  return selectedCharacter.jutsu[pose] || '—';
}

function getBarClassName(pose) {
  if (!selectedCharacter || pose === 'none') return 'rasengan';
  return selectedCharacter.barClass[pose] || 'rasengan';
}

function updatePowerBars(pwrLeft, pwrRight, poseLeft, poseRight) {
  barL.style.width = `${pwrLeft * 100}%`;
  barR.style.width = `${pwrRight * 100}%`;

  // Update bar color class using character data
  barL.className = `bar-fill ${getBarClassName(poseLeft || 'none')}`;
  barR.className = `bar-fill ${getBarClassName(poseRight || 'none')}`;

  // Update pose labels using character jutsu names
  poseLabelL.textContent = getJutsuName(poseLeft || 'none');
  poseLabelR.textContent = getJutsuName(poseRight || 'none');
}
