"use client";
import * as React from "react";
import MathProblem from "./MathProblem.jsx";
import ProgressBar from "./ProgressBar.jsx";
import BeltDisplay from "./BeltDisplay";
import { BELT_REQUIREMENTS } from "./gameData.js";
import { getRandomProblems, formatTime } from "./utils.js";

const initialState = {
  gameState: "ready", // ready, playing, completed, failed
  currentProblemIndex: 0,
  problems: [],
  startTime: null,
  problemStartTime: null,
  timeRemaining: 0,
  correctAnswers: 0,
  icons: [],
  results: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME":
      return {
        ...initialState,
        gameState: "playing",
        problems: action.payload.problems,
        timeRemaining: action.payload.timeLimit,
        startTime: Date.now(),
        problemStartTime: Date.now(),
      };
    case "ANSWER_PROBLEM": {
      const { isCorrect, responseTime } = action.payload;
      const iconType = isCorrect
        ? responseTime < 1
          ? "lightning"
          : "star"
        : "x";
      return {
        ...state,
        correctAnswers: state.correctAnswers + (isCorrect ? 1 : 0),
        icons: [...state.icons, { type: iconType, time: responseTime }],
        currentProblemIndex: state.currentProblemIndex + 1,
        problemStartTime: Date.now(),
      };
    }
    case "END_GAME":
      return {
        ...state,
        gameState: action.payload.status,
        results: action.payload.results,
      };
    case "RESET_GAME":
      return initialState;
    case "TICK_TIMER":
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function GameScreen({
  levels,
  currentLevel,
  currentBelt,
  onBeltEarned,
  onLevelUp,
  onFullReset,
}) {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);
  const {
    gameState,
    currentProblemIndex,
    problems,
    startTime,
    problemStartTime,
    timeRemaining,
    correctAnswers,
    icons,
    results,
  } = state;

  const requirements = BELT_REQUIREMENTS[currentBelt];
  const levelProblems = levels[currentLevel] || [];

  // Timer effect
  React.useEffect(() => {
    let interval;
    if (gameState === "playing" && timeRemaining > 0) {
      interval = setInterval(() => {
        if (timeRemaining <= 1) {
          // This check is simplified as the endgame logic handles the final state
          dispatch({ type: "TICK_TIMER" });
          dispatch({
            type: "END_GAME",
            payload: {
              status: "failed",
              results: { ...results, passed: false },
            },
          });
        } else {
          dispatch({ type: "TICK_TIMER" });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeRemaining]);

  const startGame = () => {
    if (levelProblems.length === 0) {
      alert("No problems available for this level!");
      return;
    }

    const selectedProblems = getRandomProblems(
      levelProblems,
      requirements.correct
    );
    dispatch({
      type: "START_GAME",
      payload: {
        problems: selectedProblems,
        timeLimit: requirements.timeLimit,
      },
    });
  };

  const handleAnswer = (selectedAnswer) => {
    const currentProblem = problems[currentProblemIndex];
    const isCorrect = selectedAnswer === currentProblem.correctAnswer;
    const responseTime = (Date.now() - problemStartTime) / 1000;

    // Move to next problem or end game
    if (currentProblemIndex + 1 >= problems.length) {
      // Game completed
      const totalTime = (Date.now() - startTime) / 1000;
      const finalCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
      const passed =
        correctAnswers + (isCorrect ? 1 : 0) >= requirements.correct &&
        totalTime <= requirements.timeLimit;

      const gameResults = {
        passed,
        correctAnswers: correctAnswers + (isCorrect ? 1 : 0),
        totalTime: Math.round(totalTime),
        requiredCorrect: requirements.correct,
        timeLimit: requirements.timeLimit,
      };

      dispatch({
        type: "END_GAME",
        payload: {
          status: passed ? "completed" : "failed",
          results: gameResults,
        },
      });

      if (passed) {
        onBeltEarned();
      }
    } else {
      dispatch({
        type: "ANSWER_PROBLEM",
        payload: { isCorrect, responseTime },
      });
    }
  };

  const resetGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const renderContent = () => {
    switch (gameState) {
      case "ready":
        return (
          <div className="text-center">
            <div className="bg-gray-100 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
              <p className="text-gray-600 mb-4">
                You need to get {requirements.correct} problems correct in{" "}
                {requirements.timeLimit} seconds or less.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Solve the math problems quickly!
              </p>
            </div>
            <button
              onClick={startGame}
              className="bg-blue-600 text-white text-xl font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Start Challenge
            </button>
          </div>
        );
      case "playing": {
        const currentProblem = problems[currentProblemIndex];
        return (
          <>
            <div className="mb-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-600">
                Correct: {correctAnswers} / {requirements.correct}
              </div>
            </div>
            <ProgressBar
              current={currentProblemIndex + 1}
              total={problems.length}
              icons={icons}
            />
            {currentProblem && (
              <MathProblem
                problem={currentProblem}
                onAnswer={handleAnswer}
                disabled={false}
              />
            )}
          </>
        );
      }
      case "completed":
      case "failed":
        return (
          <div className="text-center">
            <div
              className={`rounded-lg p-6 mb-6 ${
                gameState === "completed" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <h3
                className={`text-2xl font-bold mb-4 ${
                  gameState === "completed" ? "text-green-800" : "text-red-800"
                }`}
              >
                {gameState === "completed"
                  ? "🎉 Congratulations!"
                  : "😞 Try Again"}
              </h3>
              {results && (
                <div className="text-left max-w-md mx-auto">
                  <p>
                    <strong>Correct Answers:</strong> {results.correctAnswers} /{" "}
                    {results.requiredCorrect}
                  </p>
                  <p>
                    <strong>Time Taken:</strong> {formatTime(results.totalTime)}{" "}
                    / {formatTime(results.timeLimit)}
                  </p>
                  <p>
                    <strong>Result:</strong>{" "}
                    {results.passed ? "PASSED" : "FAILED"}
                  </p>
                </div>
              )}
            </div>
            <div className="space-x-4">
              <button
                onClick={resetGame}
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
              <button
                onClick={onFullReset}
                className="bg-gray-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Reset Progress
              </button>
              {gameState === "completed" && currentBelt < 12 && (
                <button
                  onClick={() => {
                    onLevelUp();
                    resetGame();
                  }}
                  className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Next Belt
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <BeltDisplay currentBelt={currentBelt} level={currentLevel} />
        {renderContent()}
      </div>
      <footer className="text-center text-gray-500 text-sm mt-8 py-4">
        &copy; 2025 Boluwatife Omotosho
      </footer>
    </>
  );
}

export default GameScreen;
