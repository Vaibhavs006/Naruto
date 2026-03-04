// ─── Hand Pose Detection ───
// MediaPipe hand landmarks:
//  0=wrist, 4=thumb_tip, 8=index_tip, 12=middle_tip, 16=ring_tip, 20=pinky_tip
//  5=index_mcp, 6=index_pip, 9=middle_mcp, 10=middle_pip
//  13=ring_mcp, 14=ring_pip, 17=pinky_mcp, 18=pinky_pip

/**
 * Check if a finger is extended by comparing tip-to-wrist vs pip-to-wrist distance.
 */
function isFingerExtended(pts, tipIdx, pipIdx) {
  const wrist = pts[0];
  const tip = pts[tipIdx];
  const pip = pts[pipIdx];
  return Math.hypot(tip.x - wrist.x, tip.y - wrist.y) >
         Math.hypot(pip.x - wrist.x, pip.y - wrist.y);
}

/**
 * Returns an array of booleans [index, middle, ring, pinky] extended states.
 */
function getFingerStates(pts) {
  return [
    isFingerExtended(pts, 8, 6),   // index
    isFingerExtended(pts, 12, 10), // middle
    isFingerExtended(pts, 16, 14), // ring
    isFingerExtended(pts, 20, 18)  // pinky
  ];
}

/**
 * Checks if a detected hand is in an "open" position.
 * Returns true if 3+ fingers are extended.
 */
function checkOpen(pts) {
  const fingers = getFingerStates(pts);
  const count = fingers.filter(Boolean).length;
  return count >= 3;
}

/**
 * Checks if hand is making a fist (0-1 fingers extended).
 */
function checkFist(pts) {
  const fingers = getFingerStates(pts);
  const count = fingers.filter(Boolean).length;
  return count <= 1 && !fingers[0]; // no index finger
}

/**
 * Checks if hand is making a peace/victory sign (index + middle extended, ring + pinky curled).
 */
function checkPeace(pts) {
  const [index, middle, ring, pinky] = getFingerStates(pts);
  return index && middle && !ring && !pinky;
}

/**
 * Checks if hand is pointing (only index finger extended).
 */
function checkPoint(pts) {
  const [index, middle, ring, pinky] = getFingerStates(pts);
  return index && !middle && !ring && !pinky;
}

/**
 * Classify the current hand pose.
 * Priority: peace > point > fist > open > none
 * (check specific poses before general ones)
 */
function classifyPose(pts) {
  if (checkPeace(pts)) return 'peace';    // ✌️  Shadow Clone
  if (checkPoint(pts)) return 'point';    // ☝️  Amaterasu
  if (checkOpen(pts))  return 'open';     // 🖐  Rasengan / Chidori
  if (checkFist(pts))  return 'fist';     // ✊  Fireball
  return 'none';
}
