// Hand pose detection and classification
function classifyPose(landmarks) {
  if (!landmarks || landmarks.length < 21) return 'unknown';

  const wrist = landmarks[0];
  const mcp = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];
  const pip = [landmarks[6], landmarks[10], landmarks[14], landmarks[18]];
  const dip = [landmarks[7], landmarks[11], landmarks[15], landmarks[19]];
  const tip = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
  const thumbTip = landmarks[4];
  const thumbMcp = landmarks[2];
  const indexTip = landmarks[8];
  const middleTip = landmarks[12];

  // Helper: Check if finger is extended
  const isFingerExtended = (tipIdx, mcpIdx, pipIdx, dipIdx) => {
    const tipPoint = landmarks[tipIdx];
    const mcpPoint = landmarks[mcpIdx];
    const pipPoint = landmarks[pipIdx];
    const dipPoint = landmarks[dipIdx];

    const tipToPip = Math.hypot(tipPoint.x - pipPoint.x, tipPoint.y - pipPoint.y);
    const pipToDip = Math.hypot(pipPoint.x - dipPoint.x, pipPoint.y - dipPoint.y);

    return tipToPip > pipToDip * 0.8;
  };

  // Helper: Check thumb is extended
  const isThumbExtended = () => {
    const thumbTipPt = landmarks[4];
    const thumbMcpPt = landmarks[2];
    const distance = Math.hypot(thumbTipPt.x - thumbMcpPt.x, thumbTipPt.y - thumbMcpPt.y);
    return distance > 0.05;
  };

  const indexExtended = isFingerExtended(8, 5, 6, 7);
  const middleExtended = isFingerExtended(12, 9, 10, 11);
  const ringExtended = isFingerExtended(16, 13, 14, 15);
  const pinkyExtended = isFingerExtended(20, 17, 18, 19);
  const thumbExtended = isThumbExtended();

  // OPEN: All fingers extended
  if (indexExtended && middleExtended && ringExtended && pinkyExtended && thumbExtended) {
    return 'open';
  }

  // PEACE: Index and middle extended, others closed
  if (indexExtended && middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'peace';
  }

  // POINT: Only index extended
  if (indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'point';
  }

  // FIST: All fingers closed
  if (!indexExtended && !middleExtended && !ringExtended && !pinkyExtended && !thumbExtended) {
    return 'fist';
  }

  return 'unknown';
}

function getHandCenter(landmarks) {
  if (!landmarks || landmarks.length < 21) return { x: 0, y: 0 };

  let sumX = 0, sumY = 0;
  for (let i = 0; i < landmarks.length; i++) {
    sumX += landmarks[i].x;
    sumY += landmarks[i].y;
  }
  return {
    x: sumX / landmarks.length,
    y: sumY / landmarks.length
  };
}

function getFingerTips(landmarks) {
  if (!landmarks || landmarks.length < 21) return [];

  return [
    landmarks[4],  // Thumb
    landmarks[8],  // Index
    landmarks[12], // Middle
    landmarks[16], // Ring
    landmarks[20]  // Pinky
  ];
}

export { classifyPose, getHandCenter, getFingerTips };
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
