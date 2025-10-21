"use client";
import * as React from "react";
import ConfirmationModal from "./ConfirmationModal";

function AdminPanel({ levels, onUpdateLevels, onClose }) {
  const [selectedLevel, setSelectedLevel] = React.useState(1);
  const [problems, setProblems] = React.useState([]);
  const [editingProblem, setEditingProblem] = React.useState(null);
  const [problemToDelete, setProblemToDelete] = React.useState(null);

  React.useEffect(() => {
    if (levels[selectedLevel]) {
      setProblems([...levels[selectedLevel]]);
    }
  }, [selectedLevel, levels]);

  const handleSaveLevel = () => {
    const updatedLevels = {
      ...levels,
      [selectedLevel]: problems,
    };
    onUpdateLevels(updatedLevels);
    alert(`Level ${selectedLevel} saved successfully!`);
  };

  const handleAddProblem = () => {
    const newProblem = {
      id: `${selectedLevel}-${Date.now()}`,
      question: "0 + 5",
      correctAnswer: 5,
      choices: [5, 4, 6, 3],
    };
    setProblems([...problems, newProblem]);
  };

  const handleEditProblem = (index, field, value) => {
    const updated = [...problems];
    if (field === "choices") {
      updated[index][field] = value
        .split(",")
        .map((v) => parseInt(v.trim()))
        .filter((v) => !isNaN(v));
    } else if (field === "correctAnswer") {
      updated[index][field] = parseInt(value);
    } else {
      updated[index][field] = value;
    }
    setProblems(updated);
  };

  const handleDeleteProblem = (index) => {
    const updated = problems.filter((_, i) => i !== index);
    setProblems(updated);
    setProblemToDelete(null);
  };
  const requestDeleteProblem = (index) => {
    setProblemToDelete(index);
  };

  const handleCreateNewLevel = () => {
    const newLevel = Math.max(...Object.keys(levels).map(Number)) + 1;
    const updatedLevels = {
      ...levels,
      [newLevel]: [],
    };
    onUpdateLevels(updatedLevels);
    setSelectedLevel(newLevel);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto w-full mx-4">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </header>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium">Level:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1"
            >
              {Object.keys(levels).map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateNewLevel}
              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
            >
              Create New Level
            </button>
            <button
              onClick={handleSaveLevel}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Save Level
            </button>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={handleAddProblem}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Problem
          </button>
        </div>

        <div className="space-y-4">
          {problems.map((problem, index) => (
            <div
              key={problem.id}
              className="border border-gray-300 rounded p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Question:
                  </label>
                  <input
                    type="text"
                    value={problem.question}
                    onChange={(e) =>
                      handleEditProblem(index, "question", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Correct Answer:
                  </label>
                  <input
                    type="number"
                    value={problem.correctAnswer}
                    onChange={(e) =>
                      handleEditProblem(index, "correctAnswer", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Choices (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={problem.choices.join(", ")}
                    onChange={(e) =>
                      handleEditProblem(index, "choices", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => requestDeleteProblem(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {problems.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No problems in this level. Click "Add New Problem" to get started.
          </div>
        )}

        <ConfirmationModal
          isOpen={problemToDelete !== null}
          onClose={() => setProblemToDelete(null)}
          onConfirm={() => handleDeleteProblem(problemToDelete)}
          title="Delete Problem"
        >
          Are you sure you want to delete this problem? This action cannot be
          undone.
        </ConfirmationModal>
      </div>
    </div>
  );
}

export default AdminPanel;
