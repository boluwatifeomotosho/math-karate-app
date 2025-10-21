"use client";
import * as React from "react";
import GameScreen from "./GameScreen";
import AdminPanel from "./AdminPanel.jsx";
import { DEFAULT_LEVELS } from "./gameData.js";
import ConfirmationModal from "./ConfirmationModal.jsx";

function MathApp() {
  const [currentLevel, setCurrentLevel] = React.useState(1);
  const [currentBelt, setCurrentBelt] = React.useState(0);
  const [levels, setLevels] = React.useState(DEFAULT_LEVELS);
  const [showAdmin, setShowAdmin] = React.useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = React.useState(false);
  const [adminPassword, setAdminPassword] = React.useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = React.useState(false);

  // Load saved progress from localStorage
  React.useEffect(() => {
    const savedProgress = localStorage.getItem("mathAppProgress");
    if (savedProgress) {
      const { level, belt } = JSON.parse(savedProgress);
      setCurrentLevel(level);
      setCurrentBelt(belt);
    }

    const savedLevels = localStorage.getItem("mathAppLevels");
    if (savedLevels) {
      setLevels(JSON.parse(savedLevels));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (level, belt) => {
    localStorage.setItem("mathAppProgress", JSON.stringify({ level, belt }));
  };

  const handleBeltEarned = () => {
    let newBelt = currentBelt + 1;
    let newLevel = currentLevel;

    // Check if we need to advance to next level
    if (newBelt >= 13) {
      newLevel = currentLevel + 1;
      newBelt = 0;
    }

    setCurrentBelt(newBelt);
    setCurrentLevel(newLevel);
    saveProgress(newLevel, newBelt);
  };

  const handleLevelUp = () => {
    const newBelt = currentBelt + 1;
    setCurrentBelt(newBelt);
    saveProgress(currentLevel, newBelt);
  };

  const handleAdminAccess = () => {
    if (adminPassword === "PIANO") {
      setShowAdmin(true);
      setShowPasswordPrompt(false);
      setAdminPassword("");
    } else {
      alert("Incorrect password!");
      setAdminPassword("");
    }
  };

  const handleUpdateLevels = (newLevels) => {
    setLevels(newLevels);
    localStorage.setItem("mathAppLevels", JSON.stringify(newLevels));
  };

  const resetProgress = () => {
    setCurrentLevel(1);
    setCurrentBelt(0);
    localStorage.removeItem("mathAppProgress");
    setIsResetConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Math Karate</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPasswordPrompt(true)}
                className="text-sm bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
              >
                Admin
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(true)}
                className="text-sm bg-red-200 text-red-700 px-3 py-1 rounded hover:bg-red-300"
              >
                Reset Progress
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="py-8">
        <GameScreen
          levels={levels}
          currentLevel={currentLevel}
          currentBelt={currentBelt}
          onBeltEarned={handleBeltEarned}
          onLevelUp={handleLevelUp}
          onFullReset={resetProgress}
        />
      </main>

      {/* Password prompt modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Admin Access</h3>
            <input
              type="password"
              placeholder="Enter admin password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdminAccess()}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAdminAccess}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Access
              </button>
              <button
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setAdminPassword("");
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin panel */}
      {showAdmin && (
        <AdminPanel
          levels={levels}
          onUpdateLevels={handleUpdateLevels}
          onClose={() => setShowAdmin(false)}
        />
      )}

      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetProgress}
        title="Reset All Progress"
      >
        Are you sure you want to reset all progress? This action cannot be
        undone.
      </ConfirmationModal>
    </div>
  );
}

export default MathApp;
