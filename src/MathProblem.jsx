"use client";
import * as React from "react";

function MathProblem({ problem, onAnswer, disabled }) {
  const handleChoiceClick = (choice) => {
    if (!disabled) {
      onAnswer(choice);
    }
  };

  return (
    <div className="text-center mb-8">
      <h3 className="text-4xl font-bold mb-8 text-gray-800">
        {problem.question} = ?
      </h3>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {problem.choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleChoiceClick(choice)}
            disabled={disabled}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white text-2xl font-bold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MathProblem;
