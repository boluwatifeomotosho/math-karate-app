// Initial math problems and belt system configuration
export const BELT_TYPES = [
  { name: "White", color: "#FFFFFF", border: "#000000" },
  { name: "Yellow", color: "#FFFF00", border: "#000000" },
  { name: "Green", color: "#00FF00", border: "#000000" },
  { name: "Blue", color: "#0000FF", border: "#FFFFFF" },
  { name: "Red", color: "#FF0000", border: "#FFFFFF" },
  { name: "Brown", color: "#8B4513", border: "#FFFFFF" },
  { name: "Black 1st", color: "#000000", border: "#FFFFFF" },
  { name: "Black 2nd", color: "#000000", border: "#FFFFFF" },
  { name: "Black 3rd", color: "#000000", border: "#FFFFFF" },
  { name: "Black 4th", color: "#000000", border: "#FFFFFF" },
  { name: "Black 5th", color: "#000000", border: "#FFFFFF" },
  { name: "Black 6th", color: "#000000", border: "#FFFFFF" },
  { name: "Black 7th", color: "#000000", border: "#FFFFFF" },
];

export const BELT_REQUIREMENTS = {
  // Colored belts: 10 correct in 30 seconds
  0: { correct: 10, timeLimit: 30 }, // White
  1: { correct: 10, timeLimit: 30 }, // Yellow
  2: { correct: 10, timeLimit: 30 }, // Green
  3: { correct: 10, timeLimit: 30 }, // Blue
  4: { correct: 10, timeLimit: 30 }, // Red
  5: { correct: 10, timeLimit: 30 }, // Brown
  // Black belts: 20 correct, decreasing time
  6: { correct: 20, timeLimit: 60 }, // Black 1st
  7: { correct: 20, timeLimit: 55 }, // Black 2nd
  8: { correct: 20, timeLimit: 50 }, // Black 3rd
  9: { correct: 20, timeLimit: 45 }, // Black 4th
  10: { correct: 20, timeLimit: 40 }, // Black 5th
  11: { correct: 20, timeLimit: 35 }, // Black 6th
  12: { correct: 20, timeLimit: 30 }, // Black 7th
};

// Generate math problems that sum to 5
function generateProblemsForLevel(level) {
  const problems = [];
  const difficulty = Math.min(level, 10); // Cap difficulty for variety

  for (let i = 0; i < 50; i++) {
    // Generate 50 problems per level
    let question, correctAnswer;

    // Determine the complexity and range based on difficulty
    const maxTarget = 5 + difficulty * 2; // Target answer up to 25
    const useThreeNumbers = difficulty > 4 && Math.random() > 0.5;

    if (useThreeNumbers) {
      // e.g., a + b - c
      const a = Math.floor(Math.random() * (10 + difficulty));
      const b = Math.floor(Math.random() * (10 + difficulty));
      const c = Math.floor(Math.random() * 10);
      correctAnswer = a + b - c;
      question = `${a} + ${b} - ${c}`;
    } else {
      // Two-number problems: a + b or a - b
      const operation = Math.random() > 0.5 ? "+" : "-";

      if (operation === "+") {
        correctAnswer = Math.floor(Math.random() * maxTarget) + 1; // Avoid 0
        const a = Math.floor(Math.random() * (correctAnswer + 1));
        const b = correctAnswer - a;
        question = `${a} + ${b}`;
      } else {
        // Subtraction
        const a = Math.floor(Math.random() * (10 + difficulty)) + 5;
        const b = Math.floor(Math.random() * a); // Ensure positive result
        correctAnswer = a - b;
        question = `${a} - ${b}`;
      }
    }

    // Create the problem
    const problem = {
      id: `${level}-${i}`,
      question,
      correctAnswer,
      choices: generateChoices(correctAnswer),
    };

    problems.push(problem);
  }
  return problems;
}

function generateChoices(correctAnswer) {
  const choices = [correctAnswer];
  const range = Math.max(5, Math.floor(correctAnswer / 2)); // Dynamic range for wrong answers

  while (choices.length < 4) {
    // Generate a wrong answer by adding/subtracting a random value
    let wrong =
      correctAnswer +
      (Math.floor(Math.random() * range) + 1) * (Math.random() > 0.5 ? 1 : -1);

    if (wrong < 0) {
      wrong = correctAnswer + (Math.floor(Math.random() * range) + 1); // Ensure positive
    }

    if (!choices.includes(wrong)) {
      choices.push(wrong);
    }
  }

  // Shuffle choices
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [choices[i], choices[j]] = [choices[j], choices[i]];
  }

  return choices;
}

// Initialize default levels
export const DEFAULT_LEVELS = {};
for (let level = 1; level <= 10; level++) {
  DEFAULT_LEVELS[level] = generateProblemsForLevel(level);
}
