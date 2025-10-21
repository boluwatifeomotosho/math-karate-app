export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getRandomProblems(levelProblems, count) {
  const shuffled = [...levelProblems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function calculateBeltIndex(level, belt) {
  return (level - 1) * 13 + belt;
}

export function getBeltFromIndex(beltIndex) {
  const level = Math.floor(beltIndex / 13) + 1;
  const belt = beltIndex % 13;
  return { level, belt };
}
