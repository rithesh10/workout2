import axios from "axios";
import React, { useState } from "react";
import config from "../../../config/config";
const PerformanceModal = ({ exerciseName, isOpen, onClose }) => {
  const [sets, setSets] = useState([]);
  const [set, setSet] = useState("");
  const [rep, setRep] = useState("");
  const [weight, setWeight] = useState("");
  const [count, setCount] = useState(1);

  const onAdd = () => {
    if (!set || !rep || !weight) {
      alert("Please fill all fields before adding the set.");
      return;
    }
    const temp = { set: Number(set), rep: Number(rep), weight: Number(weight) };
    setSets((prevSets) => [...prevSets, temp]);
    setCount((prevCount) => prevCount + 1);
    setSet("");
    setRep("");
    setWeight("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (sets.length === 0) {
      alert("Please add at least one set before submitting.");
      return;
    }

    const data = {
      workoutName: exerciseName,
      sets: sets,
    };

    try {
      const response = await axios.post(
        `${config.backendUrl}/add-performance`,
        data,
        {
          withCredentials: true,
          headers: {
            "ngrok-skip-browser-warning": "true", // Add the ngrok-specific header
          },
        }
      );

      if (response.status === 200) {
        alert("Successfully saved the data");
        onClose(); // Close the modal after submission
      }
    } catch (error) {
      console.error("Error submitting performance data:", error);
      alert("Failed to submit performance data. Please try again.");
    }
  };

  if (!isOpen) return null; // Render nothing if modal is not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-xl text-black text-center font-bold mb-4">
          Performance for {exerciseName}
        </h2>

        <div className="mb-4 text-center">
          <div>Set {count}</div>
          <div className="flex flex-col gap-2">
            <label>
              Set
              <input
                type="number"
                value={set}
                onChange={(e) =>
                  setSet(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border bg-white rounded px-2 py-1 w-full"
              />
            </label>
            <label>
              Rep
              <input
                type="number"
                value={rep}
                onChange={(e) =>
                  setRep(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border bg-white rounded px-2 py-1 w-full"
              />
            </label>
            <label>
              Weight
              <input
                type="number"
                value={weight}
                onChange={(e) =>
                  setWeight(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="border bg-white rounded px-2 py-1 w-full"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Set
          </button>
          <button
            onClick={onSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerformanceModal;
