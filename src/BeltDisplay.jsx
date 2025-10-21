import * as React from "react";
import { BELT_TYPES, BELT_REQUIREMENTS } from "./gameData.js";

function BeltDisplay({ currentBelt, level }) {
  const belt = BELT_TYPES[currentBelt];
  const requirements = BELT_REQUIREMENTS[currentBelt];

  if (!belt || !requirements) return null;

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-4">Level {level}</h2>

      {/* Belt visualization */}
      <div className="flex justify-center mb-4">
        <div
          className="w-32 h-8 rounded-lg border-2 flex items-center justify-center font-bold text-sm"
          style={{
            backgroundColor: belt.color,
            borderColor: belt.border,
            color: belt.name.includes("Black") ? "#FFFFFF" : "#000000",
          }}
        >
          {belt.name} Belt
        </div>
      </div>

      {/* Requirements */}
      <div className="text-sm text-gray-600">
        <p>Get {requirements.correct} correct answers</p>
        <p>in {requirements.timeLimit} seconds or less</p>
      </div>
    </div>
  );
}

export default BeltDisplay;
