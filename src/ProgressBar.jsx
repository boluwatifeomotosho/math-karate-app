import * as React from "react";

function ProgressBar({ current, total, icons = [] }) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full mb-6">
      {/* Icons above progress bar */}
      <div className="flex justify-start mb-2 h-8">
        {icons.map((icon, index) => (
          <div
            key={index}
            className="flex items-center justify-center w-8 h-8 mr-1"
            style={{ marginLeft: `${(index / total) * 100}%` }}
          >
            {icon.type === "lightning" && (
              <span className="text-yellow-400 text-xl">⚡</span>
            )}
            {icon.type === "star" && (
              <span className="text-yellow-500 text-xl">⭐</span>
            )}
            {icon.type === "x" && (
              <span className="text-red-500 text-xl">❌</span>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress text */}
      <div className="text-center mt-2 text-sm text-gray-600">
        {current} / {total}
      </div>
    </div>
  );
}

export default ProgressBar;
